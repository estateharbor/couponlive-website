import { confidencePct } from "@/lib/format";
import { cn } from "@/lib/cn";

// Honest confidence signal. Two distinct cases so we never imply a user poll
// that didn't happen:
//   • Crowd votes exist  -> "3 of 4 said it worked" (a real denominator).
//   • No votes yet       -> "High/Medium confidence" from our model, NOT a
//                           fabricated "% of users worked".
export function ConfidenceMeter({
  score,
  up,
  total,
  className,
}: {
  score: number;
  up?: number;
  total?: number;
  className?: string;
}) {
  const votes = total ?? 0;

  if (votes > 0) {
    const upN = Math.min(up ?? 0, votes);
    const pct = Math.round((upN / votes) * 100);
    const low = pct < 50;
    const fill = low ? "var(--aging)" : "var(--verified)";
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className="relative h-1.5 flex-1 rounded-full overflow-hidden"
          style={{ background: "var(--stale-bg)" }}
          role="meter"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${upN} of ${votes} people said this worked`}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%`, background: fill }}
          />
        </div>
        <span
          className="text-xs font-semibold tabular-nums whitespace-nowrap"
          style={{ color: low ? "var(--aging)" : "var(--verified-text)" }}
        >
          {upN} of {votes} said it worked
        </span>
      </div>
    );
  }

  // No crowd votes — show our model confidence honestly, as a labelled estimate.
  const pct = confidencePct(score);
  const label = pct >= 80 ? "High confidence" : pct >= 50 ? "Medium confidence" : "Low confidence";
  const low = pct < 50;
  const fill = low ? "var(--aging)" : "var(--verified)";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="relative h-1.5 flex-1 rounded-full overflow-hidden"
        style={{ background: "var(--stale-bg)" }}
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Estimated confidence ${pct} percent — no user votes yet`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
      <span
        className="text-xs font-semibold whitespace-nowrap"
        style={{ color: low ? "var(--aging)" : "var(--verified-text)" }}
      >
        {label}
      </span>
    </div>
  );
}
