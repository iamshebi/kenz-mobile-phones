// Which catalogue version this deployment was built from (the admin polls this after Publish).
import { version } from "../../catalog";

export const dynamic = "force-static";
export function GET() {
  return Response.json({ v: version }, { headers: { "Cache-Control": "public, max-age=0, must-revalidate", "X-Robots-Tag": "noindex" } });
}
