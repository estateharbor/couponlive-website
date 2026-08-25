# CouponLive — Brand & Identity Tokens (matched to the official logo)
*Reconciled to the exact colors sampled from the CouponLive logo, so the site is cohesive with
it. Hand this to Claude Code as the source of truth — derive from these values, don't invent.*

Domain: couponlive.in · Positioning: **coupon codes that actually work, verified live.**
Brand system = **Navy ink + Verified Green (primary/verification) + Cobalt Blue (secondary).**
Green owns the "live/verified" meaning (the heartbeat); blue is the coupon/ticket identity color.
Discipline still applies: green appears for verification, confidence, and the primary confirm
action — never as decoration.

---

## 1. Brand assets — use the exact provided logo (do not redraw)
Place these in `public/` and reference them directly:
- `public/couponlive-logo-full.png` — transparent wordmark logo → site **header** and **footer**.
- `public/couponlive-logo-white-bg.png` — white-bg fallback (e.g. emails, contexts needing a solid bg).
- `public/couponlive-icon-512.png`, `public/couponlive-icon-192.png` — square app icon → PWA
  manifest icons + Open Graph / social share image base.
- `public/couponlive-favicon-32.png` — favicon.
Always set descriptive `alt="CouponLive"`. On dark backgrounds use the transparent full logo
(its ink text is dark, so keep the header light, or request a white-text logo variant later).

## 2. Signature motif — the heartbeat pulse
The logo's **green heartbeat** is the brand's signature "live" mark. Echo it in the UI: the
freshness badge on freshly-verified coupons carries the same pulse idea, and it's the one element
allowed to animate (a ~2s green pulse; static under `prefers-reduced-motion`). This ties every
"verified" moment on the site back to the logo.

---

## 3. Color system (sampled from the logo)

### 3a. Verified Green — primary / verification (anchor `#13B25E`)
| Token | Hex | Use |
|---|---|---|
| green-50  | `#E9F9F0` | verified-badge bg, success surfaces |
| green-100 | `#C6F0D8` | confidence-bar track |
| green-200 | `#98E4B9` | hover tints |
| green-300 | `#63D595` | pulse glow |
| green-400 | `#33C577` | highlights |
| **green-500** | **`#13B25E`** | **signature — heartbeat, primary CTA, "live"** |
| green-600 | `#0F9C51` | CTA hover |
| green-700 | `#0D7E42` | green **text** on light (AA), links-as-verified |
| green-800 | `#0B6335` | pressed, dark-mode text |
| green-900 | `#084E2A` | deepest |
White text on green-600+. Green text on white uses green-700+.

### 3b. Navy / Ink — structure & text (anchor `#00253C`, the logo's text color)
| Token | Hex | Use |
|---|---|---|
| white     | `#FFFFFF` | cards (light) |
| navy-50   | `#F2F6F8` | app bg (light) |
| navy-100  | `#E1EAEF` | muted surface, stale bg |
| navy-200  | `#C5D5DE` | borders |
| navy-300  | `#9EB5C2` | disabled |
| navy-400  | `#688395` | muted/stale text |
| navy-500  | `#425F73` | secondary text |
| navy-600  | `#2B4557` | body text |
| navy-700  | `#163140` | strong body |
| navy-800  | `#08202E` | dark surface |
| navy-900  | `#00253C` | headings / logo ink |
| navy-950  | `#001620` | app bg (dark mode) |

### 3c. Cobalt Blue — secondary / coupon identity (anchor `#0A5FF3`, the ticket color)
Use for: the ticket/coupon visual language, informational accents, links, category chips, and
non-verification CTAs. **Never** as the verified/confidence signal — that stays green, so the two
never blur.
| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| blue-50 | `#E8F0FF` | | blue-500 | **`#0A5FF3`** |
| blue-100 | `#CBDDFF` | | blue-600 | `#084ED0` |
| blue-200 | `#9FC0FF` | | blue-700 | `#0940A4` |
| blue-300 | `#6B9BFF` | | blue-800 | `#0A3576` |
| blue-400 | `#3877FA` | | | |

### 3d. Semantic freshness states — the product's core language
| State | Meaning | Dot/Fill | Text | Background |
|---|---|---|---|---|
| **Fresh** | verified < 15 min | green-500 `#13B25E` (pulsing) | green-700 `#0D7E42` | green-50 `#E9F9F0` |
| **Recent** | verified < 2 h | green-600 `#0F9C51` | green-700 `#0D7E42` | green-50 `#E9F9F0` |
| **Aging** | 2–12 h | amber `#F5A524` | `#9A6207` | `#FEF6E7` |
| **Stale** | > 12 h / unverified | navy-400 `#688395` | navy-500 `#425F73` | navy-100 `#E1EAEF` |
| **Invalid** | last check failed | red `#F04438` | `#B42318` | `#FEECEB` |
Feedback: Worked ✅ green · Didn't work ❌ red. Confidence meter green-500 on green-100; if
confidence < 50%, fill turns amber `#F5A524` as an honest warning.

---

