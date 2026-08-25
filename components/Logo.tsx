import Link from "next/link";

// Always the exact provided wordmark. The full (navy-ink) logo reads on light
// backgrounds; in dark mode we swap to the white-text variant so it stays
// legible (per the tokens file's note about the dark ink on dark surfaces).
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="CouponLive home" className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/couponlive-logo-full.png"
        alt="CouponLive"
        width={168}
        height={38}
        className="h-8 w-auto block dark:hidden"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/couponlive-logo-white.png"
        alt="CouponLive"
        width={168}
        height={38}
        className="h-8 w-auto hidden dark:block"
      />
    </Link>
  );
}
