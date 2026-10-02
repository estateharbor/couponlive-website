"use client";

import { useEffect, useState } from "react";
import type { Deal } from "@/lib/types";
import { getDeals } from "@/lib/api";
import { DealCard } from "./DealCard";

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
