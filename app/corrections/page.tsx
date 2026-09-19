import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Report an Error or Request a Correction",
  description:
    "Found an expired coupon, wrong offer condition, misleading price or broken link on CouponLive? Tell us and we'll investigate within two business days.",
  alternates: { canonical: "/corrections/" },
};

export default function CorrectionsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>
          Report an Error or Request a Correction
        </h1>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            Accuracy matters to us. If you find an expired coupon, incorrect offer condition, misleading
            price, broken link or any other error, please email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a>.
          </p>
          <p>
            Please include the <strong>page URL</strong>, the <strong>merchant or product name</strong>, and a
            short description of the issue. Screenshots are helpful but optional.
          </p>
          <p>
            We review correction requests promptly and aim to investigate reported offer-related errors within
            <strong> two business days</strong>. When a material correction is made, the page&apos;s
            &ldquo;Last reviewed&rdquo; date and correction history may be updated.
          </p>
          <p>
            For general questions or assistance, contact{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
