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

// --- Free Trials vertical (mirrors backend TrialCardOut / ToolOut) ---
export type TrialOfferType =
  | "no_card_trial"
  | "card_trial"
  | "freemium_premium_trial"
  | "extended_trial"
  | "startup_credit"
  | "student_offer"
  | "telecom_bundle"
  | "bank_card_offer"
  | "ai_credits"
  | "lifetime_free_tier"
  | "unknown";

export type TrialVerificationStatus =
  | "verified"
  | "likely_active"
  | "unverified"
  | "broken"
  | "expired";

export interface TrialCard {
  id: number;
  tool_name: string;
  tool_slug: string;
  logo_url: string | null;
  category: string | null;
  is_ai_tool: boolean;
  offer_type: TrialOfferType;
  title: string;
  trial_days: number | null;
  credit_amount: number | null;
  credit_currency: string | null;
  card_required: boolean | null; // null = Unknown
  india_available: boolean | null;
  eligibility: string | null;
  renew_price_inr: number | null;
  renew_price_usd: number | null;
  renew_period: string | null;
  signup_url: string;
  confidence_score: number;
  last_verified_at: string | null;
  last_verified_from: string | null;
  verification_status: TrialVerificationStatus;
  expires_at: string | null;
}

export interface TrialOffer {
  id: number;
  offer_type: TrialOfferType;
  title: string;
  trial_days: number | null;
  credit_amount: number | null;
  credit_currency: string | null;
  card_required: boolean | null;
  india_available: boolean | null;
  eligibility: string | null;
  auto_renews: boolean | null;
  renew_price_inr: number | null;
  renew_price_usd: number | null;
  renew_period: string | null;
  signup_url: string;
  cancel_url: string | null;
  how_to_claim: string | null;
  expires_at: string | null;
  confidence_score: number;
  last_verified_at: string | null;
  last_verified_from: string | null;
  verification_status: TrialVerificationStatus;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  vendor_name: string | null;
  tagline: string | null;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
  category: string | null;
  is_ai_tool: boolean;
  platforms: string | null;
  popularity_score: number;
  offers: TrialOffer[];
}

export interface TrialCategoryCount {
  category: string;
  offer_count: number;
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
