"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchCatalog } from "@/lib/catalog";
import { CouponCard } from "./CouponCard";
import { MerchantTile } from "./MerchantTile";

export function SearchClient() {
  const params = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const results = useMemo(() => searchCatalog(q), [q]);
  const hasQuery = q.trim().length > 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display font-bold text-3xl" style={{ color: "var(--text)" }}>Search</h1>

      <div className="relative mt-4 max-w-xl">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stores, codes, offers…"
          className="w-full surface border border-token rounded-lg pl-9 pr-3 py-3 text-base outline-none"
          aria-label="Search"
        />
      </div>

      {!hasQuery ? (
        <p className="text-muted mt-6">Type to search across stores and verified codes.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {results.stores.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-3" style={{ color: "var(--text)" }}>Stores</h2>
              <div className="flex flex-wrap gap-2">
                {results.stores.map((s) => (
                  <Link key={s.id} href={`/store/${s.slug}/`} className="inline-flex items-center gap-2 surface border border-token rounded-full pl-1.5 pr-3.5 py-1.5 hover:shadow-sm">
                    <MerchantTile name={s.name} size={26} />
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display font-semibold text-lg mb-3" style={{ color: "var(--text)" }}>
              Codes {results.coupons.length > 0 && <span className="text-subtle font-normal">({results.coupons.length})</span>}
            </h2>
            {results.coupons.length === 0 ? (
              <p className="text-muted">No verified codes match &ldquo;{q}&rdquo;.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.coupons.map((c) => (
                  <CouponCard key={c.id} coupon={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
