import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Ticket } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CouponGrid } from "@/components/CouponGrid";
import { MerchantTile } from "@/components/MerchantTile";
import { getMerchants } from "@/lib/api";
import { allStoreSlugs, getStoreBySlug } from "@/lib/catalog";

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
  const title = `${store.name} coupon codes`;
  const description = `The latest ${store.name} coupon codes — refreshed hourly. Codes we've checkout-tested carry a Verified badge.`;
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
  const store = await resolveStore(slug);
  if (!store) notFound();

  return (
    <PageShell>
      <section className="border-b border-token">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center gap-4">
          <MerchantTile name={store.name} size={64} />
          <div className="min-w-0">
            <nav className="text-xs text-subtle mb-1">
              <Link href="/" className="hover:underline">Home</Link> ·{" "}
              <Link href="/stores/" className="hover:underline">Stores</Link>
            </nav>
            <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>
              {store.name} coupons
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-muted">
                <Ticket className="w-4 h-4" style={{ color: "var(--brand-blue)" }} /> {store.count} codes
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

      <section className="mx-auto max-w-6xl px-4 py-8">
        <CouponGrid merchantSlug={slug} highlightBest />
      </section>
    </PageShell>
  );
}
