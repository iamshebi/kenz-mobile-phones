import Site from "../../../Site";
import Shop from "../../../Shop";
import { shopMeta } from "../../../meta";

export const metadata = shopMeta("ar");

export default function Page() {
  return <Site lang="ar" page="shop" alt="/shop"><Shop lang="ar" /></Site>;
}
