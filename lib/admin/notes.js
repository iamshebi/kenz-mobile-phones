// Private admin notes. Stored encrypted (AES-256-GCM, key from SESSION_SECRET) in data/admin-notes.enc
// in the GitHub repo, so every admin sees the same notes on any device. Saving a note does not redeploy
// the website (see ignoreCommand in vercel.json) and the file is never served (.vercelignore).
const crypto = require('crypto');
const { json, authed, configured, ENV, gh, fromAdmin, readBody, seal, unseal } = require('./_lib');
const PATH = 'data/admin-notes.enc';
const open = t => unseal(t);
async function read() {
  const e = ENV();
  try {
    const f = await gh(`/repos/${e.repo}/contents/${PATH}?ref=${encodeURIComponent(e.branch)}`);
    const text = Buffer.from(f.content || '', 'base64').toString('utf8');
    try { return { sha: f.sha, notes: open(text), locked: false } } catch (_) { return { sha: f.sha, notes: [], locked: true } }
  } catch (err) { if (err.status === 404) return { sha: null, notes: [], locked: false }; throw err }
}
async function write(notes, sha, who) {
  const e = ENV();
  return gh(`/repos/${e.repo}/contents/${PATH}`, { method: 'PUT', body: JSON.stringify({
    message: `Update admin notes (${who || 'admin'})`, branch: e.branch, content: Buffer.from(seal(notes)).toString('base64'), ...(sha ? { sha } : {})
  }) });
}
const clean = t => String(t || '').replace(/\r\n/g, '\n').trim().slice(0, 5000);

module.exports = async (req, res) => {
  const who = authed(req);
  if (!who) return json(res, 401, { error: 'Please log in.' });
  if (!configured().github) return json(res, 503, { error: 'GitHub key (GITHUB_TOKEN) is not set up yet.' });
  try {
    if (req.method === 'GET') { const r = await read(); return json(res, 200, { notes: r.notes, locked: r.locked }) }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
    if (!fromAdmin(req)) return json(res, 403, { error: 'Forbidden' });
    const b = await readBody(req);
    // apply the change to the latest saved notes; retry once if someone else saved at the same moment
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await read(), notes = r.notes, now = Date.now(), i = notes.findIndex(n => n.id === b.id);
      if (b.op === 'add') { const t = clean(b.t); if (!t) return json(res, 400, { error: 'The note is empty.' }); if (notes.length >= 500) return json(res, 400, { error: 'Too many notes. Delete some old ones first.' }); notes.push({ id: crypto.randomBytes(6).toString('hex'), t, at: now, by: who, pin: false }) }
      else if (i < 0) return json(res, 404, { error: 'That note no longer exists. Refresh the notes.' });
      else if (b.op === 'edit') { const t = clean(b.t); if (!t) return json(res, 400, { error: 'The note is empty.' }); Object.assign(notes[i], { t, ed: now, eb: who }) }
      else if (b.op === 'pin') notes[i].pin = !!b.pin;
      else if (b.op === 'del') notes.splice(i, 1);
      else return json(res, 400, { error: 'Unknown action.' });
      try { await write(notes, r.sha, who); return json(res, 200, { notes }) }
      catch (err) { if (err.status !== 409 && err.status !== 422) throw err }
    }
    json(res, 409, { error: 'Someone else is saving notes right now. Try again.' });
  } catch (err) { json(res, 500, { error: 'Could not reach the notes: ' + err.message }) }
};
