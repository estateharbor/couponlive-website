import type { Coupon, Merchant } from "./types";

const minsAgo = (n: number) => new Date(Date.now() - n * 60000).toISOString();
const daysAhead = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

// Brand-accent tiles stand in for real merchant logos (no external fetches in
// a static export). Each is {name, slug, tint}.
export const MOCK_MERCHANTS: Merchant[] = [
  { id: 1, name: "Myntra", normalized_name: "myntra", slug: "myntra", website: "https://myntra.com", coupon_count: 24, valid_coupon_count: 11 },
  { id: 2, name: "Flipkart", normalized_name: "flipkart", slug: "flipkart", website: "https://flipkart.com", coupon_count: 31, valid_coupon_count: 14 },
  { id: 3, name: "Amazon", normalized_name: "amazon", slug: "amazon", website: "https://amazon.in", coupon_count: 19, valid_coupon_count: 8 },
  { id: 4, name: "AJIO", normalized_name: "ajio", slug: "ajio", website: "https://ajio.com", coupon_count: 17, valid_coupon_count: 9 },
  { id: 5, name: "Nykaa", normalized_name: "nykaa", slug: "nykaa", website: "https://nykaa.com", coupon_count: 22, valid_coupon_count: 12 },
  { id: 6, name: "boAt", normalized_name: "boat", slug: "boat", website: "https://boat-lifestyle.com", coupon_count: 9, valid_coupon_count: 5 },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 101, merchant_id: 1, merchant_name: "Myntra", merchant_slug: "myntra",
    code: "MYNTRA400", requires_reveal: true, description: "Flat ₹400 off on orders above ₹1999 — sitewide, new & old users.",
    discount_type: "fixed", discount_value: 400, status: "valid", confidence_score: 0.96,
    first_seen: minsAgo(600), last_seen: minsAgo(4), last_validated_at: minsAgo(4), expires_at: daysAhead(3),
  },
  {
    id: 102, merchant_id: 2, merchant_name: "Flipkart", merchant_slug: "flipkart",
    code: "BIGSAVE10", requires_reveal: true, description: "Extra 10% off on electronics with select bank cards.",
    discount_type: "percentage", discount_value: 10, status: "valid", confidence_score: 0.91,
    first_seen: minsAgo(900), last_seen: minsAgo(9), last_validated_at: minsAgo(9), expires_at: daysAhead(6),
  },
  {
    id: 103, merchant_id: 5, merchant_name: "Nykaa", merchant_slug: "nykaa",
    code: "GLOW25", requires_reveal: true, description: "25% off on skincare above ₹1499. Limited-period beauty deal.",
    discount_type: "percentage", discount_value: 25, status: "valid", confidence_score: 0.88,
    first_seen: minsAgo(300), last_seen: minsAgo(70), last_validated_at: minsAgo(70), expires_at: daysAhead(2),
  },
  {
    id: 104, merchant_id: 4, merchant_name: "AJIO", merchant_slug: "ajio",
    code: "AJIO750", requires_reveal: true, description: "₹750 off on ₹2999+ across fashion & footwear.",
    discount_type: "fixed", discount_value: 750, status: "valid", confidence_score: 0.72,
    first_seen: minsAgo(2000), last_seen: minsAgo(300), last_validated_at: minsAgo(300), expires_at: daysAhead(9),
  },
  {
    id: 105, merchant_id: 6, merchant_name: "boAt", merchant_slug: "boat",
    code: "BOATSHIP", requires_reveal: false, description: "Free shipping on all audio, no minimum.",
    discount_type: "free_shipping", discount_value: null, status: "valid", confidence_score: 0.64,
    first_seen: minsAgo(5000), last_seen: minsAgo(680), last_validated_at: minsAgo(680), expires_at: null,
  },
  {
    id: 106, merchant_id: 3, merchant_name: "Amazon", merchant_slug: "amazon",
    code: "PRIME15", requires_reveal: true, description: "15% cashback up to ₹300 for Prime members.",
    discount_type: "cashback", discount_value: 15, status: "unverified", confidence_score: 0.30,
    first_seen: minsAgo(50), last_seen: minsAgo(50), last_validated_at: null, expires_at: daysAhead(5),
  },
  {
    id: 107, merchant_id: 2, merchant_name: "Flipkart", merchant_slug: "flipkart",
    code: "DEAD200", requires_reveal: true, description: "₹200 off — reported not working at checkout.",
    discount_type: "fixed", discount_value: 200, status: "invalid", confidence_score: 0.08,
    first_seen: minsAgo(4000), last_seen: minsAgo(120), last_validated_at: minsAgo(30), expires_at: daysAhead(1),
  },
  {
    id: 108, merchant_id: 1, merchant_name: "Myntra", merchant_slug: "myntra",
    code: "FIRST60", requires_reveal: true, description: "60% off your first Myntra order + free returns.",
    discount_type: "percentage", discount_value: 60, status: "valid", confidence_score: 0.99,
    first_seen: minsAgo(200), last_seen: minsAgo(2), last_validated_at: minsAgo(2), expires_at: daysAhead(14),
  },
];

// Convenience: freshest-verified first (mirrors the API default sort).
export const MOCK_LIVE_FEED = [...MOCK_COUPONS].sort((a, b) => {
  const av = a.last_validated_at ? new Date(a.last_validated_at).getTime() : 0;
  const bv = b.last_validated_at ? new Date(b.last_validated_at).getTime() : 0;
  return bv - av;
});
