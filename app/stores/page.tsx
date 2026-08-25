import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { MerchantTile } from "@/components/MerchantTile";
import { CategoryChips } from "@/components/CategoryChips";
import { MOCK_MERCHANTS } from "@/lib/mock";

export const metadata: Metadata = {
  title: "All stores — verified coupons",
  description: "Browse every store on CouponLive with live-verified coupon codes.",
  alternates: { canonical: "/stores/" },
};

export default function StoresPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>All stores</h1>
        <p className="text-muted mt-2">Every store we verify, with working codes only.</p>
        <div className="mt-5"><CategoryChips /></div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {MOCK_MERCHANTS.map((m) => (
            <Link key={m.id} href={`/store/${m.slug}/`} className="surface border border-token rounded-xl p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
              <MerchantTile name={m.name} size={44} />
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ color: "var(--text)" }}>{m.name}</p>
                <p className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--verified-text)" }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--verified)" }} />
                  {m.valid_coupon_count} live
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
