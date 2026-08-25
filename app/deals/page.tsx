import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CouponGrid } from "@/components/CouponGrid";
import { CategoryChips } from "@/components/CategoryChips";

export const metadata: Metadata = {
  title: "Deals feed — freshest verified codes",
  description: "A live feed of the freshest verified coupon codes across India's top stores, sorted by what's working right now.",
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
          Deals feed
        </h1>
        <p className="text-muted mt-2 max-w-2xl">
          Every code here was tested at a real checkout recently. Sorted so the freshest, most-confident
          codes surface first — never stale ones.
        </p>

        <div className="mt-6 mb-6">
          <CategoryChips />
        </div>

        <CouponGrid />
      </section>
    </PageShell>
  );
}
