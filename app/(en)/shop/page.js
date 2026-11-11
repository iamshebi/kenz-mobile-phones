import Site from "../../Site";
import Shop from "../../Shop";
import { shopMeta } from "../../meta";

export const metadata = shopMeta("en");

export default function Page() {
  return <Site lang="en" page="shop" alt="/ar/shop"><Shop lang="en" /></Site>;
}
