import Site from "../../../Site";
import Shop from "../../../Shop";
import { shopMeta } from "../../../meta";
import Pay from "../../../Pay";

export const metadata = shopMeta("ar");

export default function Page() {
  return <Site lang="ar" page="shop" alt="/shop"><Shop lang="ar" /><Pay lang="ar" variant="strip" /></Site>;
}
