import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = "https://couponlive.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "CouponLive — Coupon codes that actually work",
    template: "%s · CouponLive",
  },
  description:
    "Live-verified coupon codes for India's top stores. Every code is tested working before you see it — no more expired codes at checkout.",
  applicationName: "CouponLive",
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/couponlive-icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "CouponLive",
    title: "CouponLive — Coupon codes that actually work",
    description:
      "Live-verified coupon codes for India's top stores. Every code tested working — no more expired codes at checkout.",
    url: SITE,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CouponLive — Coupon codes that actually work",
    description: "Live-verified coupon codes for India's top stores.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#13B25E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets the theme class before paint (external file, not an inline
            React script, so React 19 doesn't drop it). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@600,700&f[]=satoshi@400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
