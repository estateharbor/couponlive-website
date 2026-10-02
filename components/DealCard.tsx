"use client";

import { ArrowUpRight, Tag } from "lucide-react";
import type { Deal } from "@/lib/types";
import { discountHeadline, displayMerchantName } from "@/lib/format";
import { MerchantTile } from "./MerchantTile";

// A code-less offer: no code to copy, never a ✓ Verified badge — you tap through
// to the store. Used on the homepage Top deals row and on store pages.
export function DealCard({ deal }: { deal: Deal }) {
  const headline = discountHeadline(deal);
  const name = displayMerchantName(deal.merchant_name) || "Store";
  const href = deal.url ?? "#";

  return (
    <article className="surface border border-token rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <MerchantTile name={name} logo={undefined} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 justify-between">
            <p className="font-display font-semibold text-[15px] truncate" style={{ color: "var(--text)" }}>
              {name}
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
          aria-label={`Open this ${name} deal`}
        >
          Grab deal
          <ArrowUpRight className="w-4 h-4 opacity-80" strokeWidth={2.5} />
        </a>
      </div>
    </article>
  );
}
