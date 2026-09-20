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

// Brand names come from feeds and are sometimes raw domains ("firstcry.com") or
// wrong-cased ("ajio"). Present a clean display name: known brands use their
// canonical casing; otherwise strip a TLD and title-case the label.
const BRAND_NAMES: Record<string, string> = {
  firstcry: "FirstCry",
  ajio: "AJIO",
  boat: "boAt",
  nykaa: "Nykaa",
  myntra: "Myntra",
  flipkart: "Flipkart",
  amazon: "Amazon",
  meesho: "Meesho",
  tatacliq: "Tata CLiQ",
  jiomart: "JioMart",
  bigbasket: "BigBasket",
  pharmeasy: "PharmEasy",
  "1mg": "Tata 1mg",
  swiggy: "Swiggy",
  zomato: "Zomato",
};

export function displayMerchantName(name: string | null | undefined): string {
  if (!name) return "";
  const raw = name.trim();
  // Key off the alphanumeric core (drop TLD + non-alnum) for the brand lookup.
  const key = raw.toLowerCase().replace(/\.(com|in|co\.in|net|org|shop|store)\b.*$/, "").replace(/[^a-z0-9]/g, "");
  if (BRAND_NAMES[key]) return BRAND_NAMES[key];
  // Already mixed-case and not a bare domain → trust the feed's spelling.
  const looksClean = /[A-Z]/.test(raw) && !/\.(com|in|net|org)\b/i.test(raw);
  if (looksClean) return raw;
  // Fallback: strip a trailing TLD, then Title Case the words.
  const base = raw.replace(/\.(com|in|co\.in|net|org|shop|store)\b.*$/i, "");
  return base
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || raw;
}

// Surface offer conditions the shopper needs BEFORE they click — but only when
// they're actually stated in the offer text, never invented. Returns honest
// chips like "Min. order ₹999" / "New users only".
export interface CouponConditions {
  minOrder?: string;
  newUsers?: boolean;
}

export function couponConditions(description?: string | null): CouponConditions {
  if (!description) return {};
  const text = description.toLowerCase();
  const out: CouponConditions = {};
  // "min order ₹999", "on orders above rs 1499", "orders over 2000"
  const min = text.match(/(?:min(?:imum)?\.?\s*(?:order|purchase|cart)?|orders?\s*(?:above|over|of)?)\D{0,8}(?:₹|rs\.?|inr)?\s*([\d,]{2,})/);
  if (min) {
    const n = min[1].replace(/,/g, "");
    if (Number(n) >= 10) out.minOrder = `₹${Number(n).toLocaleString("en-IN")}`;
  }
  if (/\bnew\s*(?:users?|customers?|members?)\b|\bfirst\s*(?:order|purchase|time)\b/.test(text))
    out.newUsers = true;
  return out;
}
