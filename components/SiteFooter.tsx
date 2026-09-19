import Link from "next/link";
import { Logo } from "./Logo";
import { Activity } from "lucide-react";
import { FOUNDER } from "@/lib/editorial";

export function SiteFooter() {
  return (
    <footer className="border-t border-token mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="text-sm text-muted mt-3 max-w-xs">
            Real coupon codes, deals and free trials for India — checkout-tested offers clearly
            separated from sourced ones. Proof-first, refreshed hourly.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3" style={{ color: "var(--verified-text)" }}>
            <Activity className="w-3.5 h-3.5" strokeWidth={2.75} /> Checkout-tested where possible
          </p>
          <p className="text-xs text-subtle mt-3">
            Editorial lead: <Link href="/about/" className="font-semibold hover:underline" style={{ color: "var(--text)" }}>{FOUNDER.name}</Link>
          </p>
        </div>
        <FooterCol title="Browse" links={[["Top stores", "/stores/"], ["Categories", "/categories/"], ["Deals feed", "/deals/"], ["Free Trials", "/free-trials/"]]} />
        <FooterCol title="Company" links={[["About", "/about/"], ["Editorial Policy", "/editorial-policy/"], ["How we verify", "/how-it-works/"], ["Report an error", "/corrections/"]]} />
        <FooterCol title="Legal" links={[["Affiliate Disclosure", "/affiliate-disclosure/"], ["Privacy", "/privacy/"], ["Terms", "/terms/"]]} />
      </div>
      <div className="border-t border-token">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-subtle">
          <p className="max-w-3xl">
            Some links on CouponLive are affiliate links — if you buy through them we may
            earn a commission, at no extra cost to you. This never affects whether a code
            shows as ✓ Verified.
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 justify-between">
            <span>© {new Date().getFullYear()} CouponLive · couponlive.in</span>
            <span>Honest by design — no fake timers, no forced signup.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-display font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>{title}</p>
      <ul className="space-y-1.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-sm text-muted hover:text-[color:var(--brand-blue)] transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
