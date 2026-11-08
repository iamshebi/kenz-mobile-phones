import AccessoriesPage from "../../../AccessoriesPage";
import { content } from "../../../content";
import { shopContent } from "../../../shopContent";

const s = shopContent.ar.shop;
export const metadata = {
  title: s.metaTitle,
  description: s.metaDesc,
  alternates: { canonical: "/ar/accessories", languages: { en: "/accessories", ar: "/ar/accessories" } },
  openGraph: { title: s.metaTitle, description: s.metaDesc, images: ["/logo.jpg"], locale: "ar_AE" },
};

export default function Page() {
  return <AccessoriesPage t={content.ar} />;
}
