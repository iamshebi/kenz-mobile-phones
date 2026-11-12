// Lists changes published from the admin dashboard (read from the GitHub commit history).
const { json, authed, configured, ENV, gh, unseal } = require('./_lib');
const MARK = 'Saved from the KENZ admin dashboard.';
module.exports = async (req, res) => {
  if (!authed(req)) return json(res, 401, { error: 'Please log in.' });
  if (!configured().github) return json(res, 503, { error: 'GitHub key (GITHUB_TOKEN) is not set up yet.' });
  const page = Math.max(1, Math.min(50, parseInt((req.query && req.query.page) || new URL(req.url, 'http://x').searchParams.get('page') || '1', 10) || 1));
  try {
    const e = ENV(), per = 100;
    const list = await gh(`/repos/${e.repo}/commits?sha=${encodeURIComponent(e.branch)}&per_page=${per}&page=${page}`);
    const items = list.filter(c => (c.commit.message || '').includes(MARK)).map(c => {
      const m = c.commit.message.replace(MARK, '').trim().split('\n');
      const by = (m.find(l => l.startsWith('By: ')) || '').slice(4).trim();
      let dev = null; const dl = m.find(l => l.startsWith('Device: '));
      if (dl) { try { dev = unseal(Buffer.from(dl.slice(8).trim(), 'base64').toString('utf8'), 'kenz-device'); delete dev.ua } catch (_) { dev = { locked: true } } }
      return { dev, id: c.sha.slice(0, 7), at: c.commit.committer.date || c.commit.author.date, title: m[0], by, lines: m.filter(l => l.startsWith('• ')).map(l => l.slice(2)) };
    });
    json(res, 200, { items, more: list.length === per, page });
  } catch (err) { json(res, 500, { error: 'Could not load the history: ' + err.message }) }
};
