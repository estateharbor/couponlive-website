"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMerchants } from "@/lib/api";
import type { Merchant } from "@/lib/types";
import { MerchantTile } from "./MerchantTile";

// Real stores from the API, most codes first. Counts are honest ("N codes"),
// not a "live/verified" claim.
export function TrendingStores() {
  const [merchants, setMerchants] = useState<Merchant[] | null>(null);

  useEffect(() => {
    let alive = true;
    getMerchants().then((rows) => {
      if (!alive) return;
      const sorted = [...rows].sort((a, b) => (b.coupon_count ?? 0) - (a.coupon_count ?? 0));
      setMerchants(sorted.slice(0, 12));
    });
    return () => {
      alive = false;
    };
  }, []);

  if (merchants === null) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl" style={{ height: 116 }} />
        ))}
      </div>
    );
  }
  if (merchants.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {merchants.map((m) => (
        <Link
          key={m.id}
          href={`/store/${m.slug ?? m.normalized_name}/`}
          className="surface border border-token rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
        >
          <MerchantTile name={m.name} size={48} />
          <span className="text-sm font-semibold text-center line-clamp-1" style={{ color: "var(--text)" }}>
            {m.name}
          </span>
          <span className="text-xs text-subtle">
            {m.coupon_count} {m.coupon_count === 1 ? "code" : "codes"}
          </span>
        </Link>
      ))}
    </div>
  );
}
