import type { TrialCard, TrialOfferType } from "./types";

// Short chip label per offer type (shared by the card + grouping).
export const OFFER_TYPE_LABEL: Record<TrialOfferType, string> = {
  no_card_trial: "No card",
  card_trial: "Card needed",
  freemium_premium_trial: "Freemium",
  extended_trial: "Extended trial",
  startup_credit: "Startup credit",
  student_offer: "Student",
  telecom_bundle: "Telecom bundle",
  bank_card_offer: "Bank offer",
  ai_credits: "AI credits",
  lifetime_free_tier: "Free forever",
  unknown: "Free trial",
};

export function offerTypeLabel(t: TrialOfferType): string {
  return OFFER_TYPE_LABEL[t] ?? "Free trial";
}

// A "card_trial"/"unknown" offer with no confirmed trial window, credits, or
// free tier is NOT actually a free trial we can stand behind — it's just the
// product's paid plans (e.g. Netflix, which has no blanket-India free trial).
// Present these as "plans", never as a verified free trial.
export function isPlansOnly(
  c: Pick<TrialCard, "offer_type" | "trial_days" | "credit_amount">,
): boolean {
  if (c.trial_days || c.credit_amount) return false;
  return c.offer_type === "card_trial" || c.offer_type === "unknown";
}

// Honest call-to-action per offer type — never a blanket "Claim trial" for a
// free tier (ChatGPT) or an eligibility-gated offer (student/startup, Netflix).
export function ctaLabel(
  c: Pick<TrialCard, "offer_type" | "eligibility" | "trial_days" | "credit_amount">,
): string {
  if (c.eligibility || c.offer_type === "student_offer" || c.offer_type === "startup_credit")
    return "Check eligibility";
  if (isPlansOnly(c)) return "View plans";
  if (c.offer_type === "lifetime_free_tier") return "Get started free";
  if (c.offer_type === "ai_credits") return "Get credits";
  if (c.offer_type === "telecom_bundle" || c.offer_type === "bank_card_offer") return "See offer";
  return "Start free trial";
}

const STATUS_RANK: Record<string, number> = {
  verified: 0,
  likely_active: 1,
  unverified: 2,
  broken: 3,
  expired: 4,
};

export interface ToolGroup {
  primary: TrialCard;
  alsoTypes: string[]; // other offer-type labels this tool has (for a "+ also" line)
}

// Collapse offers to ONE card per tool: pick the strongest offer as primary
// (verified first, then confidence, then longest trial) and summarise the rest.
// Preserves the input ordering by each tool's first appearance (verified-first).
export function groupByTool(trials: TrialCard[]): ToolGroup[] {
  const byTool = new Map<string, TrialCard[]>();
  for (const t of trials) {
    const arr = byTool.get(t.tool_slug);
    if (arr) arr.push(t);
    else byTool.set(t.tool_slug, [t]);
  }
  return [...byTool.values()].map((offers) => {
    offers.sort(
      (a, b) =>
        (STATUS_RANK[a.verification_status] ?? 9) - (STATUS_RANK[b.verification_status] ?? 9) ||
        b.confidence_score - a.confidence_score ||
        (b.trial_days ?? 0) - (a.trial_days ?? 0),
    );
    const primary = offers[0];
    const primaryLabel = offerTypeLabel(primary.offer_type);
    const alsoTypes = [
      ...new Set(offers.slice(1).map((o) => offerTypeLabel(o.offer_type))),
    ].filter((l) => l !== primaryLabel);
    return { primary, alsoTypes };
  });
}
