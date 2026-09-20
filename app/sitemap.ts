import type { MetadataRoute } from "next";
import { getMerchants, getTrials, getTrialCategories } from "@/lib/api";
import { allStoreSlugs } from "@/lib/catalog";
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
    { url: `${SITE}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/editorial-policy/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE}/corrections/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/affiliate-disclosure/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    // /search is intentionally excluded (noindex — internal search results).
  ];

  // Only list store pages that actually have usable coupons — those are the
  // ones we let search engines index (0-usable store pages are noindex, so
  // advertising them here is inconsistent). Use each merchant's real updated_at
  // as lastmod (not a blanket build timestamp). If the API is down at build,
  // fall back to the mock slugs so the sitemap isn't empty.
  let storePages: MetadataRoute.Sitemap;
  try {
    const seen = new Set<string>();
    storePages = (await getMerchants())
      .filter((m) => (m.coupon_count ?? 0) > 0)
      .map((m) => ({ slug: m.slug ?? m.normalized_name, updated: m.updated_at }))
      .filter((m) => (seen.has(m.slug) ? false : (seen.add(m.slug), true)))
      .map((m) => ({
        url: `${SITE}/store/${m.slug}/`,
        lastModified: m.updated ? new Date(m.updated) : now,
        changeFrequency: "daily",
        priority: 0.8,
      }));
  } catch {
    storePages = allStoreSlugs().map((slug) => ({
      url: `${SITE}/store/${slug}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }));
  }

  // Category pages are noindex today (thin nav taxonomy, not mapped to real
  // per-category inventory yet), so they're intentionally excluded here.

  // Tool pages for the Free Trials vertical (slugs from the live trials feed).
  // lastmod = the tool's most recent verification, when known.
  const toolPages: MetadataRoute.Sitemap = [];
  try {
    const trials = await getTrials({ limit: 200 });
    const lastVerified = new Map<string, number>();
    for (const t of trials) {
      const ts = t.last_verified_at ? new Date(t.last_verified_at).getTime() : 0;
      lastVerified.set(t.tool_slug, Math.max(lastVerified.get(t.tool_slug) ?? 0, ts));
    }
    for (const [slug, ts] of lastVerified) {
      toolPages.push({
        url: `${SITE}/tool/${slug}/`,
        lastModified: ts > 0 ? new Date(ts) : now,
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

  return [...staticPages, ...storePages, ...toolPages, ...hubPages];
}
