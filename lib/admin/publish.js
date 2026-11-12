// Saves the edited catalogue (and any new photos) to GitHub as ONE commit. Vercel then redeploys the site.
const { json, authed, configured, ENV, gh, fromAdmin, readBody, seal, device } = require('./_lib');
const okPath = p => /^products\/[a-z0-9][a-z0-9-]{0,120}\.(webp|jpg|jpeg|png)$/.test(p);
const okImg = p => /^(products|phones)\/[a-z0-9][a-z0-9-]{0,120}\.(webp|jpg|jpeg|png)$/.test(p);
function validate(c) {
  if (!c || !Array.isArray(c.departments) || !Array.isArray(c.categories) || !Array.isArray(c.products)) return 'Catalogue format is invalid.';
  if (c.products.length > 5000) return 'Too many products.';
  const cids = new Set();
  for (const k of c.categories) {
    if (!k || typeof k.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(k.id) || cids.has(k.id) || typeof k.en !== 'string' || !k.en.trim()) return 'A category is invalid.';
    cids.add(k.id);
  }
  for (const d of c.departments) if (!d || typeof d.id !== 'string' || typeof d.en !== 'string' || !Array.isArray(d.cats) || d.cats.some(x => !Number.isInteger(x) || x < 0 || x >= c.categories.length)) return 'A department is invalid.';
  const ids = new Set();
  for (const p of c.products) {
    if (!p || typeof p.id !== 'string' || !/^[a-z0-9-]{1,140}$/.test(p.id)) return 'A product has an invalid id.';
    if (ids.has(p.id)) return `Duplicate product id: ${p.id}`; ids.add(p.id);
    if (typeof p.n !== 'string' || !p.n.trim()) return `Product ${p.id} has no name.`;
    if (!Number.isInteger(p.c) || p.c < 0 || p.c >= c.categories.length) return `Product ${p.id} has an invalid category.`;
    for (const k of ['b', 'd', 'da', 'i', 'x']) if (p[k] != null && typeof p[k] !== 'string') return `Product ${p.id} has an invalid ${k}.`;
    if (p.i && !okImg(p.i)) return `Product ${p.id} has an invalid photo path.`;
    if (p.st != null && !['out', 'soon'].includes(p.st)) return `Product ${p.id} has an invalid stock status.`;
    if (p.pr != null && !(typeof p.pr === 'number' && isFinite(p.pr) && p.pr > 0 && p.pr < 10000000)) return `Product ${p.id} has an invalid price.`;
  }
  return null;
}
// Human-readable summary of what changed, stored in the commit message for the admin History view.
const ST = { '': 'In stock', out: 'Out of stock', soon: 'Coming soon' };
const money = v => v ? 'AED ' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'no price';
const label = p => { const b = (p.b || '').trim(), n = (p.n || '').trim(); return (b && !n.toLowerCase().startsWith(b.toLowerCase()) ? b + ' ' : '') + n };
const clip = (s, n = 60) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s };
function describe(oldC, newC) {
  const out = [], om = new Map((oldC.products || []).map(p => [p.id, p])), nm = new Map(newC.products.map(p => [p.id, p]));
  const cat = (c, i) => (c.categories[i] || {}).en || '?';
  for (const p of newC.products) {
    const o = om.get(p.id);
    if (!o) { out.push(`Added: ${clip(label(p))}${p.pr ? ' (' + money(p.pr) + ')' : ''}`); continue }
    const ch = [];
    if ((o.n || '') !== (p.n || '')) ch.push(`name “${clip(o.n, 40)}” → “${clip(p.n, 40)}”`);
    if ((o.b || '') !== (p.b || '')) ch.push(`brand ${o.b || '—'} → ${p.b || '—'}`);
    if ((o.d || '') !== (p.d || '') || (o.da || '') !== (p.da || '')) ch.push('details updated');
    if ((o.pr || 0) !== (p.pr || 0)) ch.push(!o.pr ? `price set to ${money(p.pr)}` : !p.pr ? `price removed (was ${money(o.pr)})` : `price ${money(o.pr)} → ${money(p.pr)}`);
    if ((o.st || '') !== (p.st || '')) ch.push(`${ST[o.st || '']} → ${ST[p.st || '']}`);
    if (!!o.h !== !!p.h) ch.push(p.h ? 'hidden from website' : 'shown on website');
    if ((o.i || '') !== (p.i || '')) ch.push(p.i ? (o.i ? 'photo changed' : 'photo added') : 'photo removed');
    if (o.c !== p.c) ch.push(`category ${cat(oldC, o.c)} → ${cat(newC, p.c)}`);
    if (ch.length) out.push(`Edited ${clip(label(p))}: ${ch.join('; ')}`);
  }
  for (const o of oldC.products || []) if (!nm.has(o.id)) out.push(`Deleted: ${clip(label(o))}`);
  if (JSON.stringify(oldC.categories) !== JSON.stringify(newC.categories) || JSON.stringify(oldC.departments) !== JSON.stringify(newC.departments)) out.push('Departments / categories updated');
  return out;
}
function withClient(d, c) {
  const t = v => String(v || '').replace(/[^\w .,()+\/-]/g, '').trim().slice(0, 60);
  if (c && typeof c === 'object') { const m = t(c.model); if (m && /^Android/.test(d.device) && !d.device.includes('·')) d.device += ' · ' + m; if (m && !/^Android|iPhone|iPad/.test(d.device)) d.device += ' · ' + m }
  return d;
}
async function readCatalog(R, f) {
  let text = f.content && f.encoding === 'base64' ? Buffer.from(f.content, 'base64').toString('utf8') : '';
  if (!text) { const bl = await gh(`${R}/git/blobs/${f.sha}`); text = Buffer.from(bl.content, 'base64').toString('utf8') }
  return JSON.parse(text);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const who = authed(req);
  if (!fromAdmin(req) || !who) return json(res, 401, { error: 'Please log in again.' });
  if (!configured().github) return json(res, 503, { error: 'GitHub key (GITHUB_TOKEN) is not set up yet.' });
  let b; try { b = await readBody(req) } catch (_) { return json(res, 400, { error: 'Bad request' }) }
  const bad = validate(b.catalog); if (bad) return json(res, 400, { error: bad });
  const imgs = Array.isArray(b.images) ? b.images : [];
  if (imgs.length > 40) return json(res, 400, { error: 'Too many photos in one save. Publish in smaller batches.' });
  for (const im of imgs) if (!okPath(im.path) || typeof im.b64 !== 'string' || im.b64.length > 3_000_000) return json(res, 400, { error: 'A photo is invalid or too large.' });
  const e = ENV(), R = `/repos/${e.repo}`;
  try {
    const cur = await gh(`${R}/contents/catalog.json?ref=${encodeURIComponent(e.branch)}`);
    if (b.sha && cur.sha !== b.sha) return json(res, 409, { error: 'The catalogue was changed somewhere else since you opened it. Reload to get the latest, then redo your edit.' });
    const ref = await gh(`${R}/git/ref/heads/${encodeURIComponent(e.branch)}`);
    const head = ref.object.sha, commit = await gh(`${R}/git/commits/${head}`);
    const cat = { ...b.catalog, v: Date.now() };
    const files = [{ path: 'catalog.json', content: Buffer.from(JSON.stringify(cat)).toString('base64') }, ...imgs.map(i => ({ path: 'public/' + i.path, content: i.b64 }))];
    const tree = [];
    for (const f of files) {
      const bl = await gh(`${R}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: f.content, encoding: 'base64' }) });
      tree.push({ path: f.path, mode: '100644', type: 'blob', sha: bl.sha });
    }
    const t = await gh(`${R}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree }) });
    let lines = []; try { lines = describe(await readCatalog(R, cur), b.catalog) } catch (_) { }
    if (lines.length > 80) lines = lines.slice(0, 80).concat(`…and ${lines.length - 80} more changes`);
    const msg = String(b.message || 'Update products').slice(0, 200) + `\n\nBy: ${who}\nDevice: ${Buffer.from(seal(withClient(device(req), b.client), 'kenz-device')).toString('base64')}\n` + lines.map(l => '• ' + l).join('\n') + '\n\nSaved from the KENZ admin dashboard.';
    const nc = await gh(`${R}/git/commits`, { method: 'POST', body: JSON.stringify({ message: msg, tree: t.sha, parents: [head] }) });
    await gh(`${R}/git/refs/heads/${encodeURIComponent(e.branch)}`, { method: 'PATCH', body: JSON.stringify({ sha: nc.sha }) });
    const after = await gh(`${R}/contents/catalog.json?ref=${nc.sha}`);
    json(res, 200, { ok: true, commit: nc.sha, sha: after.sha, v: cat.v });
  } catch (err) { json(res, 500, { error: 'Could not publish: ' + err.message }) }
};
