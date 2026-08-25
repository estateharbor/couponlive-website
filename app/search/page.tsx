import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search verified coupons",
  description: "Search live-verified coupon codes and stores on CouponLive.",
  alternates: { canonical: "/search/" },
};

export default function SearchPage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-muted">Loading search…</div>}>
        <SearchClient />
      </Suspense>
    </PageShell>
  );
}
