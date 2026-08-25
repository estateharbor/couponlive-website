import Link from "next/link";
import { PageShell } from "@/components/PageShell";

// Next emits this as 404.html in the static export (Hostinger serves it).
export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-display font-bold text-6xl" style={{ color: "var(--brand-blue)" }}>404</p>
        <h1 className="font-display font-bold text-2xl mt-3" style={{ color: "var(--text)" }}>
          This page expired — but our codes don&apos;t.
        </h1>
        <p className="text-muted mt-2">
          The page you&apos;re after isn&apos;t here. The verified coupons still are.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-lg px-5 py-3 font-semibold text-white" style={{ background: "var(--brand-blue)" }}>
            Go home
          </Link>
          <Link href="/deals/" className="rounded-lg px-5 py-3 font-semibold border border-token" style={{ color: "var(--text)" }}>
            Browse deals
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
