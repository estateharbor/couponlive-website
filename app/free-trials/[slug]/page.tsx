import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { TrialCard } from "@/components/TrialCard";
import { JsonLd } from "@/components/JsonLd";
import { getTrials, getTrialCategories } from "@/lib/api";
import type { TrialCard as TrialCardT } from "@/lib/types";
import { SITE, breadcrumbLd, faqLd, hubTrialFaq, trialsItemListLd } from "@/lib/seo";
import { groupByTool } from "@/lib/trials";

export const dynamicParams = false;

// Special hub slugs (targeted long-tail queries) + their fetch params + copy.
type Hub = { title: string; h1: string; intro: string; params: Parameters<typeof getTrials>[0] };
const SPECIAL: Record<string, Hub> = {
  "no-card": {
    title: "Free trials with no credit card (India) — verified",
    h1: "Free trials — no credit card needed",
    intro:
      "Free trials you can start in India without entering a card or UPI mandate — so nothing can auto-charge you. Each is checked live; ✓ Verified means we confirmed it.",
    params: { no_card: true, limit: 120, sort: "verified" },
  },
  ai: {
    title: "AI tools with a free trial in India (2026) — verified",
    h1: "AI tools with a free trial",
    intro:
      "Free trials and free plans for premium AI tools — chat, writing, image, video, coding and more — for India. Card-required flags and ₹ prices shown honestly.",
    params: { ai: true, limit: 120, sort: "verified" },
  },
  student: {
    title: "Student offers & free tools in India — verified",
    h1: "Free tools & offers for students",
    intro:
      "Premium tools free for students in India — with what you need to verify eligibility. Refreshed regularly; ✓ Verified means checked live.",
    params: { offer_type: "student_offer", limit: 120, sort: "verified" },
  },
  startup: {
    title: "Startup credits (AWS, Google, Microsoft) for India — verified",
    h1: "Free startup credits",
    intro:
      "Cloud and SaaS credits for eligible startups — AWS, Google, Microsoft and more. What you get, eligibility, and where to apply.",
    params: { offer_type: "startup_credit", limit: 120, sort: "verified" },
  },
};

async function categorySlugs(): Promise<string[]> {
  try {
    return (await getTrialCategories()).map((c) => c.category).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = new Set<string>(Object.keys(SPECIAL));
  for (const c of await categorySlugs()) slugs.add(c);
  // Guarantee ≥1 route for output:export even if the API is briefly down.
  if (slugs.size === 0) ["no-card", "ai"].forEach((s) => slugs.add(s));
  return [...slugs].map((slug) => ({ slug }));
}

async function resolve(slug: string): Promise<{ h1: string; title: string; intro: string; trials: TrialCardT[] } | null> {
  const special = SPECIAL[slug];
  if (special) {
    const trials = await getTrials(special.params).catch(() => []);
    return { h1: special.h1, title: special.title, intro: special.intro, trials };
  }
  // Category page.
  const cats = await categorySlugs();
  if (!cats.includes(slug)) return null;
  const label = slug.replace(/-/g, " ");
  const trials = await getTrials({ category: slug, limit: 120, sort: "verified" }).catch(() => []);
  return {
    h1: `${label[0].toUpperCase()}${label.slice(1)} free trials`,
    title: `${label[0].toUpperCase()}${label.slice(1)} tools with a free trial in India — verified`,
    intro: `Free trials and free plans for ${label} tools, for India. Card-required flags and ₹ prices shown honestly; ✓ Verified means we checked it live.`,
    trials,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) return {};
  return {
    title: r.title,
    description: r.intro,
    alternates: { canonical: `/free-trials/${slug}/` },
    openGraph: { title: r.title, description: r.intro, url: `/free-trials/${slug}/`, images: ["/og-image.png"] },
  };
}

export default async function TrialHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) {
    return (
      <PageShell>
        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>Not found</h1>
          <p className="text-muted mt-2"><Link href="/free-trials/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>All free trials →</Link></p>
        </section>
      </PageShell>
    );
  }
  const faqs = hubTrialFaq();

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: `${SITE}/` },
            { name: "Free Trials", url: `${SITE}/free-trials/` },
            { name: r.h1, url: `${SITE}/free-trials/${slug}/` },
          ]),
          trialsItemListLd(r.trials),
          faqLd(faqs),
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4">
        <nav className="text-xs text-subtle mb-2">
          <Link href="/" className="hover:underline">Home</Link> ·{" "}
          <Link href="/free-trials/" className="hover:underline">Free Trials</Link>
        </nav>
        <h1 className="font-display font-bold tracking-tight text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>{r.h1}</h1>
        <p className="text-base text-muted mt-3 max-w-2xl">{r.intro}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        {r.trials.length === 0 ? (
          <div className="surface border border-token rounded-xl p-10 text-center text-muted">
            Nothing here right now — <Link href="/free-trials/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>browse all free trials →</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupByTool(r.trials).map((g) => (
              <TrialCard key={g.primary.tool_slug} trial={g.primary} alsoTypes={g.alsoTypes} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--text)" }}>FAQ</h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <details key={f.q} className="surface border border-token rounded-lg p-4">
              <summary className="font-semibold cursor-pointer" style={{ color: "var(--text)" }}>{f.q}</summary>
              <p className="text-sm text-muted mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
