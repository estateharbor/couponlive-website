import type { MetadataRoute } from "next";
import { getMerchants } from "@/lib/api";
import { allCategorySlugs, allStoreSlugs } from "@/lib/catalog";
import { SITE } from "@/lib/seo";

// Generated to /sitemap.xml at build. Includes the static pages plus every
// store page (mock slugs unioned with live merchants from the API) and every
// category page, so search engines discover the full site.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/stores/`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE}/categories/`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/deals/`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE}/how-it-works/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/search/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const storeSlugs = new Set(allStoreSlugs());
  try {
    for (const m of await getMerchants()) storeSlugs.add(m.slug ?? m.normalized_name);
  } catch {
    /* API unreachable at build — mock slugs still ship */
  }
  const storePages: MetadataRoute.Sitemap = [...storeSlugs].map((slug) => ({
    url: `${SITE}/store/${slug}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = allCategorySlugs().map((slug) => ({
    url: `${SITE}/category/${slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...storePages, ...categoryPages];
}
