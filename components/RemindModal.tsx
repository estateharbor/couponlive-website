"use client";

import { useState } from "react";
import { BellRing, X, CheckCircle2 } from "lucide-react";
import type { TrialCard } from "@/lib/types";
import { createReminder } from "@/lib/api";

function defaultEndDate(trialDays: number | null): string {
  const d = new Date();
  d.setDate(d.getDate() + (trialDays && trialDays > 0 ? trialDays : 30));
  return d.toISOString().slice(0, 10);
}

// "Remind me to cancel" — opens a modal to set an email reminder before the
// trial auto-charges. No login: just email + end date + consent.
export function RemindModal({ trial }: { trial: TrialCard }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [endsOn, setEndsOn] = useState(defaultEndDate(trial.trial_days));
  const [consent, setConsent] = useState(true);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      await createReminder({
        email: email.trim(),
        tool_name: trial.tool_name,
        offer_id: trial.id,
        ends_on: endsOn,
        renew_price_inr: trial.renew_price_inr,
        renew_note:
          trial.renew_price_inr == null && trial.renew_price_usd != null
            ? `$${trial.renew_price_usd}/${trial.renew_period ?? "mo"}`
            : null,
        consent,
      });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-[color:var(--brand-blue)]"
        aria-label={`Set a cancel reminder for ${trial.tool_name}`}
      >
        <BellRing className="w-3.5 h-3.5" strokeWidth={2.5} /> Remind me to cancel
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.5)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="surface border border-token rounded-2xl shadow-xl w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>
                Remind me to cancel {trial.tool_name}
              </h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-subtle hover:text-[color:var(--text)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {state === "done" ? (
              <div className="mt-4 text-center py-6">
                <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: "var(--verified)" }} />
                <p className="font-display font-semibold mt-3" style={{ color: "var(--text)" }}>Reminder set!</p>
                <p className="text-sm text-muted mt-1">
                  We&apos;ll email <strong>{email}</strong> 3 days and 1 day before {new Date(endsOn).toLocaleDateString("en-IN")} — with a one-click cancel.
                </p>
                <button onClick={() => setOpen(false)} className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--brand-blue)" }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <p className="text-sm text-muted">
                  Indian banks auto-debit card mandates — we&apos;ll nudge you in time so a free trial
                  doesn&apos;t quietly become a paid plan.
                </p>
                <label className="block text-sm">
                  <span className="font-semibold" style={{ color: "var(--text)" }}>Your email</span>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 w-full surface border border-token rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold" style={{ color: "var(--text)" }}>Trial ends on</span>
                  <input
                    type="date" required value={endsOn} onChange={(e) => setEndsOn(e.target.value)}
                    className="mt-1 w-full surface border border-token rounded-lg px-3 py-2 text-sm outline-none"
                  />
                  <span className="text-xs text-subtle">
                    {trial.trial_days ? `Prefilled from the ${trial.trial_days}-day trial — adjust if you started earlier.` : "Set the date your trial ends."}
                  </span>
                </label>
                <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[color:var(--brand-blue)]" />
                  <span>Email me reminders about this trial. No spam; unsubscribe anytime.</span>
                </label>
                {state === "error" && <p className="text-xs" style={{ color: "var(--invalid)" }}>{error}</p>}
                <button
                  type="submit" disabled={!consent || state === "sending"}
                  className="w-full rounded-lg py-2.5 font-semibold text-white text-sm disabled:opacity-60"
                  style={{ background: "var(--brand-blue)" }}
                >
                  {state === "sending" ? "Setting reminder…" : "Set reminder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
