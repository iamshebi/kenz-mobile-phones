const { ENV, json, configured, makeSession, setCookie, same, fromAdmin, readBody, MAX_AGE } = require('./_lib');
const fails = new Map(); // per-instance throttle
module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!fromAdmin(req)) return json(res, 403, { error: 'Forbidden' });
  if (!configured().login) return json(res, 503, { error: 'Admin login is not set up yet. Add ADMIN_EMAIL, ADMIN_PASSWORD and SESSION_SECRET in Vercel.' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
  const f = fails.get(ip) || { n: 0, t: 0 };
  if (f.n >= 8 && Date.now() - f.t < 15 * 60 * 1000) return json(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
  let b; try { b = await readBody(req) } catch (_) { return json(res, 400, { error: 'Bad request' }) }
  const e = ENV(), inE = String(b.email || '').trim().toLowerCase(), inP = String(b.password || '').trim();
  // check every login so timing doesn't reveal which emails exist
  const ok = e.users.map(u => u.emails.map(x => same(inE, x)).includes(true) & same(inP, u.pass)).includes(1);
  const who = ok ? e.users.flatMap(u => u.emails).find(x => x === inE) : '';
  if (!ok) {
    fails.set(ip, { n: f.n + 1, t: Date.now() });
    await new Promise(r => setTimeout(r, 700));
    return json(res, 401, { error: 'Wrong email or password.' });
  }
  fails.delete(ip);
  setCookie(res, makeSession(who), MAX_AGE);
  json(res, 200, { ok: true });
};
