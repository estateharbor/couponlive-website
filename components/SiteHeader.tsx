import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Stores", href: "/stores/" },
  { label: "Categories", href: "/categories/" },
  { label: "Deals", href: "/deals/" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-token surface/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">
        <Logo priority />
        <nav className="hidden sm:flex items-center gap-1 ml-4">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-[color:var(--brand-blue)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/deals/"
            className="hidden sm:inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--brand-blue)" }}
          >
            Browse deals
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
