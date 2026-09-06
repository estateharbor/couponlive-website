import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Generated to /robots.txt at build. Welcomes normal search crawlers AND the
// major AI/answer-engine crawlers explicitly, and points them at the sitemap.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          // Search
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
          "Applebot",
          // AI / answer engines
          "Google-Extended",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Applebot-Extended",
          "Amazonbot",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
