import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CouponGrid } from "@/components/CouponGrid";
import { MerchantTile } from "@/components/MerchantTile";
import { allStoreSlugs, getStoreBySlug, categoryOf, getCategoryBySlug } from "@/lib/catalog";

// Static export: enumerate every store at build; reject unknown slugs.
export const dynamicParams = false;
export function generateStaticParams() {
  return allStoreSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const store = getStoreBySlug(slug);
  if (!store) return {};
  const title = `${store.name} coupons — verified working codes`;
  const description = `Live-verified ${store.name} coupon codes, tested at checkout. ${store.valid_coupon_count} working codes right now — no expired codes.`;
  return {
    title,
    description,
    alternates: { canonical: `/store/${slug}/` },
    openGraph: { title, description, url: `/store/${slug}/`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);
  if (!store) notFound();

  const catSlug = categoryOf(slug);
  const category = catSlug ? getCategoryBySlug(catSlug) : undefined;

  return (
    <PageShell>
      {/* Store header (static — SEO) */}
      <section className="border-b border-token">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center gap-4">
          <MerchantTile name={store.name} logo={store.logo} size={64} />
          <div className="min-w-0">
            <nav className="text-xs text-subtle mb-1">
              <Link href="/" className="hover:underline">Home</Link> ·{" "}
              <Link href="/stores/" className="hover:underline">Stores</Link>
              {category && <> · <Link href={`/category/${category.slug}/`} className="hover:underline">{category.name}</Link></>}
            </nav>
            <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>
              {store.name} coupons
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--verified-text)" }}>
                <ShieldCheck className="w-4 h-4" /> {store.valid_coupon_count} verified live
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

      {/* Coupons (loaded client-side) */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <CouponGrid merchantSlug={slug} highlightBest />
      </section>
    </PageShell>
  );
}
