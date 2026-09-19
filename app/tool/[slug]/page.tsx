import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { TrialCard } from "@/components/TrialCard";
import { MerchantTile } from "@/components/MerchantTile";
import { JsonLd } from "@/components/JsonLd";
import { Byline } from "@/components/Byline";
import { VERIFY_TEAM, reviewedToday } from "@/lib/editorial";
import { getTool, getTrials } from "@/lib/api";
import type { TrialCard as TrialCardT, Tool } from "@/lib/types";
import { SITE, breadcrumbLd, faqLd, softwareAppLd, trialFaq } from "@/lib/seo";

export const dynamicParams = false;

// Known seeded slugs — guarantees output:export always has ≥1 route even if the
// API is briefly unreachable at build (it also unions the live feed below).
const FALLBACK_SLUGS = [
  "chatgpt", "claude", "canva-pro", "notion", "figma",
  "github-student-pack", "aws-activate", "perplexity",
];

export async function generateStaticParams() {
  const slugs = new Set(FALLBACK_SLUGS);
  try {
    for (const t of await getTrials({ limit: 200 })) slugs.add(t.tool_slug);
  } catch {
    /* API unreachable at build — fallback slugs still render */
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);
  if (!tool) return {};
  const title = `${tool.name} free trial in India (2026) — no card? price after?`;
  const description =
    tool.tagline ||
    `${tool.name} free-trial details for India: card required?, trial length, and the ₹ price after it ends. Verified where possible.`;
  return {
    title,
    description,
    alternates: { canonical: `/tool/${slug}/` },
    openGraph: { title, description, url: `/tool/${slug}/`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

function toCards(tool: Tool): TrialCardT[] {
  return tool.offers.map((o) => ({
    id: o.id,
    tool_name: tool.name,
    tool_slug: tool.slug,
    logo_url: tool.logo_url,
    category: tool.category,
    is_ai_tool: tool.is_ai_tool,
    offer_type: o.offer_type,
    title: o.title,
    trial_days: o.trial_days,
    credit_amount: o.credit_amount,
    credit_currency: o.credit_currency,
    card_required: o.card_required,
    india_available: o.india_available,
    eligibility: o.eligibility,
    renew_price_inr: o.renew_price_inr,
    renew_price_usd: o.renew_price_usd,
    renew_period: o.renew_period,
    signup_url: o.signup_url,
    confidence_score: o.confidence_score,
    last_verified_at: o.last_verified_at,
    last_verified_from: o.last_verified_from,
    verification_status: o.verification_status,
    expires_at: o.expires_at,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getTool(slug);

  // Build-safe: a prerendered fallback slug with no live data yet shows a clean
  // "coming soon" page (client can't 404 a static export, and this avoids
  // crashing the build when the API has no trials yet).
  if (!tool) {
    return (
      <PageShell>
        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>
            Trial details coming soon
          </h1>
          <p className="text-muted mt-2">
            We&apos;re verifying this tool&apos;s free trial. Meanwhile, browse{" "}
            <Link href="/free-trials/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>all free trials →</Link>
          </p>
        </section>
      </PageShell>
    );
  }

  const cards = toCards(tool);
  const faqs = trialFaq(tool.name);
  const howTo = tool.offers.find((o) => o.how_to_claim)?.how_to_claim;

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: `${SITE}/` },
            { name: "Free Trials", url: `${SITE}/free-trials/` },
            { name: tool.name, url: `${SITE}/tool/${slug}/` },
          ]),
          softwareAppLd(tool),
          faqLd(faqs),
        ]}
      />

      <section className="border-b border-token">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center gap-4">
          <MerchantTile name={tool.name} logo={tool.logo_url ?? undefined} size={64} />
          <div className="min-w-0">
            <nav className="text-xs text-subtle mb-1">
              <Link href="/" className="hover:underline">Home</Link> ·{" "}
              <Link href="/free-trials/" className="hover:underline">Free Trials</Link>
            </nav>
            <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>
              {tool.name} free trial
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm">
              {tool.category && <span className="text-muted capitalize">{tool.category.replace(/-/g, " ")}</span>}
              {tool.website_url && (
                <a href={tool.website_url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-[color:var(--brand-blue)]">
                  Visit {tool.name} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <div className="mt-2">
              <Byline author={VERIFY_TEAM.name} role={VERIFY_TEAM.role} reviewed={reviewedToday()} team />
            </div>
          </div>
        </div>
      </section>

      {/* Intro copy — real text for search + AI engines. */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <p className="text-muted max-w-3xl leading-relaxed">
          Here are the current <strong>{tool.name} free-trial and free-plan options for India</strong>.
          Each card shows whether a <strong>card is required</strong>, the <strong>trial length</strong>,
          and the <strong>₹ price after the trial</strong> where we know it. Anything we haven&apos;t
          confirmed is shown as &ldquo;Unknown&rdquo; rather than guessed — and only offers we&apos;ve
          checkout-tested carry a ✓ Verified badge.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {cards.length === 0 ? (
          <div className="surface border border-token rounded-xl p-10 text-center text-muted">
            No live trial for {tool.name} right now — check back soon.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <TrialCard key={c.id} trial={c} />
            ))}
          </div>
        )}
      </section>

      {howTo && (
        <section className="mx-auto max-w-6xl px-4 pb-6">
          <h2 className="font-display font-bold text-xl mb-3" style={{ color: "var(--text)" }}>How to claim</h2>
          <p className="text-sm text-muted max-w-3xl whitespace-pre-line leading-relaxed">{howTo}</p>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--text)" }}>
          {tool.name} free trial — FAQ
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
