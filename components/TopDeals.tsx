"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Tag } from "lucide-react";
import type { Deal } from "@/lib/types";
import { getDeals } from "@/lib/api";
import { discountHeadline } from "@/lib/format";
import { MerchantTile } from "./MerchantTile";

// Top Deals: the freshest code-less offers across all merchants (sourced from
// Cuelinks, with affiliate links). Distinct from the codes directory — a deal
// has no code to copy and is never "Verified"; you just tap through to the store.
// Renders nothing until real deals exist, so the homepage never shows an empty
// shell.
export function TopDeals({ limit = 6, initialDeals }: { limit?: number; initialDeals?: Deal[] }) {
  // `initialDeals` is fetched at build so deals ship in the static HTML (SEO);
  // the client refreshes them for freshness.
  const [deals, setDeals] = useState<Deal[] | null>(initialDeals ?? null);

  useEffect(() => {
    let alive = true;
    getDeals({ limit }).then((d) => {
      if (alive) setDeals(d);
    });
    return () => {
      alive = false;
    };
  }, [limit]);

  if (!deals || deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>
            Top deals
          </h2>
          <p className="text-sm text-muted mt-1">
            Handpicked deals from top stores — no code needed, just tap through.{" "}
            <span className="text-subtle">Affiliate links: we may earn a commission.</span>
          </p>
        </div>
        <a
          href="/deals/"
          className="text-sm font-semibold whitespace-nowrap"
          style={{ color: "var(--brand-blue)" }}
        >
          All deals →
        </a>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </section>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const headline = discountHeadline(deal);
  const href = deal.url ?? "#";

  return (
    <article className="surface border border-token rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <MerchantTile name={deal.merchant_name ?? "Store"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 justify-between">
            <p className="font-display font-semibold text-[15px] truncate" style={{ color: "var(--text)" }}>
              {deal.merchant_name ?? "Store"}
            </p>
            {/* Neutral "Deal" tag — deliberately NOT a green ✓ Verified badge. */}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{ background: "var(--surface-2, rgba(0,0,0,.05))", color: "var(--text-muted)" }}
            >
              <Tag className="w-3 h-3" strokeWidth={2.5} /> Deal
            </span>
          </div>
          <p className="font-display font-bold text-2xl leading-tight mt-0.5" style={{ color: "var(--text)" }}>
            {headline}
          </p>
        </div>
      </div>

      {deal.description && (
        <p className="text-sm text-muted mt-2 line-clamp-2">{deal.description}</p>
      )}

      <div className="mt-auto pt-4">
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold text-white text-[15px] transition-colors"
          style={{ background: "var(--brand-blue)" }}
          aria-label={`Open this ${deal.merchant_name ?? "store"} deal`}
        >
          Grab deal
          <ArrowUpRight className="w-4 h-4 opacity-80" strokeWidth={2.5} />
        </a>
      </div>
    </article>
  );
}
