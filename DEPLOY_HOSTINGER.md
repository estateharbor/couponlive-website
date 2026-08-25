# Deploying CouponLive to Hostinger (static export)

This site is a **fully static export** — plain HTML/CSS/JS with no Node runtime.
It runs on Hostinger **shared hosting**. All dynamic data is fetched in the
browser from the CouponLive backend API.

> ⚠️ The **Python backend** (scrapers, Playwright validators, Celery, Redis) does
> **not** run on shared hosting. Host it on a **Hostinger VPS** or **Railway**.
> This static frontend only *calls* it over HTTPS.

---

## 1. Build

Set the API URL at **build time** (it's inlined into the static files), then build:

```bash
# .env.production  (or pass inline)
NEXT_PUBLIC_API_URL=https://api.couponlive.in

npm ci
npm run build
```

Output lands in **`out/`**. If `NEXT_PUBLIC_API_URL` is unset, the site builds
against the built-in typed mock data (useful for a preview before the API is up).

## 2. Upload

Upload the **contents of `out/`** (not the folder itself) into `public_html`:

- **hPanel → File Manager** → open `public_html` → upload the files, **or**
- zip `out/`, upload the zip, and **Extract** inside `public_html`, **or**
- **Hostinger Git deploy**: connect the repo and set the deploy/build to publish
  `out/` to `public_html`.

`out/` already contains `index.html`, pre-rendered `store/<slug>/` and
`category/<slug>/` folders (each with its own `<title>`/meta/OG), `404.html`,
the favicons, `site.webmanifest`, and `theme-init.js`.

## 3. Domain

Point **couponlive.in** at the hosting (hPanel → Domains). If the domain is
registered elsewhere, set its nameservers/A-record to Hostinger.

## 4. SSL

hPanel → **SSL** → enable the free SSL certificate for couponlive.in. Force
HTTPS. (The browser blocks mixed content, so the site and the API must both be
HTTPS.)

## 5. Backend CORS + HTTPS (required, or data calls fail)

Because the browser calls the API cross-origin, the **backend must**:

- be served over **HTTPS** (e.g. `https://api.couponlive.in`), and
- return CORS headers allowing the site origin:

  ```
  Access-Control-Allow-Origin: https://couponlive.in
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```

In the FastAPI backend that's:

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://couponlive.in", "https://www.couponlive.in"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
```

If CORS or HTTPS is missing, coupons/merchants/feedback calls are blocked by the
browser and the site shows empty states (it fails gracefully, never crashes).

## 6. Verify

- `https://couponlive.in/` loads, logo + fonts render.
- A store page (e.g. `https://couponlive.in/store/myntra/`) has its own title/meta
  (View Source) and loads coupons client-side.
- A bad URL shows the branded 404.
- Reveal-copy works; **Worked/Didn't** posts to the API.

## Redeploying

Re-run `npm run build` and re-upload `out/`. Changing `NEXT_PUBLIC_API_URL`
requires a rebuild (it's compiled in, not read at runtime).

## SPA routing note

`trailingSlash: true` is set, so every route is a real folder with an
`index.html` — Hostinger serves these directly with no rewrite rules needed.
Unknown paths fall through to `404.html`.
