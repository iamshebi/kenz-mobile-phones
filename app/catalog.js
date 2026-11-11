// One catalogue for the whole site: the 20 phones + every accessory.
// Each item has its own page at /product/<id> (English) and /ar/product/<id> (Arabic).
import { products as phones } from "./products";
import { accessories, categories as accCats } from "./accessories";
import { PHOTOS, photoFile } from "./photos";
import { PHONE_PHOTOS } from "./phonePhotos";

const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const categories = [
  { key: "iphone", en: "iPhone", ar: "آيفون" },
  { key: "galaxy", en: "Samsung Galaxy", ar: "سامسونج جالكسي" },
  ...accCats.map(({ key, en, ar }) => ({ key, en, ar })),
];
export const catName = (k, lang) => categories.find((c) => c.key === k)?.[lang] || "";

// Departments group categories (Zaitoon-style). Order sets the home grid layout.
export const departments = [
  { id: "phones", en: "Smartphones", ar: "الهواتف الذكية", icon: "phone", cats: ["iphone", "galaxy"] },
  { id: "genuine", en: "Genuine accessories", ar: "الإكسسوارات الأصلية", icon: "badge", cats: ["apple", "samsung", "huawei"] },
  { id: "audio", en: "Audio", ar: "الصوتيات", icon: "head", cats: ["audio"] },
  { id: "power", en: "Charging & power", ar: "الشحن والطاقة", icon: "bank", cats: ["chargers", "power", "cables"] },
  { id: "car", en: "In the car", ar: "للسيارة", icon: "car", cats: ["car"] },
  { id: "protect", en: "Cases & stands", ar: "الأغطية والحوامل", icon: "shield", cats: ["protection", "stands"] },
  { id: "wear", en: "Smart watches", ar: "الساعات الذكية", icon: "watch", cats: ["watches"] },
  { id: "living", en: "Bakhoor & care", ar: "البخور والعناية", icon: "leaf", cats: ["fragrance", "care"] },
  { id: "create", en: "Creator & gaming", ar: "التصوير والألعاب", icon: "game", cats: ["creator", "tech"] },
];
export const deptOf = (cat) => departments.find((d) => d.cats.includes(cat));

const phoneItems = phones.map((p) => {
  const views = PHONE_PHOTOS[p.id] || [];
  return {
    id: slug(`${p.name} ${p.color.en} ${p.storage}`),
    k: "phone",
    b: p.brand === "iphone" ? "Apple" : "Samsung",
    n: p.name,
    d: { en: `${p.color.en} · ${p.storage}`, ar: `${p.color.ar} · ${p.storage}` },
    c: p.brand,
    img: views.includes("main") ? `/phones/${p.id}-main.webp` : null,
    views: views.map((v) => ({ v, src: `/phones/${p.id}-${v}.webp` })),
    color: p.color, hex: p.hex, storage: p.storage, tag: p.tag || null, specs: p.specs,
  };
});

// Only recognised brands are shown on the site (client request: premium, genuine image).
// Other rows stay in accessories.js so they can be switched back on by adding the brand here.
export const BRANDS = ["Apple", "Samsung", "Huawei", "JBL", "Anker", "Anker Soundcore", "Belkin", "UGREEN", "Baseus", "SanDisk", "Guess", "Swiss Military",
  "Green Lion", "Porodo", "Powerology", "WiWU", "oraimo", "Acefast", "Choetech"];

const accItems = accessories.filter((a) => BRANDS.includes(a.brand)).map((a) => {
  const f = photoFile(a);
  return {
    id: f,
    k: "acc",
    b: a.brand === "Assorted" ? "" : a.brand,
    n: a.name,
    d: a.details,
    c: a.cat,
    img: PHOTOS.has(f) ? `/products/${f}.webp` : null,
    genuine: ["apple", "samsung", "huawei"].includes(a.cat),
  };
});

export const items = [...phoneItems, ...accItems];
// hide empty categories / departments
const used = new Set(items.map((i) => i.c));
categories.splice(0, categories.length, ...categories.filter((c) => used.has(c.key)));
departments.forEach((d) => { d.cats = d.cats.filter((c) => used.has(c)); });
departments.splice(0, departments.length, ...departments.filter((d) => d.cats.length));
export const byId = (id) => items.find((i) => i.id === id);
export const phoneList = phoneItems;
export const brandCount = new Set(items.map((i) => i.b).filter(Boolean)).size;

// Full display name ("Apple AirPods Pro 3", but not "Apple Apple Pencil")
export const full = (p) => (p.b && !p.n.toLowerCase().startsWith(p.b.toLowerCase()) && p.k !== "phone" ? `${p.b} ${p.n}` : p.n);

export const pick = (ids) => ids.map(byId).filter(Boolean);
