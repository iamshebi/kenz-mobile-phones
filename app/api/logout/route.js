import handler from "../../../lib/admin/logout";
import route from "../../../lib/admin/adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const run = route(handler);
export const GET = run;
export const POST = run;
