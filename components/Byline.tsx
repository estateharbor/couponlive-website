import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// Accountable byline for E-E-A-T. `team` uses "Reviewed by" (dynamic pages);
// otherwise "By" (guides/policies). Links to the relevant trust page.
export function Byline({
  author,
  role,
  reviewed,
  team = false,
}: {
  author: string;
  role: string;
  reviewed?: string;
  team?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
      <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--verified)" }} strokeWidth={2.25} />
      <span>
        {team ? "Reviewed by " : "By "}
        <Link href={team ? "/how-it-works/" : "/editorial-policy/"} className="font-semibold hover:underline" style={{ color: "var(--text)" }}>
          {author}
        </Link>
        {role ? `, ${role}` : ""}
      </span>
      {reviewed && <span>· Last reviewed {reviewed}</span>}
    </div>
  );
}
