import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How CouponLive earns from affiliate links — and why it never affects verification status or ranking.",
  alternates: { canonical: "/affiliate-disclosure/" },
};

export default function AffiliateDisclosurePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>Affiliate Disclosure</h1>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            Some links on CouponLive are <strong>affiliate links</strong>. If you sign up or buy through them,
            we may earn a commission at <strong>no extra cost to you</strong> — it&apos;s how we fund the
            verification work.
          </p>
          <p>
            This <strong>never</strong> affects whether an offer is marked ✓ Verified, and it never changes how
            offers are ranked. Ranking is based on confidence and usefulness. Any sponsored placement is
            labelled &ldquo;Sponsored&rdquo; or &ldquo;Ad.&rdquo;
          </p>
          <p>
            All trademarks belong to their respective owners; listing a brand does not imply endorsement.
            Questions? <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a> —
            or read our <Link href="/editorial-policy/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>editorial policy</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
