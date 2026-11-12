import { site } from "./content";

export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }], sitemap: `${site.url}/sitemap.xml` };
}
