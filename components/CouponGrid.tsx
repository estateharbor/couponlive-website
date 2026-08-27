"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { getCoupons } from "@/lib/api";
import { categoryOf } from "@/lib/catalog";
import { sortCoupons, SORT_LABELS, type SortMode } from "@/lib/sort";
import { CouponCard } from "./CouponCard";
import { CouponGridSkeleton } from "./CouponCardSkeleton";

// Client-side data loader used by store / category / deals pages. Keeps the
// page shell static (SEO) while coupons stream in from the API (or mock).
export function CouponGrid({
  merchantSlug,
  categorySlug,
  showControls = true,
  initialSort = "verified",
  verifiedOnlyDefault = false,
  highlightBest = false,
  limit,
}: {
  merchantSlug?: string;
  categorySlug?: string;
  showControls?: boolean;
  initialSort?: SortMode;
  verifiedOnlyDefault?: boolean;
  highlightBest?: boolean;
  limit?: number;
}) {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [sort, setSort] = useState<SortMode>(initialSort);
  const [verifiedOnly, setVerifiedOnly] = useState(verifiedOnlyDefault);

  useEffect(() => {
    let alive = true;
    setCoupons(null);
    // Directory mode: real usable codes (verified + not-yet-verified), each with
    // its true status so cards badge honestly. "Verified only" toggle filters below.
    getCoupons({ listing: true, limit: 200, ...(merchantSlug ? { merchant: merchantSlug } : {}) }).then((all) => {
      if (!alive) return;
      const scoped = categorySlug
        ? all.filter((c) => categoryOf(c.merchant_slug) === categorySlug)
        : all;
      setCoupons(scoped);
    });
    return () => {
      alive = false;
    };
  }, [merchantSlug, categorySlug]);

  const visible = useMemo(() => {
    if (!coupons) return [];
    let list = verifiedOnly ? coupons.filter((c) => c.status === "valid") : coupons;
    list = sortCoupons(list, sort);
    return limit ? list.slice(0, limit) : list;
  }, [coupons, sort, verifiedOnly, limit]);

  if (coupons === null) return <CouponGridSkeleton count={limit ?? 6} />;

  return (
    <div>
      {showControls && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="inline-flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-[color:var(--verified)] w-4 h-4"
            />
            Verified only
          </label>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-subtle">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="surface border border-token rounded-lg text-sm px-2.5 py-1.5"
              aria-label="Sort coupons"
            >
              {(Object.keys(SORT_LABELS) as SortMode[]).map((m) => (
                <option key={m} value={m}>{SORT_LABELS[m]}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="surface border border-token rounded-xl p-10 text-center">
          <SearchX className="w-8 h-8 mx-auto text-subtle" />
          <p className="mt-3 font-display font-semibold" style={{ color: "var(--text)" }}>No codes here right now</p>
          <p className="text-sm text-muted mt-1">Check back soon — our sources refresh hourly.</p>
        </div>
      ) : highlightBest && sort === "verified" ? (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "var(--verified-bg)", color: "var(--brand-blue)" }}>
                ★ Top code
              </span>
            </div>
            <div className="lg:max-w-md">
              <CouponCard coupon={visible[0]} />
            </div>
          </div>
          {visible.length > 1 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.slice(1).map((c) => (
                <CouponCard key={c.id} coupon={c} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <CouponCard key={c.id} coupon={c} />
          ))}
        </div>
      )}
    </div>
  );
}
