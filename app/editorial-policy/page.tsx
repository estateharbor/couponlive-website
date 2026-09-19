import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Byline } from "@/components/Byline";
import { FOUNDER, SUPPORT_EMAIL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How CouponLive sources, labels, verifies and corrects offers — and how we keep editorial judgement independent of commercial links.",
  alternates: { canonical: "/editorial-policy/" },
};

const TIERS = [
  ["Checkout verified", "We ran the code through the relevant checkout and a discount applied. Shown with a green ✓ Verified badge and the time it was tested."],
  ["Merchant sourced", "The offer comes from a merchant or affiliate network but has not been checkout-tested by us. Labelled “Not verified yet” — accurate, but try it as you would any code."],
  ["Community reported", "Users told us it worked. Shown as a success ratio with the number of votes, never a bare percentage."],
  ["Expired / failed", "Removed from active listings when it fails a re-test or passes its expiry."],
];

export default function EditorialPolicyPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>Editorial Policy</h1>
        <div className="mt-3"><Byline author={FOUNDER.name} role={FOUNDER.role} /></div>

        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            CouponLive exists to be <strong>more trustworthy</strong> than a typical coupon site. These are the
            standards we hold ourselves to.
          </p>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>Every offer has one honest status</h2>
          <div className="space-y-2">
            {TIERS.map(([t, d]) => (
              <div key={t} className="surface border border-token rounded-lg p-3">
                <p className="font-semibold" style={{ color: "var(--text)" }}>{t}</p>
                <p className="text-sm mt-0.5">{d}</p>
              </div>
            ))}
          </div>
          <p>
            We never label an offer &ldquo;Verified&rdquo; without a passing verification run, and we never
            invent facts — unknown conditions are shown as &ldquo;Unknown.&rdquo; See{" "}
            <Link href="/how-it-works/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>how we verify</Link>.
          </p>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>Bylines & accountability</h2>
          <p>
            Guides, research and policy pages are written under a named editor,{" "}
            <strong style={{ color: "var(--text)" }}>{FOUNDER.name}</strong>. Frequently-updated store, coupon
            and free-trial pages are maintained and reviewed by the{" "}
            <strong style={{ color: "var(--text)" }}>CouponLive Verification Team</strong>, with a
            &ldquo;Last reviewed&rdquo; date.
          </p>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>Independence & commercial links</h2>
          <p>
            Some links earn us a commission (see our{" "}
            <Link href="/affiliate-disclosure/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>affiliate disclosure</Link>).
            Commission <strong>never</strong> affects an offer&apos;s verification status or its ranking;
            sponsored placements, if any, are labelled.
          </p>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>Corrections</h2>
          <p>
            Found an error? Email <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a>{" "}
            or use our <Link href="/corrections/" className="font-semibold" style={{ color: "var(--brand-blue)" }}>corrections page</Link>. We aim to
            investigate offer-related errors within two business days.
          </p>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>What we won&apos;t do</h2>
          <p>
            No fake countdowns or &ldquo;X people viewing,&rdquo; no forced signup to reveal a code, and no
            piracy, account-sharing or trial-reset tricks.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
