"use client";

import Link from "next/link";
import { ArrowUpRight, CreditCard, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";
import type { TrialCard as TrialCardT } from "@/lib/types";
import { MerchantTile } from "./MerchantTile";

const TYPE_LABEL: Record<string, string> = {
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

function trialHeadline(c: TrialCardT): string {
  if (c.trial_days) return `${c.trial_days}-day free trial`;
  if (c.credit_amount) {
    const cur = c.credit_currency === "USD" ? "$" : c.credit_currency ? c.credit_currency + " " : "";
    return `${cur}${c.credit_amount.toLocaleString("en-IN")} credits`;
  }
  if (c.offer_type === "lifetime_free_tier") return "Free forever plan";
  if (c.offer_type === "freemium_premium_trial") return "Free plan + premium trial";
  return "Free trial";
}

function renewLabel(c: TrialCardT): string | null {
  if (c.offer_type === "lifetime_free_tier") return "No auto-renew · free tier";
  if (c.renew_price_inr) return `Renews at ₹${c.renew_price_inr.toLocaleString("en-IN")}/${c.renew_period ?? "mo"}`;
  if (c.renew_price_usd) return `Renews at $${c.renew_price_usd}/${c.renew_period ?? "mo"}`;
  return null;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3.6e6);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function TrialCard({ trial: c }: { trial: TrialCardT }) {
  const renew = renewLabel(c);

  // Card-required chip (honest: null = Unknown).
  const card =
    c.card_required === false
      ? { text: "No card needed", cls: "verified" }
      : c.card_required === true
        ? { text: "Card / UPI needed", cls: "muted" }
        : { text: "Card: unknown", cls: "subtle" };

  return (
    <article className="surface border border-token rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <MerchantTile name={c.tool_name} logo={c.logo_url ?? undefined} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 justify-between">
            <Link href={`/tool/${c.tool_slug}/`} className="font-display font-semibold text-[15px] truncate hover:underline" style={{ color: "var(--text)" }}>
              {c.tool_name}
            </Link>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0"
              style={{ background: "var(--surface-2, rgba(0,0,0,.05))", color: "var(--text-muted)" }}>
              {TYPE_LABEL[c.offer_type] ?? "Free trial"}
            </span>
          </div>
          <p className="font-display font-bold text-xl leading-tight mt-0.5" style={{ color: "var(--text)" }}>
            {trialHeadline(c)}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted mt-2 line-clamp-2">{c.title}</p>

      {/* Honest fact row */}
      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
          style={
            card.cls === "verified"
              ? { background: "var(--verified-bg)", color: "var(--verified-text)" }
              : { background: "var(--surface-2, rgba(0,0,0,.05))", color: "var(--text-muted)" }
          }>
          <CreditCard className="w-3 h-3" strokeWidth={2.5} /> {card.text}
        </span>
        {c.eligibility && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5"
            style={{ background: "var(--surface-2, rgba(0,0,0,.05))", color: "var(--text-muted)" }}>
            {c.eligibility}
          </span>
        )}
      </div>

      {renew && <p className="text-xs text-subtle mt-2">{renew}</p>}

      {/* Verification badge — honest ladder */}
      <div className="mt-2 text-xs">
        {c.verification_status === "verified" ? (
          <span className="inline-flex items-center gap-1 font-semibold" style={{ color: "var(--verified-text)" }}>
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            Verified{c.last_verified_from === "IN" ? " 🇮🇳" : ""} {timeAgo(c.last_verified_at)}
          </span>
        ) : c.verification_status === "likely_active" ? (
          <span className="inline-flex items-center gap-1 font-semibold text-muted">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} /> Likely active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-subtle">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={2.5} /> Not verified yet
          </span>
        )}
      </div>

      <div className="mt-auto pt-4">
        <a
          href={c.signup_url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold text-white text-[15px] transition-colors"
          style={{ background: "var(--brand-blue)" }}
          aria-label={`Claim the ${c.tool_name} free trial`}
        >
          Claim trial
          <ArrowUpRight className="w-4 h-4 opacity-80" strokeWidth={2.5} />
        </a>
      </div>
    </article>
  );
}
