import type { Coupon } from "./types";
import { getFreshness } from "./freshness";

export type SortMode = "verified" | "discount" | "newest";

export const SORT_LABELS: Record<SortMode, string> = {
  verified: "Verified first",
  discount: "Biggest discount",
  newest: "Newest",
};

const FRESH_RANK: Record<string, number> = { fresh: 0, recent: 1, aging: 2, stale: 3, invalid: 4 };

function discountMagnitude(c: Coupon): number {
  if (c.discount_value == null) return 0;
  // Percentages and rupee amounts aren't directly comparable; scale percent up
  // so "50% off" ranks near a mid-size rupee amount. Heuristic, good enough.
  return c.discount_type === "percentage" ? c.discount_value * 20 : c.discount_value;
}

export function sortCoupons(coupons: Coupon[], mode: SortMode): Coupon[] {
  const arr = [...coupons];
  if (mode === "discount") {
    arr.sort((a, b) => discountMagnitude(b) - discountMagnitude(a));
  } else if (mode === "newest") {
    arr.sort((a, b) => ts(b.last_validated_at ?? b.last_seen) - ts(a.last_validated_at ?? a.last_seen));
  } else {
    // verified: freshest/most-confident, never surface stale/invalid on top
    arr.sort((a, b) => {
      const fr = FRESH_RANK[getFreshness(a).state] - FRESH_RANK[getFreshness(b).state];
      if (fr !== 0) return fr;
      if (b.confidence_score !== a.confidence_score) return b.confidence_score - a.confidence_score;
      return ts(b.last_validated_at) - ts(a.last_validated_at);
    });
  }
  return arr;
}

function ts(iso: string | null): number {
  return iso ? new Date(iso).getTime() : 0;
}
