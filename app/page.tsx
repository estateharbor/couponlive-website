import { Activity, ShieldCheck, Search, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CouponCard } from "@/components/CouponCard";
import { MerchantTile } from "@/components/MerchantTile";
import { MOCK_COUPONS, MOCK_LIVE_FEED, MOCK_MERCHANTS } from "@/lib/mock";
import { relativeTime } from "@/lib/freshness";

export default function HomePage() {
  const hero = MOCK_COUPONS.find((c) => c.id === 108)!; // 60% off, freshest
  const grid = MOCK_COUPONS.filter((c) => c.status !== "invalid").slice(0, 6);
  const justVerified = MOCK_LIVE_FEED.filter((c) => c.last_validated_at).slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:pt-16 grid gap-10 lg:grid-cols-[1.05fr_.95fr] items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "var(--verified-bg)", color: "var(--verified-text)" }}
            >
              <span className="inline-block w-2 h-2 rounded-full animate-livePulse" style={{ background: "var(--verified)" }} />
              <Activity className="w-3.5 h-3.5 animate-heartbeat" strokeWidth={2.75} />
              Live-verified · updated every hour
            </span>

            <h1 className="font-display font-bold tracking-tight mt-4 text-4xl sm:text-5xl leading-[1.05]" style={{ color: "var(--text)" }}>
              Coupon codes that{" "}
              <span style={{ color: "var(--verified)" }}>actually work.</span>
              <br className="hidden sm:block" /> Verified live, every hour.
            </h1>

            <p className="text-base sm:text-lg text-muted mt-4 max-w-xl">
              Every code here was tested at a real checkout minutes ago — not scraped and
              republished like everyone else. No more &ldquo;coupon expired&rdquo; at the last step.
            </p>

            {/* Search */}
            <form action="/search/" className="mt-6 flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  name="q"
                  placeholder="Search Myntra, Flipkart, Nykaa…"
                  className="w-full surface border border-token rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none"
                  aria-label="Search stores and coupons"
                />
              </div>
              <button className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand-blue)" }}>
                Search
              </button>
            </form>

            {/* Trust stats */}
            <dl className="flex flex-wrap gap-x-8 gap-y-2 mt-7">
              <Stat icon={<ShieldCheck className="w-4 h-4" />} value="100%" label="tested before shown" />
              <Stat icon={<Zap className="w-4 h-4" />} value="Hourly" label="re-verification" />
              <Stat icon={<Activity className="w-4 h-4" />} value="6 stores" label="live checkout checks" />
            </dl>
          </div>

          {/* Hero showcase card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, rgba(19,178,94,.18), transparent)" }} aria-hidden />
            <div className="relative">
              <CouponCard coupon={hero} />
            </div>
          </div>
        </section>

        {/* JUST VERIFIED strip */}
        <section className="border-y border-token surface">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3 overflow-x-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold shrink-0" style={{ color: "var(--verified-text)" }}>
              <span className="inline-block w-2 h-2 rounded-full animate-livePulse" style={{ background: "var(--verified)" }} />
              JUST VERIFIED
            </span>
            {justVerified.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-2 text-xs font-medium text-muted shrink-0 rounded-full border border-token px-3 py-1">
                <MerchantTile name={c.merchant_name} size={18} />
                {c.merchant_name}
                <span style={{ color: "var(--verified-text)" }}>· {relativeTime(c.last_validated_at)}</span>
              </span>
            ))}
          </div>
        </section>

        {/* TRENDING MERCHANTS */}
        <section className="mx-auto max-w-6xl px-4 pt-12">
          <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>Trending stores</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOCK_MERCHANTS.map((m) => (
              <a key={m.id} href={`/store/${m.slug}/`} className="surface border border-token rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
                <MerchantTile name={m.name} size={48} />
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{m.name}</span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--verified-text)" }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--verified)" }} />
                  {m.valid_coupon_count} live
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* FRESHEST CODES */}
        <section className="mx-auto max-w-6xl px-4 pt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>Freshest verified codes</h2>
            <a href="/deals/" className="text-sm font-semibold" style={{ color: "var(--brand-blue)" }}>View all →</a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((c) => (
              <CouponCard key={c.id} coupon={c} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "var(--verified)" }}>{icon}</span>
      <div>
        <dd className="font-display font-bold text-sm leading-none" style={{ color: "var(--text)" }}>{value}</dd>
        <dt className="text-xs text-subtle mt-0.5">{label}</dt>
      </div>
    </div>
  );
}
