import Site from "../../Site";
import Shop from "../../Shop";
import { shopMeta } from "../../meta";
import Pay from "../../Pay";

export const metadata = shopMeta("en");

export default function Page() {
  return <Site lang="en" page="shop" alt="/ar/shop"><Shop lang="en" /><Pay lang="en" variant="strip" /></Site>;
}
