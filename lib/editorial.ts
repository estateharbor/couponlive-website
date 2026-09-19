// Editorial identity (E-E-A-T). Named owner for guides/policies; a team byline
// for frequently-updated dynamic pages (store/coupon/free-trial).
export const FOUNDER = {
  name: "Dhananjay Pandey",
  role: "Founder & Editorial Lead, CouponLive",
  bio: "Dhananjay leads CouponLive's mission to make coupon codes, deals and free-access offers clearer and more dependable for Indian shoppers. He oversees editorial standards, verification practices and corrections.",
};

export const VERIFY_TEAM = {
  name: "CouponLive Verification Team",
  role: "Deals Research & Verification",
  bio: "The CouponLive Verification Team reviews offer terms, eligibility, expiry dates and merchant sources. Checkout-tested offers are clearly separated from merchant-sourced and community-reported deals.",
};

export const SUPPORT_EMAIL = "support@couponlive.in";

// Human "Last reviewed" date for dynamic pages (build/rebuild time — the site is
// rebuilt regularly, so this reflects the last refresh).
export function reviewedToday(): string {
  return new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
