import { Activity, ShieldCheck, Search, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CouponGrid } from "@/components/CouponGrid";
import { FeaturedCode } from "@/components/FeaturedCode";
import { TrendingStores } from "@/components/TrendingStores";

export default function HomePage() {
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
              Fresh codes · updated hourly
            </span>

            <h1 className="font-display font-bold tracking-tight mt-4 text-4xl sm:text-5xl leading-[1.05]" style={{ color: "var(--text)" }}>
              Coupon codes that{" "}
              <span style={{ color: "var(--verified)" }}>actually work.</span>
              <br className="hidden sm:block" /> Fresh from India&apos;s top stores.
            </h1>

            <p className="text-base sm:text-lg text-muted mt-4 max-w-xl">
              Real coupon codes for India&apos;s top stores, refreshed hourly. The ones we&apos;ve
              checkout-tested carry a green <span className="font-semibold" style={{ color: "var(--verified-text)" }}>✓ Verified</span> badge —
              the rest are the latest from our sources, ready to try.
            </p>

            {/* Search */}
            <form action="/search/" className="mt-6 flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  name="q"
                  placeholder="Search stores and codes…"
                  className="w-full surface border border-token rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none"
                  aria-label="Search stores and coupons"
                />
              </div>
              <button className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand-blue)" }}>
                Search
              </button>
            </form>

            {/* Honest highlights — no blanket "100% verified" claim */}
            <dl className="flex flex-wrap gap-x-8 gap-y-2 mt-7">
              <Stat icon={<Zap className="w-4 h-4" />} value="Hourly" label="fresh from sources" />
              <Stat icon={<ShieldCheck className="w-4 h-4" />} value="✓ Verified" label="badge on tested codes" />
              <Stat icon={<Activity className="w-4 h-4" />} value="One-tap" label="reveal, copy & go" />
            </dl>
          </div>

          {/* Hero showcase — a real code from the live directory */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, rgba(10,95,243,.16), transparent)" }} aria-hidden />
            <div className="relative">
              <FeaturedCode />
            </div>
          </div>
        </section>

        {/* TRENDING STORES (real) */}
        <section className="mx-auto max-w-6xl px-4 pt-12">
          <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>Trending stores</h2>
          <div className="mt-4">
            <TrendingStores />
          </div>
        </section>

        {/* LATEST CODES (real directory) */}
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-4">
          <div className="flex items-end justify-between">
            <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>Latest codes</h2>
            <a href="/deals/" className="text-sm font-semibold" style={{ color: "var(--brand-blue)" }}>View all →</a>
          </div>
          <p className="text-sm text-muted mt-1">Newest codes from our sources. A green ✓ badge means we checkout-tested it.</p>
          <div className="mt-4">
            <CouponGrid showControls={false} limit={6} />
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
