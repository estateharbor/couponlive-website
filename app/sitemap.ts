import type { MetadataRoute } from "next";
import { getMerchants, getTrials, getTrialCategories } from "@/lib/api";
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
    { url: `${SITE}/free-trials/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/how-it-works/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    // /search is intentionally excluded (noindex — internal search results).
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

  // Tool pages for the Free Trials vertical (slugs from the live trials feed).
  const toolPages: MetadataRoute.Sitemap = [];
  try {
    const trials = await getTrials({ limit: 200 });
    for (const slug of new Set(trials.map((t) => t.tool_slug))) {
      toolPages.push({
        url: `${SITE}/tool/${slug}/`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  } catch {
    /* API unreachable at build — the rest of the sitemap still ships */
  }

  // Free-trial hub pages (long-tail): special hubs + one per trial category.
  const hubSlugs = new Set<string>(["no-card", "ai", "student", "startup"]);
  try {
    for (const c of await getTrialCategories()) if (c.category) hubSlugs.add(c.category);
  } catch {
    /* API down at build — special hubs still ship */
  }
  const hubPages: MetadataRoute.Sitemap = [...hubSlugs].map((slug) => ({
    url: `${SITE}/free-trials/${slug}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticPages, ...storePages, ...categoryPages, ...toolPages, ...hubPages];
}
