# KENZ Mobile Phones — Website (English + Arabic)

Next.js 14 site for KENZ Mobile Phones, Maisooni Center, Al Dhait South, Ras Al Khaimah.

- English: `/`  ·  Arabic (RTL): `/ar`  — switch with the EN / عربي button in the header and footer.
- All text for both languages lives in `app/content.js`.
- Accessories catalogue (203 items, categories, brands): `app/accessories.js` — pages `/accessories` and `/ar/accessories`.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Vercel → **Add New → Project → Import** the repo. Framework is auto-detected (Next.js). No environment variables needed.
3. Click **Deploy**. Add your custom domain later under Project → Settings → Domains.

## Run locally
```
npm install
npm run dev
```

## Product collection
The 20 phones in the collection live in `app/products.js` (name, colour, storage, specs in English and Arabic).
Each phone is shown with original drawn renders (back, front and side) in its finish colour.

To show real photos of your own stock instead, put images in `public/products/` and add a `photos` entry to that product, e.g.
```js
photos: { back: "/products/ip18pm-burgundy-back.jpg", front: "/products/ip18pm-burgundy-front.jpg", side: "/products/ip18pm-burgundy-side.jpg" },
```
Any view with a photo uses the photo; the others keep the render.
