import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/cn";

// Cobalt-blue category chips (coupon-identity color, never green).
export function CategoryChips({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const isActive = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}/`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold border transition-colors",
              isActive ? "text-white" : "hover:bg-blue-50",
            )}
            style={
              isActive
                ? { background: "var(--brand-blue)", borderColor: "var(--brand-blue)" }
                : { color: "var(--brand-blue)", borderColor: "var(--border)" }
            }
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
