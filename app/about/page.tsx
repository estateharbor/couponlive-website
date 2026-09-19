import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Byline } from "@/components/Byline";
import { FOUNDER, SUPPORT_EMAIL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "About CouponLive",
  description:
    "CouponLive is India's proof-first savings site — coupon codes, deals and free trials, with checkout-tested offers clearly separated from sourced ones.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>About CouponLive</h1>
        <div className="mt-3"><Byline author={FOUNDER.name} role={FOUNDER.role} /></div>

        <div className="prose-like mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            CouponLive is a <strong>proof-first savings platform for India</strong> — coupon codes, deals and
            free-access offers (free trials, free plans, student offers and startup credits), with a simple
            promise: you always know <em>how</em> an offer was checked before you rely on it.
          </p>
          <p>
            Most coupon sites republish scraped codes and hope they work. We do it differently. Where a store
            allows it, we run a code through a <strong>real checkout</strong> and only then mark it{" "}
            <strong style={{ color: "var(--verified-text)" }}>✓ Verified</strong>. Everything else is labelled
            honestly — <em>merchant-sourced</em> (from an affiliate feed, not yet checkout-tested) or{" "}
            <em>community-reported</em> — so nothing pretends to be more certain than it is.
          </p>
          <p>
            Prices are shown in ₹, and for free trials we show whether a card is required, the trial length,
            and the exact renewal price — with a reminder before it auto-charges. Facts we can&apos;t confirm
            say &ldquo;Unknown&rdquo; rather than a guess.
          </p>

          <h2 className="font-display font-bold text-xl pt-4" style={{ color: "var(--text)" }}>Who runs CouponLive</h2>
          <p>
            <strong style={{ color: "var(--text)" }}>{FOUNDER.name}</strong> — {FOUNDER.role.replace(", CouponLive", "")}. {FOUNDER.bio}
          </p>
          <p>
            Frequently-updated store, coupon and free-trial pages are maintained by the{" "}
            <strong style={{ color: "var(--text)" }}>CouponLive Verification Team</strong>, which reviews offer
            terms, eligibility, expiry and sources.
          </p>

          <h2 className="font-display font-bold text-xl pt-4" style={{ color: "var(--text)" }}>How we make money</h2>
          <p>
            Some links are affiliate links — if you buy through them we may earn a commission at no extra cost
            to you. It never changes whether an offer is marked Verified. See our{" "}
            <Link href="/affiliate-disclosure/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>affiliate disclosure</Link>.
          </p>

          <h2 className="font-display font-bold text-xl pt-4" style={{ color: "var(--text)" }}>Contact</h2>
          <p>
            Questions, feedback or corrections: <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a>.
            See also <Link href="/how-it-works/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>how we verify</Link>,{" "}
            our <Link href="/editorial-policy/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>editorial policy</Link>, and{" "}
            <Link href="/corrections/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>report an error</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
