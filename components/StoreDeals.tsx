"use client";

import { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import type { Deal } from "@/lib/types";
import { getDeals } from "@/lib/api";
import { DealCard } from "./DealCard";

// Code-less offers for a single store (e.g. Amazon.in / Flipkart festive & bank
// deals). Rendered below the codes grid on a store page. `initialDeals` is
// fetched at build so the content is in the static HTML (SEO); the client
// refreshes for freshness. Renders nothing when the store has no deals.
export function StoreDeals({
  merchantSlug,
  storeName,
  initialDeals,
}: {
  merchantSlug: string;
  storeName: string;
  initialDeals?: Deal[];
}) {
  const [deals, setDeals] = useState<Deal[] | null>(initialDeals ?? null);

  useEffect(() => {
    let alive = true;
    getDeals({ merchant: merchantSlug, limit: 50 }).then((d) => {
      if (alive) setDeals(d);
    });
    return () => {
      alive = false;
    };
  }, [merchantSlug]);

  if (!deals || deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="flex items-center gap-2 mb-1">
        <Tag className="w-5 h-5" style={{ color: "var(--brand-blue)" }} strokeWidth={2.5} />
        <h2 className="font-display font-bold text-xl" style={{ color: "var(--text)" }}>
          {storeName} deals
        </h2>
      </div>
      <p className="text-sm text-muted mb-4">
        Live {storeName} offers with no code to copy — tap through to the store.{" "}
        <span className="text-subtle">Affiliate links: we may earn a commission.</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </section>
  );
}
