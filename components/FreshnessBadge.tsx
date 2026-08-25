import { Activity } from "lucide-react";
import { cn } from "@/lib/cn";
import { FRESHNESS_STYLE, type Freshness } from "@/lib/freshness";

// The freshness badge — the site's trust signature. On a freshly-verified
// coupon it carries the logo's heartbeat: a pulsing green dot + heartbeat glyph.
export function FreshnessBadge({ freshness, className }: { freshness: Freshness; className?: string }) {
  const s = FRESHNESS_STYLE[freshness.state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        className,
      )}
      style={{ background: s.bg, color: s.text }}
    >
      {freshness.pulse ? (
        <span className="relative inline-flex items-center justify-center">
          <span
            className="inline-block w-2 h-2 rounded-full animate-livePulse"
            style={{ background: s.dot }}
          />
        </span>
      ) : (
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: s.dot }} />
      )}
      {freshness.state === "fresh" && (
        <Activity className="w-3.5 h-3.5 animate-heartbeat" strokeWidth={2.75} aria-hidden />
      )}
      {freshness.label}
    </span>
  );
}
