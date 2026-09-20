import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { MerchantTile } from "@/components/MerchantTile";
import { CategoryChips } from "@/components/CategoryChips";
import { getMerchants } from "@/lib/api";
import { MOCK_MERCHANTS } from "@/lib/mock";

export const metadata: Metadata = {
  title: "All stores with coupon codes (India)",
  description: "Browse every store on CouponLive that currently has usable coupon codes, refreshed hourly.",
  alternates: { canonical: "/stores/" },
};

export default async function StoresPage() {
  // Live merchants (usable-code counts), fetched at build. Hide zero-inventory
  // stores so the directory never lists a store that renders no codes.
  let merchants: Awaited<ReturnType<typeof getMerchants>> = [];
  try {
    merchants = (await getMerchants())
      .filter((m) => (m.coupon_count ?? 0) > 0)
      .sort((a, b) => (b.coupon_count ?? 0) - (a.coupon_count ?? 0));
  } catch {
    merchants = MOCK_MERCHANTS.filter((m) => (m.coupon_count ?? 0) > 0);
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>All stores</h1>
        <p className="text-muted mt-2">
          {merchants.length} stores with usable coupon codes right now. Codes we&apos;ve checkout-tested
          carry a ✓ Verified badge on the store page.
        </p>
        <div className="mt-5"><CategoryChips /></div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {merchants.map((m) => (
            <Link key={m.id} href={`/store/${m.slug ?? m.normalized_name}/`} className="surface border border-token rounded-xl p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
              <MerchantTile name={m.name} size={44} />
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ color: "var(--text)" }}>{m.name}</p>
                <p className="text-xs text-subtle">
                  {m.coupon_count} {m.coupon_count === 1 ? "code" : "codes"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
