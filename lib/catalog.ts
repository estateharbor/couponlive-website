import { MOCK_COUPONS, MOCK_MERCHANTS } from "./mock";
import type { Coupon, Merchant } from "./types";

// Category taxonomy + merchant membership. In production this would come from
// the backend; here it's a typed local catalog matching the mock merchants.
export interface Category {
  slug: string;
  name: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { slug: "fashion", name: "Fashion", blurb: "Clothing, footwear & accessories" },
  { slug: "electronics", name: "Electronics", blurb: "Gadgets, audio & appliances" },
  { slug: "beauty", name: "Beauty", blurb: "Skincare, makeup & wellness" },
  { slug: "grocery", name: "Grocery", blurb: "Daily essentials & food" },
];

// merchant slug -> category slug
const MERCHANT_CATEGORY: Record<string, string> = {
  myntra: "fashion",
  ajio: "fashion",
  flipkart: "electronics",
  amazon: "electronics",
  boat: "electronics",
  nykaa: "beauty",
};

export function categoryOf(merchantSlug?: string): string | undefined {
  return merchantSlug ? MERCHANT_CATEGORY[merchantSlug] : undefined;
}

export function getStoreBySlug(slug: string): Merchant | undefined {
  return MOCK_MERCHANTS.find((m) => m.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function merchantsInCategory(categorySlug: string): Merchant[] {
  return MOCK_MERCHANTS.filter((m) => m.slug && MERCHANT_CATEGORY[m.slug] === categorySlug);
}

export function couponsInCategory(categorySlug: string): Coupon[] {
  return MOCK_COUPONS.filter((c) => categoryOf(c.merchant_slug) === categorySlug);
}

export function allStoreSlugs(): string[] {
  return MOCK_MERCHANTS.map((m) => m.slug!).filter(Boolean);
}

export function allCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}

// Lightweight client-side search across stores + coupons.
export function searchCatalog(q: string): { stores: Merchant[]; coupons: Coupon[] } {
  const needle = q.trim().toLowerCase();
  if (!needle) return { stores: [], coupons: [] };
  const stores = MOCK_MERCHANTS.filter((m) => m.name.toLowerCase().includes(needle));
  const coupons = MOCK_COUPONS.filter(
    (c) =>
      (c.merchant_name ?? "").toLowerCase().includes(needle) ||
      (c.description ?? "").toLowerCase().includes(needle) ||
      (c.code ?? "").toLowerCase().includes(needle),
  );
  return { stores, coupons };
}
