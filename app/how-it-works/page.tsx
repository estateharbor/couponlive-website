import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Search, MonitorCheck, ThumbsUp, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Byline } from "@/components/Byline";
import { FOUNDER } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "How we verify coupon codes",
  description: "How CouponLive checkout-tests coupon codes and marks them ✓ Verified — and how we honestly label the ones we haven't tested yet.",
  alternates: { canonical: "/how-it-works/" },
};

const STEPS = [
  { icon: Search, title: "We gather codes", text: "Codes are collected from stores and trusted affiliate coupon sources across India." },
  { icon: MonitorCheck, title: "We checkout-test them", text: "Where a store allows it, an automated browser adds an item to cart and applies the code at a real checkout — if a discount lands, the code earns a ✓ Verified badge." },
  { icon: Activity, title: "We re-check regularly", text: "Even a working code can die mid-day. Verified codes are re-tested on a schedule; ones we can't test stay marked “Not verified yet.”" },
  { icon: ThumbsUp, title: "You confirm", text: "Your Worked / Didn't-work votes feed a confidence score — honestly shown, amber when it dips." },
];

export default function HowItWorksPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--verified-bg)", color: "var(--verified-text)" }}>
          <span className="inline-block w-2 h-2 rounded-full animate-livePulse" style={{ background: "var(--verified)" }} />
          <Activity className="w-3.5 h-3.5 animate-heartbeat" strokeWidth={2.75} /> How we verify codes
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-4" style={{ color: "var(--text)" }}>
          You always know if a code was tested.
        </h1>
        <p className="text-lg text-muted mt-3">
          Most coupon sites republish scraped codes with no idea if they work. We&apos;re different:
          codes we&apos;ve run through a real checkout carry a green <strong style={{ color: "var(--verified-text)" }}>✓ Verified</strong> badge
          with the time and method; the rest are the latest from our sources, clearly marked
          &ldquo;Not verified yet&rdquo; so you always know what you&apos;re trying.
        </p>
        <div className="mt-4"><Byline author={FOUNDER.name} role={FOUNDER.role} /></div>

        <ol className="mt-10 space-y-6">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "var(--verified-bg)", color: "var(--verified)" }}>
                <s.icon className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <div>
                <p className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>{i + 1}. {s.title}</p>
                <p className="text-muted mt-1">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 surface border border-token rounded-xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--verified)" }} />
          <p className="text-sm text-muted">
            <strong style={{ color: "var(--text)" }}>Honest by design.</strong> No fake countdowns, no
            &ldquo;3 people viewing&rdquo;, no forced signup to reveal a code. If a code&apos;s confidence is low,
            we show it in amber instead of hiding it.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/deals/" className="inline-flex items-center rounded-lg px-5 py-3 font-semibold text-white" style={{ background: "var(--brand-blue)" }}>
            Browse verified deals
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
