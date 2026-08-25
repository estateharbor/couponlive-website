import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { MerchantTile } from "@/components/MerchantTile";
import { CATEGORIES, merchantsInCategory, couponsInCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories — verified coupons",
  description: "Browse verified coupon codes by category on CouponLive.",
  alternates: { canonical: "/categories/" },
};

export default function CategoriesPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>Categories</h1>
        <p className="text-muted mt-2">Verified codes grouped by what you&apos;re shopping for.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((c) => {
            const stores = merchantsInCategory(c.slug);
            const count = couponsInCategory(c.slug).length;
            return (
              <Link key={c.slug} href={`/category/${c.slug}/`} className="surface border border-token rounded-xl p-5 hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>{c.name}</p>
                  <p className="text-sm text-muted">{c.blurb}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    {stores.slice(0, 5).map((s) => <MerchantTile key={s.id} name={s.name} size={26} />)}
                    <span className="text-xs text-subtle ml-1">{count} codes</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "var(--brand-blue)" }} />
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
