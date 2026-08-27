"use client";

import { useEffect, useState } from "react";
import { getCoupons } from "@/lib/api";
import type { Coupon } from "@/lib/types";
import { CouponCard } from "./CouponCard";
import { CouponCardSkeleton } from "./CouponCardSkeleton";

// The hero showcase — a real code from the live directory (verified-first),
// badged honestly by the card itself. Renders nothing if there are no codes.
export function FeaturedCode() {
  const [c, setC] = useState<Coupon | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    getCoupons({ listing: true, limit: 1 }).then((rows) => {
      if (alive) setC(rows[0] ?? null);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (c === undefined) return <CouponCardSkeleton />;
  if (c === null) return null;
  return <CouponCard coupon={c} />;
}
