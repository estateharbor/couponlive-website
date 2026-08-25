import { confidencePct } from "@/lib/format";
import { cn } from "@/lib/cn";

// "94% worked" — green fill, honestly turning amber below 50%.
export function ConfidenceMeter({ score, className }: { score: number; className?: string }) {
  const pct = confidencePct(score);
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
        aria-label={`${pct} percent of users reported this worked`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
      <span
        className="text-xs font-semibold tabular-nums"
        style={{ color: low ? "var(--aging)" : "var(--verified-text)" }}
      >
        {pct}% worked
      </span>
    </div>
  );
}
