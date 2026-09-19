"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import type { TrialCard as TrialCardT, TrialCategoryCount } from "@/lib/types";
import { getTrials } from "@/lib/api";
import { groupByTool } from "@/lib/trials";
import { TrialCard } from "./TrialCard";
import { CouponGridSkeleton } from "./CouponCardSkeleton";

const SORTS: Record<string, string> = {
  recommended: "Recommended",
  newest: "Newest",
  longest: "Longest trial",
  verified: "Verified first",
  expiring: "Expiring soon",
};

// Client loader for the Free Trials directory. Seeded with build-time data
// (`initial`) so content is in the static HTML for SEO; refreshes on filter
// change and on mount for freshness.
export function TrialGrid({
  initial,
  categories = [],
}: {
  initial?: TrialCardT[];
  categories?: TrialCategoryCount[];
}) {
  const [trials, setTrials] = useState<TrialCardT[] | null>(initial ?? null);
  const [noCard, setNoCard] = useState(false);
  const [ai, setAi] = useState(false);
  const [category, setCategory] = useState("");
  const [minDays, setMinDays] = useState(0);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    let alive = true;
    getTrials({
      limit: 120,
      sort,
      ...(noCard ? { no_card: true } : {}),
      ...(ai ? { ai: true } : {}),
      ...(category ? { category } : {}),
      ...(minDays ? { min_days: minDays } : {}),
    }).then((rows) => {
      if (alive) setTrials(rows);
    });
    return () => {
      alive = false;
    };
  }, [noCard, ai, category, minDays, sort]);

  // One card per tool (collapse trial/free-plan/credits into a single card).
  const groups = useMemo(() => groupByTool(trials ?? []), [trials]);

  return (
    <div>
      {/* Filter bar — "No card needed" is the hero filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setNoCard((v) => !v)}
          aria-pressed={noCard}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold border transition-colors"
          style={
            noCard
              ? { background: "var(--verified)", borderColor: "var(--verified)", color: "#fff" }
              : { borderColor: "var(--border)", color: "var(--verified-text)" }
          }
        >
          💳 No card needed
        </button>
        <button
          onClick={() => setAi((v) => !v)}
          aria-pressed={ai}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold border transition-colors"
          style={ai ? { background: "var(--brand-blue)", borderColor: "var(--brand-blue)", color: "#fff" } : { borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          🤖 AI tools
        </button>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="surface border border-token rounded-lg text-sm px-2.5 py-2"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category} ({c.offer_count})
            </option>
          ))}
        </select>

        <select
          value={minDays}
          onChange={(e) => setMinDays(Number(e.target.value))}
          className="surface border border-token rounded-lg text-sm px-2.5 py-2"
          aria-label="Minimum trial length"
        >
          <option value={0}>Any length</option>
          <option value={7}>7+ days</option>
          <option value={14}>14+ days</option>
          <option value={30}>30+ days</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-subtle">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="surface border border-token rounded-lg text-sm px-2.5 py-2"
            aria-label="Sort trials"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {trials === null ? (
        <CouponGridSkeleton count={9} />
      ) : groups.length === 0 ? (
        <div className="surface border border-token rounded-xl p-10 text-center">
          <SearchX className="w-8 h-8 mx-auto text-subtle" />
          <p className="mt-3 font-display font-semibold" style={{ color: "var(--text)" }}>No trials match these filters</p>
          <p className="text-sm text-muted mt-1">Try clearing a filter — new trials are added regularly.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <TrialCard key={g.primary.tool_slug} trial={g.primary} alsoTypes={g.alsoTypes} />
          ))}
        </div>
      )}
    </div>
  );
}