## 4. Typography
The logo wordmark is a friendly rounded sans, so headings echo that feel for cohesion.
| Role | Typeface | Fallback | Notes |
|---|---|---|---|
| Display / headings | **General Sans** (600/700) | `Poppins, system-ui, sans-serif` | rounded-geometric, echoes the logo; Poppins is the closest literal match |
| Body / UI | **Satoshi** (400/500/700) | `Inter, system-ui, sans-serif` | clean, legible |
| Coupon codes / data | **JetBrains Mono** (500/700) | `ui-monospace, monospace` | codes look like codes; unambiguous 0/O |
Scale (rem): xs .75 · sm .875 · base 1 · lg 1.125 · xl 1.25 · 2xl 1.5 · 3xl 1.875 · 4xl 2.25 ·
5xl 3 · 6xl 3.75. Headings General Sans, tracking −1% at 3xl+. Coupon codes JetBrains Mono, tracking +2%.

## 5. Radius / shadow / spacing
- Radius: button 12 · pill 9999 · input 10 · card 16 · modal 20.
- Shadow (soft): sm `0 1px 2px rgba(0,37,60,.06)` · md `0 4px 12px rgba(0,37,60,.08)` ·
  lg `0 12px 32px rgba(0,37,60,.10)` · focus `0 0 0 3px rgba(19,178,94,.35)` (green).
- Spacing: 4px scale (4/8/12/16/24/32/48/64); generous whitespace.

---

## 6. `tailwind.config.js` (theme.extend)
```js
module.exports = {
  darkMode:'class',
  theme:{ extend:{
    colors:{
      green:{50:'#E9F9F0',100:'#C6F0D8',200:'#98E4B9',300:'#63D595',400:'#33C577',
             500:'#13B25E',600:'#0F9C51',700:'#0D7E42',800:'#0B6335',900:'#084E2A'},
      navy: {50:'#F2F6F8',100:'#E1EAEF',200:'#C5D5DE',300:'#9EB5C2',400:'#688395',
             500:'#425F73',600:'#2B4557',700:'#163140',800:'#08202E',900:'#00253C',950:'#001620'},
      blue: {50:'#E8F0FF',100:'#CBDDFF',200:'#9FC0FF',300:'#6B9BFF',400:'#3877FA',
             500:'#0A5FF3',600:'#084ED0',700:'#0940A4',800:'#0A3576'},
      amber:{50:'#FEF6E7',500:'#F5A524',800:'#9A6207'},
      red:  {50:'#FEECEB',500:'#F04438',700:'#B42318'},
    },
    fontFamily:{
      display:['"General Sans"','Poppins','system-ui','sans-serif'],
      sans:['Satoshi','Inter','system-ui','sans-serif'],
      mono:['"JetBrains Mono"','ui-monospace','monospace'],
    },
    borderRadius:{md:'10px',lg:'12px',xl:'16px','2xl':'20px'},
    boxShadow:{
      sm:'0 1px 2px rgba(0,37,60,.06)', md:'0 4px 12px rgba(0,37,60,.08)',
      lg:'0 12px 32px rgba(0,37,60,.10)', focus:'0 0 0 3px rgba(19,178,94,.35)'},
    keyframes:{livePulse:{'0%,100%':{boxShadow:'0 0 0 0 rgba(19,178,94,.45)'},
                          '50%':{boxShadow:'0 0 0 6px rgba(19,178,94,0)'}}},
    animation:{livePulse:'livePulse 2s ease-in-out infinite'},
  }},
};
```

## 7. CSS variables (`globals.css`)
```css
:root{
  --bg:#F2F6F8; --surface:#FFFFFF; --border:#C5D5DE;
  --text:#00253C; --text-muted:#425F73; --text-subtle:#688395;
  --verified:#13B25E; --verified-text:#0D7E42; --verified-bg:#E9F9F0;
  --brand-blue:#0A5FF3;
  --aging:#F5A524; --aging-bg:#FEF6E7; --stale:#688395; --stale-bg:#E1EAEF;
  --invalid:#F04438; --invalid-bg:#FEECEB; --ring:0 0 0 3px rgba(19,178,94,.35);
}
.dark{
  --bg:#001620; --surface:#00253C; --border:#08202E;
  --text:#E1EAEF; --text-muted:#688395; --text-subtle:#425F73;
  --verified:#13B25E; --verified-text:#63D595; --verified-bg:rgba(19,178,94,.10);
  --brand-blue:#3877FA;
  --aging:#F5A524; --aging-bg:rgba(245,165,36,.12);
  --stale:#425F73; --stale-bg:rgba(104,131,149,.12);
  --invalid:#F04438; --invalid-bg:rgba(240,68,56,.12);
}
```

## 8. Fonts (static-export safe for Hostinger)
Load via CDN `<link>` in `<head>` with `display=swap`:
General Sans & Satoshi → Fontshare CSS API; JetBrains Mono → Google Fonts. (Poppins from Google
Fonts if used as the General Sans fallback.) Verify licenses (all free for web) before launch.

### One-line summary for Claude Code
> Use the exact provided logo. Match the UI to it: Verified Green `#13B25E` = live/verified
> (heartbeat + confirm), Navy `#00253C` = structure/text, Cobalt `#0A5FF3` = coupon identity &
> links. Green never shares its job with blue. The heartbeat pulse is the one thing that animates.
