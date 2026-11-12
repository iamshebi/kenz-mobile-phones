// One catalogue for the whole site. The product list lives in /catalog.json, which the admin dashboard
// (/admin) edits and publishes as a GitHub commit; Vercel then rebuilds the site.
// Phone specs, colours and extra photo views stay in products.js / phonePhotos.js (linked by `x`).
// Each visible item has its own page at /product/<id> (English) and /ar/product/<id> (Arabic).
import data from "../catalog.json";
import { products as phones } from "./products";
import { PHONE_PHOTOS } from "./phonePhotos";

const SPEC = Object.fromEntries(phones.map((p) => [p.id, p]));
const GENUINE = ["apple", "samsung", "huawei"];

export const version = data.v || 0;
export const categories = data.categories.map((c) => ({ key: c.id, en: c.en, ar: c.ar || c.en }));
export const catName = (k, lang) => categories.find((c) => c.key === k)?.[lang] || "";
const keyOf = (i) => (data.categories[i] || {}).id;

// Departments group categories. Order sets the home grid layout.
export const departments = data.departments.map((d) => ({ id: d.id, en: d.en, ar: d.ar || d.en, icon: d.icon || "spark", cats: d.cats.map(keyOf).filter(Boolean) }));
export const deptOf = (cat) => departments.find((d) => d.cats.includes(cat));

const toItem = (r) => {
  const s = r.x && SPEC[r.x], c = keyOf(r.c);
  const img = r.i ? `/${r.i}` : null;
  const base = {
    id: r.id, b: r.b || "", n: r.n, c, img,
    d: { en: r.d || "", ar: r.da || r.d || "" },
    pr: typeof r.pr === "number" && r.pr > 0 ? r.pr : null,
    st: r.st === "out" || r.st === "soon" ? r.st : null,
  };
  if (s) {
    const views = (PHONE_PHOTOS[s.id] || []).map((v) => ({ v, src: v === "main" && img ? img : `/phones/${s.id}-${v}.webp` }));
    // colour / storage come from products.js unless the admin changed the details text
    const own = (r.d || "") === `${s.color.en} · ${s.storage}`;
    return { ...base, k: "phone", views, color: own ? s.color : null, hex: own ? s.hex : null, storage: own ? s.storage : null, tag: s.tag || null, specs: s.specs };
  }
  return { ...base, k: "acc", genuine: GENUINE.includes(c) };
};

// Hidden items (h: 1) are left out of the website entirely.
export const items = data.products.filter((r) => !r.h && keyOf(r.c)).map(toItem);
// hide empty categories / departments
const used = new Set(items.map((i) => i.c));
categories.splice(0, categories.length, ...categories.filter((c) => used.has(c.key)));
departments.forEach((d) => { d.cats = d.cats.filter((c) => used.has(c)); });
departments.splice(0, departments.length, ...departments.filter((d) => d.cats.length));
export const byId = (id) => items.find((i) => i.id === id);
export const phoneList = items.filter((i) => i.k === "phone");
export const brandCount = new Set(items.map((i) => i.b).filter(Boolean)).size;

// Full display name ("Apple AirPods Pro 3", but not "Apple Apple Pencil")
export const full = (p) => (p.b && !p.n.toLowerCase().startsWith(p.b.toLowerCase()) && p.k !== "phone" ? `${p.b} ${p.n}` : p.n);

export const pick = (ids) => ids.map(byId).filter(Boolean);

// ---------- prices (AED, optional) ----------
export const hasPr = (p) => typeof p.pr === "number" && p.pr > 0;
export const prNum = (v) => Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtPr = (v, lang) => (lang === "ar" ? `${prNum(v)} درهم` : `AED ${prNum(v)}`);
