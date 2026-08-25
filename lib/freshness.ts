import type { Coupon } from "./types";

// The product's core language (tokens §3d). Maps a coupon's validation recency
// to a freshness state that drives the badge color + heartbeat.
export type FreshnessState = "fresh" | "recent" | "aging" | "stale" | "invalid";

export interface Freshness {
  state: FreshnessState;
  label: string; // e.g. "Verified 4 min ago"
  pulse: boolean; // only 'fresh' pulses (the one animated element)
}

export function relativeTime(iso: string | null): string {
  if (!iso) return "not yet";
  const then = new Date(iso).getTime();
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function getFreshness(c: Pick<Coupon, "status" | "last_validated_at">): Freshness {
  if (c.status === "invalid") return { state: "invalid", label: "Didn't work last check", pulse: false };
  if (!c.last_validated_at) return { state: "stale", label: "Not verified yet", pulse: false };

  const mins = (Date.now() - new Date(c.last_validated_at).getTime()) / 60000;
  const ago = relativeTime(c.last_validated_at);
  if (mins < 15) return { state: "fresh", label: `Verified ${ago}`, pulse: true };
  if (mins < 120) return { state: "recent", label: `Verified ${ago}`, pulse: false };
  if (mins < 720) return { state: "aging", label: `Verified ${ago}`, pulse: false };
  return { state: "stale", label: `Verified ${ago}`, pulse: false };
}

// CSS-variable-backed styling so both light and dark themes stay correct.
export const FRESHNESS_STYLE: Record<
  FreshnessState,
  { bg: string; text: string; dot: string }
> = {
  fresh:   { bg: "var(--verified-bg)", text: "var(--verified-text)", dot: "var(--verified)" },
  recent:  { bg: "var(--verified-bg)", text: "var(--verified-text)", dot: "var(--verified)" },
  aging:   { bg: "var(--aging-bg)",    text: "var(--aging)",         dot: "var(--aging)" },
  stale:   { bg: "var(--stale-bg)",    text: "var(--text-muted)",    dot: "var(--stale)" },
  invalid: { bg: "var(--invalid-bg)",  text: "var(--invalid)",       dot: "var(--invalid)" },
};
