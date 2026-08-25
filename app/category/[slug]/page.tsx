import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { CouponGrid } from "@/components/CouponGrid";
import { CategoryChips } from "@/components/CategoryChips";
import { MerchantTile } from "@/components/MerchantTile";
import { allCategorySlugs, getCategoryBySlug, merchantsInCategory } from "@/lib/catalog";

export const dynamicParams = false;
export function generateStaticParams() {
  return allCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  const title = `${cat.name} coupons — verified working codes`;
  const description = `Live-verified ${cat.name.toLowerCase()} coupon codes across India's top stores. ${cat.blurb}. Only codes tested working.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}/` },
    openGraph: { title, description, url: `/category/${slug}/`, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();
  const stores = merchantsInCategory(slug);

  return (
    <PageShell>
      <section className="border-b border-token">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="text-xs text-subtle mb-1">
            <Link href="/" className="hover:underline">Home</Link> ·{" "}
            <Link href="/categories/" className="hover:underline">Categories</Link>
          </nav>
          <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>{cat.name} coupons</h1>
          <p className="text-muted mt-1">{cat.blurb} — only codes verified working.</p>
          <div className="mt-4"><CategoryChips active={slug} /></div>
          {stores.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-subtle">Stores:</span>
              {stores.map((s) => (
                <Link key={s.id} href={`/store/${s.slug}/`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-[color:var(--brand-blue)]">
                  <MerchantTile name={s.name} size={20} /> {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <CouponGrid categorySlug={slug} />
      </section>
    </PageShell>
  );
}
