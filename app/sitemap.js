import { site } from "./content";
import { items } from "./catalog";

export default function sitemap() {
  const b = site.url, now = new Date();
  const pair = (en, ar, priority) => [
    { url: `${b}${en}`, lastModified: now, changeFrequency: "weekly", priority, alternates: { languages: { ar: `${b}${ar}` } } },
    { url: `${b}${ar}`, lastModified: now, changeFrequency: "weekly", priority: priority - 0.1, alternates: { languages: { en: `${b}${en}` } } },
  ];
  return [
    ...pair("/", "/ar", 1),
    ...pair("/shop", "/ar/shop", 0.9),
    ...items.flatMap((p) => pair(`/product/${p.id}`, `/ar/product/${p.id}`, 0.7)),
  ];
}
