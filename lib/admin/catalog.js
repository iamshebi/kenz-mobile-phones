// Returns the latest catalog.json straight from GitHub (newer than the deployed copy right after a save).
const { json, authed, configured, ENV, gh } = require('./_lib');
module.exports = async (req, res) => {
  if (!authed(req)) return json(res, 401, { error: 'Please log in.' });
  if (!configured().github) return json(res, 503, { error: 'GitHub key (GITHUB_TOKEN) is not set up yet.' });
  try {
    const e = ENV();
    const f = await gh(`/repos/${e.repo}/contents/catalog.json?ref=${encodeURIComponent(e.branch)}`);
    let text;
    if (f.content && f.encoding === 'base64') text = Buffer.from(f.content, 'base64').toString('utf8');
    else { const b = await gh(`/repos/${e.repo}/git/blobs/${f.sha}`); text = Buffer.from(b.content, 'base64').toString('utf8') }
    json(res, 200, { sha: f.sha, catalog: JSON.parse(text) });
  } catch (err) { json(res, err.status === 401 ? 502 : 500, { error: 'Could not read the catalogue: ' + err.message }) }
};
