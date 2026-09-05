// Front-end types mirror the CouponLive backend API contract (CouponOut /
// MerchantOut). Swapping mock -> live is one env var; the shapes must match.

export type DiscountType =
  | "percentage"
  | "fixed"
  | "free_shipping"
  | "bogo"
  | "cashback"
  | "unknown";

export type CouponStatus = "unverified" | "valid" | "invalid" | "expired";

export interface Coupon {
  id: number;
  merchant_id: number;
  merchant_name: string | null;
  merchant_slug?: string;
  merchant_logo?: string; // optional logo URL for the card
  code: string | null;
  requires_reveal: boolean;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number | null;
  status: CouponStatus;
  confidence_score: number; // 0..1
  first_seen: string;
  last_seen: string;
  last_validated_at: string | null;
  expires_at?: string | null; // optional; shown only if known
}

// A code-less offer (e.g. an Amazon deal via Cuelinks). No code to copy and
// never "Verified" — the CTA is the affiliate `url`. Mirrors backend DealOut.
export interface Deal {
  id: number;
  merchant_id: number;
  merchant_name: string | null;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number | null;
  url: string | null;
  last_seen: string;
}

export interface Merchant {
  id: number;
  name: string;
  normalized_name: string;
  slug?: string;
  logo?: string;
  website: string | null;
  coupon_count: number;
  valid_coupon_count: number;
}
