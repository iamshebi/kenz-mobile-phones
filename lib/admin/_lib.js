// Shared helpers for the admin API. Secrets come only from Vercel environment variables.
const crypto = require('crypto');

const cleanEmails = v => (v || '').toLowerCase().replace(/admin_email(_\d)?\s*=/g, ' ').split(/[\s,;"'<>]+/).filter(x => x.includes('@'));
const cleanPass = v => (v || '').trim().replace(/^admin_password(_\d)?\s*=\s*/i, '').replace(/^(["'])(.*)\1$/, '$2');
const ENV = () => ({
  email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  // Logins: ADMIN_EMAIL + ADMIN_PASSWORD, plus optional ADMIN_EMAIL_2 + ADMIN_PASSWORD_2 ... up to _5.
  // Each ADMIN_EMAIL* may list several emails (comma-separated) that share that password.
  users: [''].concat([2, 3, 4, 5].map(n => '_' + n)).map(sfx => ({
    emails: cleanEmails(process.env['ADMIN_EMAIL' + sfx]),
    pass: cleanPass(process.env['ADMIN_PASSWORD' + sfx])
  })).filter(u => u.emails.length && u.pass),
  secret: process.env.SESSION_SECRET || '',
  token: process.env.GITHUB_TOKEN || '',
  repo: process.env.GITHUB_REPO || 'iamshebi/kenz-mobile-phones',
  branch: process.env.GITHUB_BRANCH || 'main',
  api: process.env.GITHUB_API || 'https://api.github.com'
});
const COOKIE = 'kenz_admin';
const MAX_AGE = 60 * 60 * 12; // 12 hours

const h = s => crypto.createHash('sha256').update(String(s)).digest();
const same = (a, b) => crypto.timingSafeEqual(h(a), h(b));
const sign = (v, secret) => crypto.createHmac('sha256', secret).update(v).digest('base64url');

function json(res, code, body) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
function configured() {
  const e = ENV();
  return { login: !!(e.users.length && e.secret.length >= 16), github: !!e.token };
}
// Session cookie: <expiry>.<email, base64url>.<signature>
function makeSession(email = '') {
  const e = ENV(), exp = Math.floor(Date.now() / 1000) + MAX_AGE, who = Buffer.from(String(email)).toString('base64url');
  return `${exp}.${who}.${sign(exp + '|' + who + '|' + e.email, e.secret)}`;
}
function readCookie(req) {
  const m = (req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(COOKIE + '='));
  return m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : '';
}
// Returns the logged-in email (truthy) or false.
function authed(req) {
  const e = ENV(); if (!configured().login) return false;
  const [exp, who, mac] = readCookie(req).split('.');
  if (!exp || who == null || !mac || +exp < Date.now() / 1000) return false;
  try {
    if (!same(mac, sign(exp + '|' + who + '|' + e.email, e.secret))) return false;
    const email = Buffer.from(who, 'base64url').toString('utf8');
    // the login must still exist (removing ADMIN_EMAIL_n signs that person out)
    return e.users.some(u => u.emails.includes(email)) ? email : false;
  } catch (_) { return false }
}
function setCookie(res, val, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(val)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}
// Basic CSRF guard: admin calls must come from our own page with this header.
function fromAdmin(req) { return req.headers['x-zm-admin'] === '1' }

async function gh(path, opts = {}) {
  const e = ENV();
  const r = await fetch(e.api + path, {
    ...opts,
    headers: { Authorization: `Bearer ${e.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'kenz-admin', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) }
  });
  const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null } catch (_) { }
  if (!r.ok) { const err = new Error((j && j.message) || `GitHub ${r.status}`); err.status = r.status; throw err }
  return j;
}
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = []; for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
// Encrypt small private data (AES-256-GCM) with a key derived from SESSION_SECRET.
const ekey = scope => crypto.createHash('sha256').update(scope + '|' + ENV().secret).digest();
function seal(obj, scope = 'kenz-notes') {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', ekey(scope), iv);
  const data = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64') });
}
function unseal(text, scope = 'kenz-notes') {
  const o = JSON.parse(text), d = crypto.createDecipheriv('aes-256-gcm', ekey(scope), Buffer.from(o.iv, 'base64'));
  d.setAuthTag(Buffer.from(o.tag, 'base64'));
  return JSON.parse(Buffer.concat([d.update(Buffer.from(o.data, 'base64')), d.final()]).toString('utf8'));
}
// Device details of the person making a change (for the admin History view).
function device(req) {
  const H = k => String(req.headers[k] || ''), ua = H('user-agent');
  const ip = (H('x-forwarded-for').split(',')[0] || H('x-real-ip')).trim();
  const dec = v => { try { return decodeURIComponent(v) } catch (_) { return v } };
  const am = (ua.match(/Android [\d.]+;\s*([^;)]+?)(?:\s+Build[^;)]*)?\)/) || [])[1], model = am && am.trim() !== 'K' ? am.trim() : '';
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' + (model ? ' · ' + model : '')
    : /Windows/.test(ua) ? 'Windows PC' : /Macintosh|Mac OS X/.test(ua) ? 'Mac' : /CrOS/.test(ua) ? 'Chromebook' : /Linux/.test(ua) ? 'Linux' : 'Unknown device';
  const br = /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /EdgA?\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Browser';
  const place = [dec(H('x-vercel-ip-city')), H('x-vercel-ip-country')].filter(Boolean).join(', ');
  return { device: os, browser: br, ip, place, ua: ua.slice(0, 300) };
}
module.exports = { seal, unseal, device, ENV, json, configured, makeSession, authed, setCookie, same, fromAdmin, gh, readBody, MAX_AGE };
