import Product, { productMeta } from "../../../../Product";
import { items } from "../../../../catalog";

export const dynamicParams = false;
export const generateStaticParams = () => items.map((p) => ({ id: p.id }));
export const generateMetadata = ({ params }) => productMeta(params.id, "ar");

export default function Page({ params }) {
  return <Product id={params.id} lang="ar" />;
}
