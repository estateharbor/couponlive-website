import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The basic terms for using CouponLive.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>Terms of Use</h1>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            CouponLive provides information about coupon codes, deals and free-access offers for convenience.
            We work hard to keep it accurate and to clearly label what we&apos;ve verified, but offers change
            constantly and are ultimately governed by each merchant&apos;s own terms.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Offers, prices, eligibility and availability are set by the merchant and can change or end without notice. Always confirm the final price and terms at checkout.</li>
            <li>A &ldquo;✓ Verified&rdquo; badge means we confirmed the offer at a checkout at the stated time — it is not a guarantee it will work for every account, cart or region.</li>
            <li>Some links are affiliate links; see our <Link href="/affiliate-disclosure/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>affiliate disclosure</Link>.</li>
            <li>Trademarks and brand names belong to their respective owners; their use here is nominative and does not imply endorsement.</li>
            <li>Use the site lawfully; don&apos;t attempt to disrupt it or scrape it at scale.</li>
          </ul>
          <p>
            To the extent permitted by law, CouponLive isn&apos;t liable for losses arising from reliance on
            listed offers. Questions: <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
