// Structured-data (JSON-LD schema.org) builders. Emitted server-side so both
// Google and AI answer engines (which don't run JavaScript) can read the site's
// content and coupons directly from the HTML.
import type { Coupon } from "./types";
import { discountHeadline } from "./format";

export const SITE = "https://couponlive.in";
export const ORG_NAME = "CouponLive";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: `${SITE}/`,
    logo: `${SITE}/couponlive-logo-full.png`,
    description:
      "CouponLive lists working coupon codes and deals for India's top online stores, refreshed hourly. Codes we checkout-test carry a Verified badge.",
    sameAs: [] as string[],
  };
}

// WebSite node with a Sitelinks search box, so Google/AI understand the search URL.
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    url: `${SITE}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// An ItemList of Offers for a store's coupons — the machine-readable version of
// the visible list. Includes the code so AI engines can surface "use code X".
export function couponsItemListLd(storeName: string, storeUrl: string, coupons: Coupon[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${storeName} coupon codes`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: coupons.length,
    itemListElement: coupons.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: `${storeName} — ${discountHeadline(c)}`,
        description: c.description || discountHeadline(c),
        url: storeUrl,
        category: "Coupon",
        seller: { "@type": "Organization", name: storeName },
        availability: "https://schema.org/InStock",
        ...(c.code ? { itemOffered: { "@type": "Service", name: `Coupon code ${c.code}` } } : {}),
      },
    })),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

// Reusable FAQ copy for store pages (rendered visibly AND as FAQPage JSON-LD).
export function storeFaq(storeName: string): { q: string; a: string }[] {
  return [
    {
      q: `How do I use a ${storeName} coupon code?`,
      a: `Tap "Reveal code" on any ${storeName} offer to copy the code, then paste it in the coupon or promo-code box at ${storeName} checkout before you pay.`,
    },
    {
      q: `Are these ${storeName} coupons working?`,
      a: `We refresh ${storeName} codes hourly from our sources. Codes we've checkout-tested show a green ✓ Verified badge; the rest are the latest available and marked "Not verified yet" so you always know what you're trying.`,
    },
    {
      q: `What does the ✓ Verified badge mean?`,
      a: `It means we ran that exact code through a real checkout and confirmed a discount applied. We never label an untested code as Verified.`,
    },
    {
      q: `How often are ${storeName} codes updated?`,
      a: `Our sources sync every hour, so new ${storeName} coupons and deals appear automatically and expired ones are removed.`,
    },
  ];
}
