import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What CouponLive collects (very little), why, and your rights — including data export and deletion.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>Privacy Policy</h1>
        <p className="text-sm text-subtle mt-2">We collect as little personal data as possible.</p>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <h2 className="font-display font-bold text-xl" style={{ color: "var(--text)" }}>What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cancel reminders:</strong> if you set one, we store the email you enter and the trial details, with your explicit consent, only to send that reminder. Unsubscribe any time from the email.</li>
            <li><strong>Coupon feedback:</strong> when you vote &ldquo;worked / didn&apos;t work,&rdquo; we store a one-way hash of your IP (never the raw IP) purely to prevent vote abuse.</li>
            <li><strong>Analytics:</strong> aggregate, privacy-friendly usage stats. We don&apos;t sell personal data or build advertising profiles.</li>
          </ul>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>Affiliate links</h2>
          <p>When you click out to a store, that store (and its affiliate network) may set their own cookies under their policies. See our affiliate disclosure.</p>

          <h2 className="font-display font-bold text-xl pt-2" style={{ color: "var(--text)" }}>Your rights (DPDP)</h2>
          <p>
            You can request access to, export of, or deletion of the data tied to your email at any time —
            email <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a>.
            We&apos;ll action verified requests promptly. For any privacy grievance, contact the same address
            and we&apos;ll respond.
          </p>
          <p className="text-sm text-subtle pt-2">This policy may be updated; material changes will be reflected here.</p>
        </div>
      </section>
    </PageShell>
  );
}
