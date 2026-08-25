import type { Coupon, Merchant } from "./types";
import { MOCK_COUPONS, MOCK_MERCHANTS } from "./mock";

// Swap mock -> live with one env var. When NEXT_PUBLIC_API_URL is set the site
// fetches the real CouponLive backend (client-side, since this is a static
// export); otherwise it serves the typed mock layer.
const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export const USING_MOCK = API === "";

async function get<T>(path: string, fallback: T): Promise<T> {
  if (USING_MOCK) return fallback;
  try {
    const res = await fetch(`${API}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback; // graceful: never blank the UI on a transient API error
  }
}

export async function getCoupons(params: {
  merchant?: string;
  status?: string;
  include_stale?: boolean;
  limit?: number;
} = {}): Promise<Coupon[]> {
  const q = new URLSearchParams();
  if (params.merchant) q.set("merchant", params.merchant);
  if (params.status) q.set("status", params.status);
  if (params.include_stale) q.set("include_stale", "true");
  if (params.limit) q.set("limit", String(params.limit));
  const fallback = MOCK_COUPONS.filter(
    (c) => !params.merchant || c.merchant_slug === params.merchant,
  );
  return get<Coupon[]>(`/coupons?${q.toString()}`, fallback);
}

export async function getMerchants(): Promise<Merchant[]> {
  return get<Merchant[]>("/merchants", MOCK_MERCHANTS);
}

export interface FeedbackResult {
  coupon_id: number;
  recorded: boolean;
  new_confidence_score: number;
}

export async function submitFeedback(couponId: number, worked: boolean): Promise<FeedbackResult> {
  if (USING_MOCK) {
    return { coupon_id: couponId, recorded: true, new_confidence_score: worked ? 0.95 : 0.4 };
  }
  const res = await fetch(`${API}/coupons/${couponId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ worked }),
  });
  if (!res.ok) throw new Error(`feedback failed: ${res.status}`);
  return (await res.json()) as FeedbackResult;
}
