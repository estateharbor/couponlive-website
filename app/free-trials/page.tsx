import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { TrialGrid } from "@/components/TrialGrid";
import { JsonLd } from "@/components/JsonLd";
import { getTrials, getTrialCategories } from "@/lib/api";
import { SITE, breadcrumbLd, faqLd, trialFaq, trialsItemListLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Trials — verified, no-card options for India",
  description:
    "Discover working free trials for premium software, AI tools, cloud and OTT — built for India. See if a card is needed, the trial length, and the ₹ price after it ends.",
  alternates: { canonical: "/free-trials/" },
  openGraph: {
    title: "Free Trials for premium tools — verified for India",
    description: "No-card trials, trial length, and the exact ₹ renewal price. Honest by design.",
    url: "/free-trials/",
    images: ["/og-image.png"],
  },
};

// Async server component: fetch trials + categories at BUILD time and pass them
// down, so real trial content is in the static HTML for search & AI crawlers.
export default async function FreeTrialsPage() {
  const [trials, categories] = await Promise.all([
    getTrials({ limit: 120, sort: "recommended" }),
    getTrialCategories(),
  ]);
  const faqs = trialFaq("these tools");

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: `${SITE}/` },
            { name: "Free Trials", url: `${SITE}/free-trials/` },
          ]),
          trialsItemListLd(trials),
          faqLd(faqs),
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: "var(--verified-bg)", color: "var(--verified-text)" }}
        >
          💳 No-card trials · 🇮🇳 India-first
        </span>
        <h1 className="font-display font-bold tracking-tight mt-4 text-4xl sm:text-5xl leading-[1.05]" style={{ color: "var(--text)" }}>
          Free plans, trials &amp; credits that <span style={{ color: "var(--verified)" }}>actually work.</span>
        </h1>
        <p className="text-base sm:text-lg text-muted mt-4 max-w-2xl">
          Premium tools&apos; free trials, free plans, credits and student offers — for India, one card
          per tool. We show whether a <strong>card is required</strong>, the <strong>trial length</strong>,
          and the exact <strong>₹ price after it ends</strong>. Facts we can&apos;t confirm say
          &ldquo;Unknown&rdquo; — never guessed, and conditional offers say &ldquo;Check eligibility.&rdquo;
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <TrialGrid initial={trials} categories={categories} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--text)" }}>
          Free trials — FAQ
        </h2>
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
