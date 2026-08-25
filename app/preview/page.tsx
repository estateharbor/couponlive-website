import { SiteHeader } from "@/components/SiteHeader";
import { CouponCard } from "@/components/CouponCard";
import type { Coupon } from "@/lib/types";

const base: Coupon = {
  id: 0, merchant_id: 1, merchant_name: "Myntra", merchant_slug: "myntra",
  code: "SAVE400", requires_reveal: true, description: "Flat ₹400 off on orders above ₹1999 — sitewide.",
  discount_type: "fixed", discount_value: 400, status: "valid", confidence_score: 0.94,
  first_seen: new Date().toISOString(), last_seen: new Date().toISOString(),
  last_validated_at: new Date().toISOString(), expires_at: null,
};
const mins = (n: number) => new Date(Date.now() - n * 60000).toISOString();

const states: { title: string; coupon: Coupon }[] = [
  { title: "Fresh (< 15 min) — pulsing heartbeat", coupon: { ...base, id: 1, last_validated_at: mins(4), confidence_score: 0.97 } },
  { title: "Recent (< 2 h)", coupon: { ...base, id: 2, merchant_name: "Flipkart", merchant_slug: "flipkart", last_validated_at: mins(70), confidence_score: 0.88 } },
  { title: "Aging (2–12 h) — amber", coupon: { ...base, id: 3, merchant_name: "AJIO", merchant_slug: "ajio", last_validated_at: mins(300), confidence_score: 0.71 } },
  { title: "Stale / unverified", coupon: { ...base, id: 4, merchant_name: "Amazon", merchant_slug: "amazon", status: "unverified", last_validated_at: null, confidence_score: 0.3, code: "PRIME15", discount_type: "cashback", discount_value: 15 } },
  { title: "Low confidence (< 50%) — honest amber meter", coupon: { ...base, id: 5, merchant_name: "Nykaa", merchant_slug: "nykaa", last_validated_at: mins(90), confidence_score: 0.34 } },
  { title: "Invalid (last check failed)", coupon: { ...base, id: 6, merchant_name: "Flipkart", merchant_slug: "flipkart", status: "invalid", last_validated_at: mins(30), confidence_score: 0.08, code: "DEAD200" } },
];

export default function PreviewPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>Coupon card — states</h1>
        <p className="text-muted mt-2">Every freshness state from the tokens. Toggle theme in the header to check dark mode.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((s) => (
            <div key={s.coupon.id}>
              <p className="text-xs font-semibold text-subtle mb-2">{s.title}</p>
              <CouponCard coupon={s.coupon} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
