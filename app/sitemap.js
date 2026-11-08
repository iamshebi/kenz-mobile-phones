import { site } from "./content";

export default function sitemap() {
  const base = site.url;
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1, alternates: { languages: { ar: `${base}/ar` } } },
    { url: `${base}/ar`, lastModified: now, changeFrequency: "weekly", priority: 0.9, alternates: { languages: { en: `${base}/` } } },
    { url: `${base}/accessories`, lastModified: now, changeFrequency: "weekly", priority: 0.9, alternates: { languages: { ar: `${base}/ar/accessories` } } },
    { url: `${base}/ar/accessories`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: { languages: { en: `${base}/accessories` } } },
  ];
}
