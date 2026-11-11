# KENZ Mobile Phones — Website (English + Arabic)

Next.js 14 storefront for KENZ Mobile Phones, Maisooni Center, Al Dhait South, Ras Al Khaimah. Deploys to Vercel from `main`.

- English: `/` · Arabic (RTL): `/ar` — switch with the EN / ع button in the header.
- Shop with departments, search, brand filters: `/shop` (`/ar/shop`). Old `/accessories` links redirect here.
- Every phone and accessory has its own page: `/product/<id>` (`/ar/product/<id>`), with a WhatsApp enquiry that includes the product details and link.
- No prices on the site. Prices are shared on WhatsApp.

## Where things live
- `app/products.js` — the 20 phones and their specs. Photos: `public/phones/<id>-main|back|side.webp` (listed in `app/phonePhotos.js`).
- `app/accessories.js` — every accessory. Photo: `public/products/<brand>-<name>.webp` (800×800, white background); `app/photos.js` lists the files.
- `app/catalog.js` — joins phones + accessories and defines the departments.
- `app/ui.js` (layout text) and `app/content.js` (business details, services, FAQ) — English and Arabic.
- `app/workshop.js` — workshop photos (Unsplash, credited on the page).
- `app/z.css` — all styles.

## Run locally
```
npm install
npm run dev
```
