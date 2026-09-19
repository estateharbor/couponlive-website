import type { Coupon, Deal, Merchant, TrialCard, TrialCategoryCount, Tool } from "./types";
import { MOCK_COUPONS, MOCK_MERCHANTS } from "./mock";

// Swap mock -> live with one env var. When NEXT_PUBLIC_API_URL is set the site
// fetches the real CouponLive backend (client-side, since this is a static
// export); otherwise it serves the typed mock layer.
const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export const USING_MOCK = API === "";

async function get<T>(path: string, mock: T): Promise<T> {
  // No API configured (local dev) -> serve the typed mock layer.
  if (USING_MOCK) return mock;
  try {
    const res = await fetch(`${API}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as T;
  } catch {
    // Production: NEVER fall back to fake "verified" mock data — that would show
    // untested codes as if they were real. Return empty; the UI shows an honest
    // empty state instead.
    return ([] as unknown) as T;
  }
}

export async function getCoupons(params: {
  merchant?: string;
  status?: string;
  listing?: boolean;
  include_stale?: boolean;
  limit?: number;
} = {}): Promise<Coupon[]> {
  const q = new URLSearchParams();
  if (params.merchant) q.set("merchant", params.merchant);
  if (params.status) q.set("status", params.status);
  if (params.listing) q.set("listing", "true");
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

// Code-less offers (e.g. Amazon deals via Cuelinks). No mock layer — deals are
// real-data-only; with no API configured this returns [] and the section hides.
export async function getDeals(params: { merchant?: string; limit?: number } = {}): Promise<Deal[]> {
  const q = new URLSearchParams();
  if (params.merchant) q.set("merchant", params.merchant);
  if (params.limit) q.set("limit", String(params.limit));
  return get<Deal[]>(`/deals?${q.toString()}`, []);
}

// --- Free Trials vertical (real-data-only; no mock layer) ---
export async function getTrials(params: {
  q?: string;
  category?: string;
  offer_type?: string;
  no_card?: boolean;
  min_days?: number;
  india?: boolean;
  ai?: boolean;
  sort?: string;
  limit?: number;
} = {}): Promise<TrialCard[]> {
  const p = new URLSearchParams();
  if (params.q) p.set("q", params.q);
  if (params.category) p.set("category", params.category);
  if (params.offer_type) p.set("offer_type", params.offer_type);
  if (params.no_card) p.set("no_card", "true");
  if (params.min_days) p.set("min_days", String(params.min_days));
  if (params.india) p.set("india", "true");
  if (params.ai) p.set("ai", "true");
  if (params.sort) p.set("sort", params.sort);
  if (params.limit) p.set("limit", String(params.limit));
  return get<TrialCard[]>(`/trials?${p.toString()}`, []);
}

export async function getTrialCategories(): Promise<TrialCategoryCount[]> {
  return get<TrialCategoryCount[]>("/trial-categories", []);
}

export async function getTool(slug: string): Promise<Tool | null> {
  if (USING_MOCK) return null;
  try {
    const res = await fetch(`${API}/tools/${slug}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as Tool;
  } catch {
    return null;
  }
}

// --- Cancel reminders (T4) ---
export interface ReminderInput {
  email: string;
  tool_name: string;
  offer_id?: number;
  ends_on: string; // YYYY-MM-DD
  renew_price_inr?: number | null;
  renew_note?: string | null;
  consent: boolean;
}

export interface ReminderResult {
  token: string;
  tool_name: string;
  ends_on: string;
  status: string;
  remind_days_before: number[];
  manage_url?: string | null;
}

export async function createReminder(input: ReminderInput): Promise<ReminderResult> {
  if (USING_MOCK) {
    return { token: "mock", tool_name: input.tool_name, ends_on: input.ends_on,
             status: "active", remind_days_before: [3, 1] };
  }
  const res = await fetch(`${API}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail || `reminder failed: ${res.status}`);
  }
  return (await res.json()) as ReminderResult;
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
