"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, ThumbsDown, ThumbsUp, ArrowUpRight, Ticket } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { getFreshness } from "@/lib/freshness";
import { discountHeadline } from "@/lib/format";
import { submitFeedback } from "@/lib/api";
import { cn } from "@/lib/cn";
import { MerchantTile } from "./MerchantTile";
import { FreshnessBadge } from "./FreshnessBadge";
import { ConfidenceMeter } from "./ConfidenceMeter";

const STORE_URLS: Record<string, string> = {
  myntra: "https://www.myntra.com",
  flipkart: "https://www.flipkart.com",
  amazon: "https://www.amazon.in",
  ajio: "https://www.ajio.com",
  nykaa: "https://www.nykaa.com",
  boat: "https://www.boat-lifestyle.com",
};

function expiryLabel(iso?: string | null): string | null {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<null | "up" | "down">(null);
  const [voting, setVoting] = useState(false);

  const freshness = getFreshness(coupon);
  const headline = discountHeadline(coupon);
  const expiry = expiryLabel(coupon.expires_at);
  const hasCode = !!coupon.code;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; the code is still visible to copy manually */
    }
  }

  function handleReveal() {
    setRevealed(true);
    if (coupon.code) copy(coupon.code);
    const url = coupon.merchant_slug ? STORE_URLS[coupon.merchant_slug] : undefined;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleVote(worked: boolean) {
    if (vote || voting) return;
    setVote(worked ? "up" : "down"); // optimistic
    setVoting(true);
    try {
      await submitFeedback(coupon.id, worked);
    } catch {
      /* keep the optimistic state; a retry queue is a later concern */
    } finally {
      setVoting(false);
    }
  }

  return (
    <article
      className={cn(
        "surface border border-token rounded-xl shadow-sm hover:shadow-md",
        "transition-shadow duration-200 flex flex-col p-4 sm:p-5",
      )}
    >
      {/* Header: merchant + freshness */}
      <div className="flex items-start gap-3">
        <MerchantTile name={coupon.merchant_name} logo={coupon.merchant_logo} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 justify-between">
            <p className="font-display font-semibold text-[15px] truncate" style={{ color: "var(--text)" }}>
              {coupon.merchant_name}
            </p>
            <FreshnessBadge freshness={freshness} />
          </div>
          <p className="font-display font-bold text-2xl leading-tight mt-0.5" style={{ color: "var(--text)" }}>
            {headline}
          </p>
        </div>
      </div>

      {/* Description */}
      {coupon.description && (
        <p className="text-sm text-muted mt-2 line-clamp-2">{coupon.description}</p>
      )}

      {/* Confidence — only meaningful once a code has been verified or has
          feedback; hide it for untested codes so we don't imply a "% worked". */}
      {(coupon.status === "valid" || coupon.confidence_score > 0) && (
        <div className="mt-3">
          <ConfidenceMeter score={coupon.confidence_score} />
        </div>
      )}

      {/* Expiry */}
      {expiry && (
        <p className="text-xs text-subtle mt-2">{expiry}</p>
      )}

      {/* Reveal / code */}
      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {!revealed || !hasCode ? (
            <motion.button
              key="reveal"
              onClick={handleReveal}
              disabled={!hasCode}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 px-4",
                "font-semibold text-white text-[15px] transition-colors",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
              style={{ background: "var(--brand-blue)" }}
              aria-label={hasCode ? `Reveal coupon code for ${coupon.merchant_name}` : "No code required"}
            >
              <Ticket className="w-4 h-4" strokeWidth={2.5} />
              {hasCode ? "Reveal code" : "No code needed — shop deal"}
              <ArrowUpRight className="w-4 h-4 opacity-80" strokeWidth={2.5} />
            </motion.button>
          ) : (
            <motion.div
              key="code"
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="flex items-stretch gap-2"
            >
              {/* Ticket-style code box (cobalt = coupon identity) */}
              <div
                className="relative flex-1 flex items-center rounded-lg border-2 border-dashed px-3 py-2.5 overflow-hidden"
                style={{ borderColor: "var(--brand-blue)", background: "var(--verified-bg)" }}
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: "var(--brand-blue)" }}
                  aria-hidden
                />
                <code className="font-code font-bold text-lg tracking-wide truncate" style={{ color: "var(--text)" }}>
                  {coupon.code}
                </code>
              </div>
              <button
                onClick={() => coupon.code && copy(coupon.code)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 font-semibold text-white text-sm"
                style={{ background: copied ? "var(--verified)" : "var(--brand-blue)" }}
                aria-label={copied ? "Code copied" : "Copy code"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="done"
                      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" strokeWidth={3} /> Copied
                    </motion.span>
                  ) : (
                    <motion.span key="copy" className="inline-flex items-center gap-1.5">
                      <Copy className="w-4 h-4" strokeWidth={2.5} /> Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <div className="mt-3 pt-3 border-t border-token flex items-center justify-between">
        {vote ? (
          <p className="text-xs font-semibold" style={{ color: vote === "up" ? "var(--verified-text)" : "var(--text-muted)" }}>
            {vote === "up" ? "Thanks — marked as working ✓" : "Thanks for the heads-up"}
          </p>
        ) : (
          <p className="text-xs text-subtle">Did this code work?</p>
        )}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleVote(true)}
            disabled={!!vote}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border transition-colors disabled:opacity-70",
              vote === "up" ? "text-white" : "",
            )}
            style={
              vote === "up"
                ? { background: "var(--verified)", borderColor: "var(--verified)" }
                : { borderColor: "var(--border)", color: "var(--verified-text)" }
            }
            aria-label="This code worked"
          >
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={2.5} /> Worked
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={!!vote}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border transition-colors disabled:opacity-70",
              vote === "down" ? "text-white" : "",
            )}
            style={
              vote === "down"
                ? { background: "var(--invalid)", borderColor: "var(--invalid)" }
                : { borderColor: "var(--border)", color: "var(--invalid)" }
            }
            aria-label="This code did not work"
          >
            <ThumbsDown className="w-3.5 h-3.5" strokeWidth={2.5} /> Didn&apos;t
          </button>
        </div>
      </div>
    </article>
  );
}
