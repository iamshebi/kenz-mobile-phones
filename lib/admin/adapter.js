// Runs the Vercel-style (req, res) admin handlers inside Next.js route handlers.
module.exports = function route(handler) {
  return async function (request) {
    const url = new URL(request.url);
    const headers = {};
    request.headers.forEach((v, k) => { headers[k] = v });
    const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
    const req = { method: request.method, headers, url: url.pathname + url.search, query: Object.fromEntries(url.searchParams), body };
    return new Promise(resolve => {
      const h = new Headers(); let code = 200, done = false;
      const res = {
        get statusCode() { return code }, set statusCode(v) { code = v },
        setHeader(k, v) { h.set(k, v) },
        end(b) { if (done) return; done = true; resolve(new Response(b == null ? null : b, { status: code, headers: h })) }
      };
      Promise.resolve().then(() => handler(req, res)).catch(err => {
        console.error(err);
        if (!done) { done = true; resolve(Response.json({ error: 'Server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })) }
      });
    });
  };
};
