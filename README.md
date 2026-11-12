# KENZ Mobile Phones — Website (English + Arabic)

Next.js 14 storefront for KENZ Mobile Phones, Maisooni Center, Al Dhait South, Ras Al Khaimah. Deploys to Vercel from `main`.

- English: `/` · Arabic (RTL): `/ar` — switch with the EN / ع button in the header.
- Shop with departments, search, brand filters: `/shop` (`/ar/shop`). Old `/accessories` links redirect here.
- Every phone and accessory has its own page: `/product/<id>` (`/ar/product/<id>`), with a WhatsApp enquiry that includes the product details and link.
- Optional AED price per item. Priced items show “AED 1,899.00” and a Buy now button (WhatsApp order message); unpriced items show Enquire only.

## Where things live
- `catalog.json` — every product, category and department (edited from the admin dashboard). Product fields: `id`, `c` category index, `b` brand, `n` name, `d` details, `da` Arabic details, `i` photo path under `public/`, `pr` price in AED, `st` (`out` | `soon`), `h` (1 = hidden), `x` link to phone specs.
- `app/products.js` — specs, colours and storage for the 20 phones (linked by `x`). Extra photo views: `public/phones/<id>-main|back|side.webp` (listed in `app/phonePhotos.js`).
- `public/products/<file>.webp` — accessory photos (800×800, white background).
- `app/catalog.js` — reads catalog.json for the site (hidden items left out), prices helpers.
- `app/ui.js` (layout text) and `app/content.js` (business details, services, FAQ) — English and Arabic.
- `app/workshop.js` — workshop photos (Unsplash, credited on the page).
- `app/z.css` — all styles.

## Admin dashboard (/admin)
The shop edits products at **/admin** (phone and desktop). Publishing saves `catalog.json` (and new photos in `public/products`) to this repo as one commit; Vercel rebuilds the site (~2 minutes). Code: `public/admin.*`, `app/api/*` (route handlers) and `lib/admin/*`.

Vercel environment variables (Production), then Redeploy:
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — the admin login. Extra logins: `ADMIN_EMAIL_2` + `ADMIN_PASSWORD_2` (up to `_5`). An email key can list several emails, comma-separated, sharing that password.
- `SESSION_SECRET` — random string (32+ chars) used to sign the login cookie and encrypt notes / device details.
- `GITHUB_TOKEN` — fine-grained token with **Contents: Read and write** on this repo only.
- optional: `GITHUB_REPO` (default `iamshebi/kenz-mobile-phones`), `GITHUB_BRANCH` (default `main`).

### Admin notes
Notes are shared by all admins, saved encrypted (key from `SESSION_SECRET`) in `data/admin-notes.enc`. Saving a note does not rebuild the site (`ignoreCommand` in vercel.json) and the file is never deployed (`.vercelignore`). Changing `SESSION_SECRET` makes old notes and device details unreadable.

### Admin history
Lists every change published from the dashboard (who, when, device, and what changed per item), read from the commit history.

### Testing the admin locally
`node tools/dev-server.js <copy-of-this-folder>` → http://localhost:8090/admin (login `owner@test.local` / `Test-Pass-123`). Uses a mock GitHub that writes into that folder — run it on a copy.

## Run locally
```
npm install
npm run dev
```
