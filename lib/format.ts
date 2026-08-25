import type { Coupon } from "./types";

// Turn discount_type + value into a punchy headline for the card.
export function discountHeadline(c: Pick<Coupon, "discount_type" | "discount_value">): string {
  const v = c.discount_value ?? undefined;
  switch (c.discount_type) {
    case "percentage":
      return v ? `Flat ${trim(v)}% Off` : "% Off";
    case "fixed":
      return v ? `₹${trim(v)} Off` : "₹ Off";
    case "free_shipping":
      return "Free Shipping";
    case "cashback":
      return v ? `${trim(v)}% Cashback` : "Cashback";
    case "bogo":
      return "Buy 1 Get 1";
    default:
      return "Special Offer";
  }
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(0);
}

export function confidencePct(score: number): number {
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}
