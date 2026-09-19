import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Ticket } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CouponGrid } from "@/components/CouponGrid";
import { MerchantTile } from "@/components/MerchantTile";
import { JsonLd } from "@/components/JsonLd";
import { getCoupons, getMerchants } from "@/lib/api";
import { allStoreSlugs, getStoreBySlug } from "@/lib/catalog";
import { SITE, breadcrumbLd, couponsItemListLd, faqLd, storeFaq } from "@/lib/seo";

// Static export: enumerate stores at build. Pull the live merchant list from the
// API and union it with the mock slugs, so real stores get pre-rendered pages.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = new Set(allStoreSlugs());
  try {
    for (const m of await getMerchants()) slugs.add(m.slug ?? m.normalized_name);
  } catch {
    /* API unreachable at build — mock slugs still render */
  }
  return [...slugs].map((slug) => ({ slug }));
}

async function resolveStore(slug: string) {
  try {
    const m = (await getMerchants()).find((x) => (x.slug ?? x.normalized_name) === slug);
    if (m) return { name: m.name, website: m.website, count: m.coupon_count };
  } catch {}
  const mock = getStoreBySlug(slug);
  if (mock) return { name: mock.name, website: mock.website, count: mock.coupon_count };
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const store = await resolveStore(slug);
  if (!store) return {};
  let usable = 0;
  try {
    usable = (await getCoupons({ listing: true, merchant: slug, limit: 100 })).length;
  } catch {
    /* API down at build — treat as unknown (don't noindex) */
    usable = store.count;
  }
  const title = `${store.name} coupon codes`;
  const description = `The latest ${store.name} coupon codes — refreshed hourly. Codes we've checkout-tested carry a Verified badge.`;
  return {
    title,
    description,
    alternates: { canonical: `/store/${slug}/` },
    // Indexation quality gate: don't index a store page with no usable codes.
    ...(usable === 0 ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description, url: `/store/${slug}/`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await resolveStore(slug);
  if (!store) notFound();

  // Fetch this store's coupons at BUILD time so they're in the static HTML
  // (crawlable by search + AI). The grid still refreshes them client-side.
  let coupons: Awaited<ReturnType<typeof getCoupons>> = [];
  try {
    coupons = await getCoupons({ listing: true, merchant: slug, limit: 100 });
  } catch {
    /* API unreachable at build — page still ships, grid loads client-side */
  }

  const storeUrl = `${SITE}/store/${slug}/`;
  const faqs = storeFaq(store.name);
  const verifiedCount = coupons.filter((c) => c.status === "valid").length;

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: `${SITE}/` },
            { name: "Stores", url: `${SITE}/stores/` },
            { name: `${store.name} coupons`, url: storeUrl },
          ]),
          couponsItemListLd(store.name, storeUrl, coupons),
          faqLd(faqs),
        ]}
      />
      <section className="border-b border-token">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center gap-4">
          <MerchantTile name={store.name} size={64} />
          <div className="min-w-0">
            <nav className="text-xs text-subtle mb-1">
              <Link href="/" className="hover:underline">Home</Link> ·{" "}
              <Link href="/stores/" className="hover:underline">Stores</Link>
            </nav>
            <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>
              {store.name} coupons &amp; promo codes
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-muted">
                <Ticket className="w-4 h-4" style={{ color: "var(--brand-blue)" }} /> {coupons.length} {coupons.length === 1 ? "code" : "codes"}
              </span>
              {store.website && (
                <a href={store.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-[color:var(--brand-blue)]">
                  Visit {store.name} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Intro copy — real text for search + AI engines to read and summarise. */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <p className="text-muted max-w-3xl leading-relaxed">
          Find the latest <strong>{store.name} coupon codes and offers</strong>, refreshed hourly from our
          sources. We currently list <strong>{coupons.length}</strong> usable {store.name} {coupons.length === 1 ? "code" : "codes"}
          {verifiedCount > 0 && <> — <strong>{verifiedCount}</strong> checkout-tested and marked ✓&nbsp;Verified</>}.
          Tap “Reveal code” to copy a code, then paste it in the promo box at {store.name} checkout. Codes we
          haven’t tested yet are labelled “Not verified yet”, so you always know exactly what you’re trying.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <CouponGrid merchantSlug={slug} highlightBest initialCoupons={coupons} />
      </section>

      {/* FAQ — visible text + FAQPage structured data above. */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--text)" }}>
          {store.name} coupons — FAQ
        </h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <details key={f.q} className="surface border border-token rounded-lg p-4">
              <summary className="font-semibold cursor-pointer" style={{ color: "var(--text)" }}>{f.q}</summary>
              <p className="text-sm text-muted mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
