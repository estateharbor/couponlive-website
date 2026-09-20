import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CouponGrid } from "@/components/CouponGrid";
import { CategoryChips } from "@/components/CategoryChips";

export const metadata: Metadata = {
  title: "Latest coupon codes & deals (India) — verified first",
  description: "The latest coupon codes and deals across India's top stores, refreshed hourly. Codes we've checkout-tested carry a ✓ Verified badge and appear first.",
  alternates: { canonical: "/deals/" },
};

export default function DealsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--verified-bg)", color: "var(--verified-text)" }}>
          <span className="inline-block w-2 h-2 rounded-full animate-livePulse" style={{ background: "var(--verified)" }} />
          <Activity className="w-3.5 h-3.5 animate-heartbeat" strokeWidth={2.75} />
          Freshest first
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-3" style={{ color: "var(--text)" }}>
          Latest coupon codes &amp; deals
        </h1>
        <p className="text-muted mt-2 max-w-2xl">
          The freshest codes from our sources across India&apos;s top stores. The ones we&apos;ve
          checkout-tested carry a green <span className="font-semibold" style={{ color: "var(--verified-text)" }}>✓ Verified</span> badge
          and appear first; the rest are the latest available, marked &ldquo;Not verified yet.&rdquo;
        </p>

        <div className="mt-6 mb-6">
          <CategoryChips />
        </div>

        <CouponGrid />
      </section>
    </PageShell>
  );
}
