/* KENZ Mobile Phones — admin dashboard. Edits catalog.json via /api (GitHub commit → Vercel rebuilds the site). */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'item';
const IC = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  cam: '<rect x="2.5" y="6.5" width="19" height="13" rx="2.5"/><path d="M8 6.5 9.5 4h5L16 6.5"/><circle cx="12" cy="13" r="3.8"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', eyeoff: '<path d="M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  down: '<path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>', up: '<path d="M12 20V8M6 14l6-6 6 6M4 4h16"/>', tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.3"/>',
  out: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10"/>', img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5L5 20"/>',
  check: '<path d="M5 12.5 10 17l9-10"/>', note: '<path d="M6 3.5h9l4 4V20a.5.5 0 0 1-.5.5h-12A.5.5 0 0 1 6 20z"/><path d="M14.5 3.5V8h4.5M9 12h7M9 15.5h5"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>', pc: '<rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M8.5 20h7M12 16.5V20"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M9 4h6l-1 5 3 3v1.5H7V12l3-3z"/><path d="M12 13.5V20"/>', pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>', moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', back: '<path d="M15 6l-6 6 6 6"/>', box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'
};
const ico = (k, sw = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const ST = { '': 'In stock', out: 'Out of stock', soon: 'Coming soon' };
const PG = 60;

let CAT = null, SHA = '', BASE = '', IMGS = {}, PREV = {}, Q = '', F = { d: '', c: -1, s: 'all' }, N = PG, EDIT = null, BUSY = false;

/* ---------- api ---------- */
async function api(path, body) {
  const r = await fetch('/api/' + path, { method: body ? 'POST' : 'GET', credentials: 'same-origin', headers: { 'X-ZM-Admin': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let j = {}; try { j = await r.json() } catch (_) { }
  if (!r.ok) { const e = new Error(j.error || ('Error ' + r.status)); e.status = r.status; throw e }
  return j;
}
function toast(msg, kind = '', ms = 3200) {
  const t = $('#toast'); t.className = 'toast on ' + kind; t.innerHTML = msg;
  clearTimeout(toast.t); if (ms) toast.t = setTimeout(() => t.className = 'toast', ms);
}

/* ---------- state helpers ---------- */
const prods = () => CAT.products;
const byId = id => prods().find(p => p.id === id);
const dept = c => CAT.departments.find(d => d.cats.includes(c));
const catName = c => CAT.categories[c] ? CAT.categories[c].en : '—';
const changed = () => JSON.stringify(CAT) !== BASE || Object.keys(IMGS).length > 0;
function diffCount() {
  if (!CAT) return 0;
  const b = JSON.parse(BASE), bm = baseMap(), cm = new Map(prods().map(p => [p.id, JSON.stringify(p)]));
  let n = 0; for (const [id, s] of cm) if (bm.get(id) !== s) n++;
  for (const id of bm.keys()) if (!cm.has(id)) n++;
  if (JSON.stringify(b.categories) !== JSON.stringify(CAT.categories) || JSON.stringify(b.departments) !== JSON.stringify(CAT.departments)) n++;
  return n;
}
let BM = { k: '', m: null };
function baseMap() { if (BM.k !== BASE) BM = { k: BASE, m: new Map(JSON.parse(BASE).products.map(x => [x.id, JSON.stringify(x)])) }; return BM.m }
function isChanged(p) { const b = baseMap().get(p.id); return !b || b !== JSON.stringify(p) }
function saveDraft() { try { if (changed()) localStorage.setItem('kenz-admin-draft', JSON.stringify({ sha: SHA, cat: CAT, imgs: IMGS, at: Date.now() })); else localStorage.removeItem('kenz-admin-draft') } catch (_) { toast('Draft too large to keep offline. Publish soon so photos are not lost.', 'warn') } }
const imgSrc = p => !p.i ? '' : (IMGS[p.i] ? 'data:' + mime(p.i) + ';base64,' + IMGS[p.i] : PREV[p.i] || '/' + p.i);
const mime = f => /\.webp$/.test(f) ? 'image/webp' : /\.png$/.test(f) ? 'image/png' : 'image/jpeg';
function uid(base) { let id = slug(base), k = id, i = 2; while (byId(k)) k = id + '-' + i++; return k }

/* ---------- boot / login ---------- */
async function boot() {
  let me; try { me = await api('me') } catch (e) { return fatal('Cannot reach the server. Check your connection and refresh.') }
  if (!me.authed) return loginView(me.setup);
  load();
}
function fatal(msg) { $('#root').innerHTML = `<div class="center"><div class="card narrow"><h2>Something went wrong</h2><p class="mut">${esc(msg)}</p><button class="b dk" onclick="location.reload()">Refresh</button></div></div>` }
function loginView(setup) {
  const ready = setup && setup.login;
  $('#root').innerHTML = `<div class="center login"><form class="card narrow" id="lf" autocomplete="on">
    <div class="brand"><img src="/logo-mark.png" alt=""><span><b>KENZ</b><small>ADMIN</small></span></div>
    <h1>Welcome back</h1><p class="mut">Log in to manage the products on your website.</p>
    ${ready ? '' : '<div class="note warn">Login is not set up yet. The developer needs to add the admin email and password in Vercel.</div>'}
    <label>Email<input name="email" type="email" autocomplete="username" required ${ready ? '' : 'disabled'}></label>
    <label>Password<span class="pw"><input name="password" type="password" autocomplete="current-password" required ${ready ? '' : 'disabled'}><button type="button" class="pwt" aria-label="Show password">${ico('eye')}</button></span></label>
    <p class="err" id="lerr"></p>
    <button class="b dk full" ${ready ? '' : 'disabled'}>Log in</button>
    <p class="mut sm">Forgot your password? Ask your developer to reset it.</p>
  </form></div>`;
  $('.pwt').onclick = () => { const i = $('[name=password]'); i.type = i.type === 'password' ? 'text' : 'password' };
  $('#lf').onsubmit = async e => {
    e.preventDefault(); const f = new FormData(e.target), btn = e.target.querySelector('.b'); btn.disabled = true; btn.textContent = 'Checking…'; $('#lerr').textContent = '';
    try { await api('login', { email: f.get('email'), password: f.get('password') }); load() }
    catch (err) { $('#lerr').textContent = err.message; btn.disabled = false; btn.textContent = 'Log in' }
  };
}
async function load() {
  $('#root').innerHTML = `<div class="center"><div class="spin"></div><p class="mut">Loading your products…</p></div>`;
  let r; try { r = await api('catalog') } catch (e) { if (e.status === 401) return loginView({ login: true }); return fatal(e.message) }
  CAT = r.catalog; SHA = r.sha; BASE = JSON.stringify(CAT); IMGS = {};
  try {
    const d = JSON.parse(localStorage.getItem('kenz-admin-draft') || 'null');
    if (d && d.sha === SHA && JSON.stringify(d.cat) !== BASE) { if (confirm('You have unpublished changes from last time. Restore them?')) { CAT = d.cat; IMGS = d.imgs || {} } else localStorage.removeItem('kenz-admin-draft') }
    else if (d) localStorage.removeItem('kenz-admin-draft');
  } catch (_) { }
  shell();
}

/* ---------- layout ---------- */
function shell() {
  $('#root').innerHTML = `
  <header class="top"><div class="tw">
    <a class="brand" href="/admin"><img src="/logo-mark.png" alt=""><span><b>KENZ</b><small>ADMIN</small></span></a>
    <label class="srch">${ico('search')}<input id="q" type="search" placeholder="Search name, brand, details…" autocomplete="off" enterkeyhint="search"></label>
    <div class="tr"><button class="ib" id="hb" aria-label="History" title="History">${ico('clock')}</button><button class="ib" id="nb" aria-label="Notes" title="Notes">${ico('note')}</button><button class="b gd" id="add">${ico('plus', 2)}<span>Add item</span></button>
      <div class="mn"><button class="ib" id="mb" aria-label="Menu">${ico('menu')}</button><div class="md" id="md">
        <button data-a="notes">${ico('note')}Notes</button><button data-a="hist">${ico('clock')}History</button><button data-a="cats">${ico('tag')}Categories</button><button data-a="exp">${ico('down')}Export CSV</button><button data-a="imp">${ico('up')}Import CSV</button>
        <a href="/" target="_blank" rel="noopener">${ico('ext')}View website</a><button data-a="out">${ico('out')}Log out</button></div></div></div>
  </div></header>
  <main class="tw main">
    <section class="stats" id="stats"></section>
    <section class="fil"><select id="fd" aria-label="Department"></select><select id="fc" aria-label="Category"></select><div class="chips" id="fs"></div></section>
    <div class="res" id="res"></div>
    <section class="list" id="list"></section>
    <div class="more"><button class="b lt" id="mo" hidden>Show more</button></div>
  </main>
  <div class="pub" id="pub"><div class="tw"><span id="pubt"></span><div><button class="b lt sm" id="disc">Discard</button><button class="b dk sm" id="pubb">${ico('check', 2)}Publish to website</button></div></div></div>
  <div class="sheet" id="sheet" aria-hidden="true"><div class="sbg" data-close></div><div class="sp" id="sp" role="dialog" aria-modal="true"></div></div>
  <input type="file" id="csvf" accept=".csv,text/csv" hidden>`;
  $('#q').oninput = e => { Q = e.target.value; N = PG; draw() };
  $('#add').onclick = () => openEdit(null);
  $('#nb').onclick = notesView;
  $('#hb').onclick = historyView;
  $('#mb').onclick = e => { e.stopPropagation(); $('#md').classList.toggle('on') };
  document.addEventListener('click', () => $('#md') && $('#md').classList.remove('on'));
  $('#md').onclick = e => { const a = e.target.closest('[data-a]'); if (!a) return; ({ notes: notesView, hist: historyView, cats: catsView, exp: exportCSV, imp: () => $('#csvf').click(), out: logout })[a.dataset.a]() };
  $('#csvf').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) importCSV(f) };
  $('#fd').onchange = e => { F.d = e.target.value; F.c = -1; N = PG; draw() };
  $('#fc').onchange = e => { F.c = +e.target.value; N = PG; draw() };
  $('#fs').onclick = e => { const b = e.target.closest('[data-s]'); if (!b) return; F.s = b.dataset.s; N = PG; draw() };
  $('#mo').onclick = () => { N += PG; draw() };
  $('#list').onclick = e => {
    const tg = e.target.closest('[data-tg]'); if (tg) { e.stopPropagation(); const p = byId(tg.dataset.tg); if (p.h) delete p.h; else p.h = 1; touch(); return }
    if (e.target.closest('select,input,label.pq')) return;
    const r = e.target.closest('[data-id]'); if (r) openEdit(r.dataset.id);
  };
  $('#list').onchange = e => {
    const pi = e.target.closest('[data-pr]'); if (pi) { const p = byId(pi.dataset.pr), v = parseFloat(pi.value.replace(/[^0-9.]/g, '')); if (v > 0) p.pr = Math.round(v * 100) / 100; else delete p.pr; saveDraft(); updBar(); pi.closest('.it').querySelector('small').innerHTML = esc(p.b || 'No brand') + (isChanged(p) ? '<i class="dot" title="Changed"></i>' : ''); return }
    const s = e.target.closest('[data-st]'); if (!s) return; const p = byId(s.dataset.st); if (s.value) p.st = s.value; else delete p.st; touch() };
  $('#list').onkeydown = e => { if (e.key === 'Enter' && e.target.matches('[data-pr]')) e.target.blur() };
  $('#disc').onclick = () => { if (confirm('Discard all unpublished changes?')) { CAT = JSON.parse(BASE); IMGS = {}; saveDraft(); draw() } };
  $('#pubb').onclick = publish;
  $('#sheet').onclick = e => { if (e.target.closest('[data-close]')) closeSheet() };
  addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet() });
  addEventListener('beforeunload', e => { if (changed()) { e.preventDefault(); e.returnValue = '' } });
  draw();
}
function touch() { saveDraft(); draw() }
function updBar() { const ch = diffCount(); $('#pub').classList.toggle('on', ch > 0); $('#pubt').innerHTML = `<b>${ch}</b> change${ch === 1 ? '' : 's'} not published yet` }

/* ---------- list ---------- */
function filtered() {
  const ws = Q.toLowerCase().split(/\s+/).filter(Boolean), d = CAT.departments.find(x => x.id === F.d);
  return prods().filter(p => (!d || d.cats.includes(p.c)) && (F.c < 0 || p.c === F.c) &&
    (F.s === 'all' || (F.s === 'live' && !p.h) || (F.s === 'hidden' && p.h) || (F.s === 'out' && p.st === 'out') || (F.s === 'soon' && p.st === 'soon') || (F.s === 'nophoto' && !p.i) || (F.s === 'priced' && p.pr > 0) || (F.s === 'noprice' && !(p.pr > 0)) || (F.s === 'changed' && isChanged(p))) &&
    (!ws.length || ws.every(w => (p.b + ' ' + p.n + ' ' + (p.d || '') + ' ' + (p.da || '') + ' ' + catName(p.c) + ' ' + p.id).toLowerCase().includes(w))));
}
function draw() {
  const P = prods(), cnt = f => P.filter(f).length;
  $('#stats').innerHTML = [['Total items', P.length, 'all'], ['On website', cnt(p => !p.h), 'live'], ['Hidden', cnt(p => p.h), 'hidden'], ['Out of stock', cnt(p => p.st === 'out'), 'out'], ['No photo', cnt(p => !p.i), 'nophoto'], ['With price', cnt(p => p.pr > 0), 'priced']]
    .map(s => `<button class="st${s[2] && F.s === s[2] ? ' on' : ''}" ${s[2] ? `data-s="${s[2]}"` : 'data-a="cats"'}><b>${s[1]}</b><small>${s[0]}</small></button>`).join('');
  $('#stats').onclick = e => { const b = e.target.closest('.st'); if (!b) return; if (b.dataset.a) return catsView(); F.s = b.dataset.s; N = PG; draw() };
  $('#fd').innerHTML = `<option value="">All departments</option>` + CAT.departments.map(d => `<option value="${d.id}"${F.d === d.id ? ' selected' : ''}>${esc(d.en)} (${cnt(p => d.cats.includes(p.c))})</option>`).join('');
  const dd = CAT.departments.find(x => x.id === F.d), cs = dd ? dd.cats : CAT.categories.map((_, i) => i);
  $('#fc').innerHTML = `<option value="-1">All categories</option>` + cs.map(c => `<option value="${c}"${F.c === c ? ' selected' : ''}>${esc(catName(c))} (${cnt(p => p.c === c)})</option>`).join('');
  const ch = diffCount();
  $('#fs').innerHTML = [['all', 'All'], ['live', 'On website'], ['hidden', 'Hidden'], ['out', 'Out of stock'], ['soon', 'Coming soon'], ['nophoto', 'No photo'], ['priced', 'With price'], ['noprice', 'No price'], ['changed', `Changed${ch ? ' · ' + ch : ''}`]].map(s => `<button data-s="${s[0]}" class="${F.s === s[0] ? 'on' : ''}">${s[1]}</button>`).join('');
  const L = filtered();
  $('#res').innerHTML = `<b>${L.length}</b> item${L.length === 1 ? '' : 's'}${Q ? ` for “${esc(Q)}”` : ''}`;
  $('#list').innerHTML = L.length ? L.slice(0, N).map(row).join('') : `<div class="empty">${ico('box', 1.2)}<b>No items here</b><span>Try another search or filter, or add a new item.</span></div>`;
  $('#mo').hidden = L.length <= N;
  const pb = $('#pub'); pb.classList.toggle('on', ch > 0); $('#pubt').innerHTML = `<b>${ch}</b> change${ch === 1 ? '' : 's'} not published yet`;
}
function row(p) {
  const s = imgSrc(p), c = isChanged(p);
  return `<article class="it${p.h ? ' hid' : ''}" data-id="${esc(p.id)}" tabindex="0">
    <span class="th">${s ? `<img src="${s}" alt="" loading="lazy">` : ico('img', 1.3)}</span>
    <span class="tx"><small>${esc(p.b || 'No brand')}${c ? '<i class="dot" title="Changed"></i>' : ''}</small><b>${esc(p.n)}</b><em>${esc(p.d || '')}</em><span class="ct">${esc(catName(p.c))}</span></span>
    <span class="ac"><label class="pq"><span>AED</span><input data-pr="${esc(p.id)}" type="text" inputmode="decimal" autocomplete="off" placeholder="Price" value="${p.pr ?? ''}" aria-label="Price in AED"></label><select data-st="${esc(p.id)}" class="ss ${p.st || 'in'}" aria-label="Stock">${Object.entries(ST).map(([k, v]) => `<option value="${k}"${(p.st || '') === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
    <button class="vis${p.h ? '' : ' on'}" data-tg="${esc(p.id)}" title="${p.h ? 'Hidden from website' : 'Shown on website'}">${ico(p.h ? 'eyeoff' : 'eye')}<span>${p.h ? 'Hidden' : 'Live'}</span></button></span>
  </article>`;
}

/* ---------- editor ---------- */
function openSheet(html) { $('#sp').innerHTML = html; $('#sheet').classList.add('on'); $('#sheet').setAttribute('aria-hidden', 'false'); document.body.classList.add('lock') }
function closeSheet() { $('#sheet').classList.remove('on'); $('#sheet').setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); EDIT = null }
function catOptions(sel) { return CAT.departments.map(d => `<optgroup label="${esc(d.en)}">${d.cats.map(c => `<option value="${c}"${c === sel ? ' selected' : ''}>${esc(catName(c))}</option>`).join('')}</optgroup>`).join('') }
function openEdit(id) {
  const p = id ? JSON.parse(JSON.stringify(byId(id))) : { id: '', n: '', b: '', d: '', c: F.c >= 0 ? F.c : (CAT.departments.find(x => x.id === F.d) || CAT.departments[0]).cats[0] };
  EDIT = { p, isNew: !id, img: null };
  const brands = [...new Set(prods().map(x => x.b).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  openSheet(`<form id="ef" class="ed">
    <div class="eh"><button type="button" class="ib" data-close aria-label="Close">${ico('back')}</button><h2>${id ? 'Edit item' : 'New item'}</h2>${id ? `<a class="ib" href="/product/${encodeURIComponent(id)}" target="_blank" rel="noopener" title="View on website">${ico('ext')}</a>` : '<span></span>'}</div>
    <div class="eb">
      <div class="ph" id="ph"></div>
      <div class="phb"><label class="b lt sm">${ico('cam')}<span>${p.i ? 'Change photo' : 'Add photo'}</span><input type="file" id="pf" accept="image/*" hidden></label>${p.i ? `<button type="button" class="b lt sm" id="prm">${ico('trash')}Remove photo</button>` : ''}</div>
      <label>Product name *<input name="n" required maxlength="140" value="${esc(p.n)}" placeholder="e.g. iPhone 17 Pro 256GB"></label>
      <label>Brand<input name="b" maxlength="60" list="bl" value="${esc(p.b)}" placeholder="e.g. Apple"><datalist id="bl">${brands.map(b => `<option value="${esc(b)}">`).join('')}</datalist></label>
      <label>Details / variants<textarea name="d" rows="2" maxlength="300" placeholder="Colours, storage, version…">${esc(p.d || '')}</textarea></label>
      <label>Details in Arabic (optional)<textarea name="da" rows="2" maxlength="300" dir="rtl" placeholder="التفاصيل بالعربية">${esc(p.da || '')}</textarea><small class="hint">Shown on the Arabic website. If empty, the English details are used.</small></label>
      <label>Price (AED)<input name="pr" type="text" inputmode="decimal" autocomplete="off" pattern="[0-9.,\s]*" placeholder="Leave empty to show Enquire only" value="${p.pr ?? ''}"><small class="hint">With a price, the website shows the price and a Buy now button (orders come to WhatsApp).</small></label>
      <label>Category<select name="c">${catOptions(p.c)}</select></label>
      <div class="lbl">Stock</div><div class="seg" id="seg">${Object.entries(ST).map(([k, v]) => `<button type="button" data-v="${k}" class="${(p.st || '') === k ? 'on' : ''}">${v}</button>`).join('')}</div>
      <label class="sw"><input type="checkbox" name="live" ${p.h ? '' : 'checked'}><span class="tg"></span><span><b>Show on website</b><small>Turn off to hide this item without deleting it.</small></span></label>
    </div>
    <div class="ef">${id ? `<button type="button" class="b lt sm red" id="del">${ico('trash')}Delete</button><button type="button" class="b lt sm" id="dup">${ico('copy')}Duplicate</button>` : ''}<span class="sp1"></span><button class="b dk">${ico('check', 2)}${id ? 'Done' : 'Add item'}</button></div>
  </form>`);
  drawPh();
  $('#seg').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; EDIT.p.st = b.dataset.v || undefined; $$('#seg button').forEach(x => x.classList.toggle('on', x === b)) };
  $('#pf').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { toast('Preparing photo…', '', 0); EDIT.img = await processImage(f); drawPh(); toast('Photo ready. Tap Done to keep it.', 'ok') } catch (err) { toast('Could not read that photo. Try another one.', 'err') } };
  const prm = $('#prm'); if (prm) prm.onclick = () => { EDIT.img = null; EDIT.p.i = ''; drawPh() };
  const del = $('#del'); if (del) del.onclick = () => { if (!confirm(`Delete “${p.n}”? It will be removed from the website when you publish.`)) return; CAT.products = prods().filter(x => x.id !== id); closeSheet(); touch(); toast('Item deleted. Publish to update the website.') };
  const dup = $('#dup'); if (dup) dup.onclick = () => { const s = byId(id), c = JSON.parse(JSON.stringify(s)); c.id = uid((c.b ? c.b + ' ' : '') + c.n + ' copy'); c.n = c.n + ' (copy)'; CAT.products.splice(prods().indexOf(s) + 1, 0, c); touch(); openEdit(c.id); toast('Duplicated. Edit the copy and tap Done.') };
  $('#ef').onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target), q = EDIT.p;
    q.n = String(f.get('n')).trim(); q.b = String(f.get('b')).trim(); const d = String(f.get('d')).trim(), da = String(f.get('da') || '').trim(); q.c = +f.get('c');
    if (!q.n) return toast('Please enter a product name.', 'err');
    if (d) q.d = d; else delete q.d; if (da) q.da = da; else delete q.da; if (!q.b) q.b = '';
    const pr = parseFloat(String(f.get('pr') || '').replace(/[^0-9.]/g, '')); if (pr > 0) q.pr = Math.round(pr * 100) / 100; else delete q.pr;
    if (f.get('live')) delete q.h; else q.h = 1;
    if (!q.st) delete q.st;
    if (EDIT.isNew) q.id = uid((q.b && !q.n.toLowerCase().startsWith(q.b.toLowerCase()) ? q.b + ' ' : '') + q.n);
    if (EDIT.img) { const fn = `products/${q.id.slice(0, 80)}-${Math.random().toString(36).slice(2, 6)}.${EDIT.img.ext}`; IMGS[fn] = EDIT.img.b64; if (q.i && IMGS[q.i]) delete IMGS[q.i]; q.i = fn }
    if (!q.i) delete q.i;
    const ord = { id: q.id, c: q.c, b: q.b, n: q.n }; if (q.d) ord.d = q.d; if (q.da) ord.da = q.da; if (q.x) ord.x = q.x; if (q.i) ord.i = q.i; if (q.pr) ord.pr = q.pr; if (q.st) ord.st = q.st; if (q.h) ord.h = 1;
    if (EDIT.isNew) CAT.products.unshift(ord); else CAT.products[prods().findIndex(x => x.id === q.id)] = ord;
    const wasNew = EDIT.isNew; closeSheet(); touch(); toast(wasNew ? 'Item added. Publish to put it on the website.' : 'Saved. Publish to update the website.', 'ok');
  };
  setTimeout(() => { const n = $('#ef [name=n]'); if (!id && n) n.focus() }, 250);
}
function drawPh() {
  const p = EDIT.p, s = EDIT.img ? 'data:' + EDIT.img.mime + ';base64,' + EDIT.img.b64 : imgSrc(p);
  $('#ph').innerHTML = s ? `<img src="${s}" alt="">` : `<span>${ico('img', 1.2)}<small>No photo yet</small></span>`;
}
async function processImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const im = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url });
    const S = 800, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
    const pad = S * .06, k = Math.min((S - 2 * pad) / im.naturalWidth, (S - 2 * pad) / im.naturalHeight), w = im.naturalWidth * k, h = im.naturalHeight * k;
    x.imageSmoothingQuality = 'high'; x.drawImage(im, (S - w) / 2, (S - h) / 2, w, h);
    let blob = await new Promise(r => cv.toBlob(r, 'image/webp', .86)), ext = 'webp';
    if (!blob || blob.type !== 'image/webp') { blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', .88)); ext = 'jpg' }
    const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(',')[1]); fr.readAsDataURL(blob) });
    return { b64, ext, mime: blob.type };
  } finally { URL.revokeObjectURL(url) }
}

/* ---------- categories ---------- */
function catsView() {
  const cnt = c => prods().filter(p => p.c === c).length;
  openSheet(`<div class="ed"><div class="eh"><button type="button" class="ib" data-close aria-label="Close">${ico('back')}</button><h2>Departments & categories</h2><span></span></div>
    <div class="eb"><p class="mut sm">Rename categories in English and Arabic, or add new ones. A category can only be removed when it has no items.</p>
    ${CAT.departments.map((d, di) => `<section class="dep"><div class="dh"><input data-de="${di}" value="${esc(d.en)}" aria-label="Department name (English)"><input data-da="${di}" dir="rtl" value="${esc(d.ar)}" aria-label="Department name (Arabic)"></div>
      ${d.cats.map(c => `<div class="cr"><input data-ce="${c}" value="${esc(CAT.categories[c].en)}" aria-label="Category (English)"><input data-ca="${c}" dir="rtl" value="${esc(CAT.categories[c].ar)}" aria-label="Category (Arabic)"><span class="n">${cnt(c)}</span>${cnt(c) ? '' : `<button class="ib sm" data-cd="${c}" data-dd="${di}" title="Remove">${ico('trash')}</button>`}</div>`).join('')}
      <button class="b lt sm" data-ad="${di}">${ico('plus', 2)}Add category</button></section>`).join('')}</div>
    <div class="ef"><span class="sp1"></span><button class="b dk" data-close>${ico('check', 2)}Done</button></div></div>`);
  const sp = $('#sp');
  sp.oninput = e => {
    const t = e.target, v = t.value.trim(); if (!v) return;
    if (t.dataset.de) CAT.departments[+t.dataset.de].en = v; if (t.dataset.da) CAT.departments[+t.dataset.da].ar = v;
    if (t.dataset.ce) CAT.categories[+t.dataset.ce].en = v; if (t.dataset.ca) CAT.categories[+t.dataset.ca].ar = v;
    saveDraft();
  };
  sp.onclick = e => {
    const a = e.target.closest('[data-ad]'), r = e.target.closest('[data-cd]');
    if (a) { const n = prompt('New category name (English):'); if (!n || !n.trim()) return; const ar = prompt('Arabic name (optional):') || n; let cid = slug(n), j = 2; while (CAT.categories.some(c => c.id === cid)) cid = slug(n) + '-' + j++; CAT.categories.push({ en: n.trim(), ar: (ar.trim() || n.trim()), id: cid }); CAT.departments[+a.dataset.ad].cats.push(CAT.categories.length - 1); saveDraft(); catsView(); draw() }
    if (r) { const c = +r.dataset.cd, d = CAT.departments[+r.dataset.dd]; if (!confirm(`Remove category “${catName(c)}”?`)) return; d.cats = d.cats.filter(x => x !== c); saveDraft(); catsView(); draw() }
  };
  $('#sp').addEventListener('focusout', () => draw(), { once: false });
}

/* ---------- notes (private, shared by all admins, kept on GitHub encrypted) ---------- */
let NOTES = null;
const when = t => new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const who = e => esc(String(e || '').split('@')[0]);
function notesHTML() {
  if (!NOTES) return `<div class="nl-e"><span class="spin"></span></div>`;
  if (!NOTES.length) return `<div class="nl-e">${ico('note')}<b>No notes yet</b><span>Write reminders, supplier contacts, to-dos… Everyone who logs in sees them.</span></div>`;
  const list = NOTES.slice().sort((a, b) => (b.pin - a.pin) || (b.at - a.at));
  return list.map(n => `<article class="nt${n.pin ? ' pin' : ''}" data-id="${n.id}">
    <div class="nt-t">${esc(n.t)}</div>
    <div class="nt-m"><span>${n.pin ? `<i class="pd">${ico('pin')}Pinned</i> · ` : ''}${when(n.at)} · ${who(n.by)}${n.ed ? ` · edited ${when(n.ed)}` : ''}</span>
      <span class="nt-a"><button class="ib sm" data-np="${n.id}" title="${n.pin ? 'Unpin' : 'Pin to top'}" aria-label="Pin">${ico('pin')}</button><button class="ib sm" data-ne="${n.id}" title="Edit" aria-label="Edit">${ico('pen')}</button><button class="ib sm" data-nd="${n.id}" title="Delete" aria-label="Delete">${ico('trash')}</button></span></div></article>`).join('');
}
async function notesView() {
  $('#md') && $('#md').classList.remove('on');
  openSheet(`<div class="ed"><div class="eh"><button type="button" class="ib" data-close aria-label="Close">${ico('back')}</button><h2>Notes</h2><span></span></div>
    <div class="eb"><div class="nw"><textarea id="nt" rows="3" maxlength="5000" placeholder="Write a note…"></textarea><div class="nw-f"><span class="mut sm">Private to admins. Saved for everyone who logs in.</span><button class="b dk sm" id="nadd">${ico('plus', 2)}Add note</button></div></div>
    <div class="nl" id="nl">${notesHTML()}</div></div></div>`);
  const sp = $('#sp'), list = () => { const l = $('#nl'); if (l) l.innerHTML = notesHTML() };
  const send = async (body, okMsg) => {
    try { const r = await api('notes', body); NOTES = r.notes; list(); if (okMsg) toast(okMsg, 'ok', 1800); return true }
    catch (e) { toast(esc(e.message), 'err', 5000); return false }
  };
  $('#nadd').onclick = async () => {
    const t = $('#nt').value.trim(); if (!t) return $('#nt').focus();
    const b = $('#nadd'); b.disabled = true;
    if (await send({ op: 'add', t }, 'Note saved')) $('#nt').value = '';
    b.disabled = false;
  };
  $('#nt').onkeydown = e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) $('#nadd').click() };
  sp.onclick = async e => {
    const p = e.target.closest('[data-np]'), ed = e.target.closest('[data-ne]'), d = e.target.closest('[data-nd]'), sv = e.target.closest('[data-ns]'), cx = e.target.closest('[data-nc]');
    if (p) { const n = NOTES.find(x => x.id === p.dataset.np); if (n) send({ op: 'pin', id: n.id, pin: !n.pin }) }
    if (d) { if (confirm('Delete this note?')) send({ op: 'del', id: d.dataset.nd }, 'Note deleted') }
    if (ed) { const n = NOTES.find(x => x.id === ed.dataset.ne), a = ed.closest('.nt'); if (!n || !a) return;
      a.innerHTML = `<textarea rows="4" maxlength="5000">${esc(n.t)}</textarea><div class="nw-f"><span></span><span class="nt-a"><button class="b lt sm" data-nc>Cancel</button><button class="b dk sm" data-ns="${n.id}">${ico('check', 2)}Save</button></span></div>`;
      const ta = a.querySelector('textarea'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length) }
    if (cx) list();
    if (sv) { const t = sv.closest('.nt').querySelector('textarea').value.trim(); if (!t) return; sv.disabled = true; if (!(await send({ op: 'edit', id: sv.dataset.ns, t }, 'Note updated'))) sv.disabled = false }
  };
  try { const r = await api('notes'); NOTES = r.notes; if (r.locked) toast('Older notes were saved with a previous security key and can’t be opened. New notes will work normally.', 'warn', 8000) }
  catch (e) { NOTES = NOTES || []; toast(esc(e.message), 'err', 5000) }
  list();
}

// phone model (Chrome/Android hides it from the normal browser info)
async function clientInfo() {
  try { const u = navigator.userAgentData; if (!u || !u.getHighEntropyValues) return {}; const v = await u.getHighEntropyValues(['model', 'platform', 'platformVersion']); return { model: v.model || '', platform: v.platform || '', pv: v.platformVersion || '' } } catch (_) { return {} }
}
/* ---------- history of changes published from this dashboard ---------- */
async function historyView() {
  $('#md') && $('#md').classList.remove('on');
  let page = 1, items = [], more = false, busy = false;
  openSheet(`<div class="ed"><div class="eh"><button type="button" class="ib" data-close aria-label="Close">${ico('back')}</button><h2>History</h2><span></span></div>
    <div class="eb"><p class="mut sm">Every change published from this dashboard, newest first.</p><div class="hl" id="hl"><div class="nl-e"><span class="spin"></span></div></div>
    <div class="more"><button class="b lt sm" id="hm" hidden>Load older</button></div></div></div>`);
  const day = t => new Date(t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const time = t => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const draw = () => {
    const el = $('#hl'); if (!el) return;
    if (!items.length) { el.innerHTML = `<div class="nl-e">${ico('clock')}<b>No changes yet</b><span>When someone publishes from the dashboard, it shows up here.</span></div>`; return }
    let last = '', h = '';
    for (const it of items) {
      const d = day(it.at); if (d !== last) { h += `<h4 class="hd">${d}</h4>`; last = d }
      h += `<article class="hi"><div class="hi-h"><b>${esc(it.title)}</b><span>${time(it.at)}${it.by ? ' · ' + who(it.by) : ''}</span></div>
        ${it.dev ? `<div class="hi-d">${ico(/iPhone|Android/.test(it.dev.device || '') ? 'phone' : 'pc')}<span>${it.dev.locked ? 'Device details saved with an old key' : [it.dev.device, it.dev.browser, it.dev.ip && 'IP ' + it.dev.ip, it.dev.place].filter(Boolean).map(esc).join(' · ')}</span></div>` : ''}
        ${it.lines.length ? `<ul>${it.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : `<p class="mut sm">No details were recorded for this change.</p>`}</article>`;
    }
    el.innerHTML = h; $('#hm').hidden = !more;
  };
  const load = async () => {
    if (busy) return; busy = true; const b = $('#hm'); if (b) b.disabled = true;
    try { const r = await api('history?page=' + page); items = items.concat(r.items); more = r.more; page++; if (!r.items.length && more) { busy = false; return load() } draw() }
    catch (e) { toast(esc(e.message), 'err', 5000); if (!items.length) $('#hl').innerHTML = '' }
    busy = false; if (b) b.disabled = false;
  };
  $('#hm').onclick = load;
  load();
}

/* ---------- csv ---------- */
const CSVH = ['id', 'brand', 'name', 'details', 'details_ar', 'price_aed', 'department', 'category', 'stock', 'visible', 'photo'];
function exportCSV() {
  const q = v => { v = String(v ?? ''); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v };
  const rows = [CSVH.join(',')].concat(prods().map(p => [p.id, p.b, p.n, p.d || '', p.da || '', p.pr || '', (dept(p.c) || {}).en || '', catName(p.c), ST[p.st || ''], p.h ? 'no' : 'yes', p.i || ''].map(q).join(',')));
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = `kenz-products-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Exported. Open it in Excel, edit, then use Import CSV.', 'ok');
}
function parseCSV(t) {
  const out = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"') { if (t[i + 1] === '"') { f += '"'; i++ } else q = false } else f += ch }
    else if (ch === '"') q = true; else if (ch === ',' || ch === ';' && !t.slice(0, 200).includes(',')) { row.push(f); f = '' }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; row.push(f); out.push(row); row = []; f = '' }
    else f += ch;
  }
  if (f || row.length) { row.push(f); out.push(row) }
  return out.filter(r => r.some(c => c.trim()));
}
async function importCSV(file) {
  const rows = parseCSV((await file.text()).replace(/^﻿/, ''));
  if (rows.length < 2) return toast('That file has no rows.', 'err');
  const H = rows[0].map(h => h.trim().toLowerCase()), ix = k => H.indexOf(k);
  if (ix('name') < 0) return toast('The file needs at least a “name” column. Export first to get the right format.', 'err', 6000);
  const catIx = n => CAT.categories.findIndex(c => c.en.toLowerCase() === String(n).trim().toLowerCase());
  const stIx = v => { v = String(v || '').toLowerCase(); return v.startsWith('out') ? 'out' : v.startsWith('coming') || v === 'soon' ? 'soon' : '' };
  let up = 0, add = 0, bad = []; const next = JSON.parse(JSON.stringify(CAT.products));
  rows.slice(1).forEach((r, k) => {
    const g = key => ix(key) >= 0 ? (r[ix(key)] || '').trim() : null, name = g('name');
    if (!name) return bad.push(`Row ${k + 2}: no name`);
    let p = g('id') ? next.find(x => x.id === g('id')) : null;
    const ci = g('category') != null ? catIx(g('category')) : (p ? p.c : -1);
    if (ci < 0) return bad.push(`Row ${k + 2}: unknown category “${g('category') || ''}”`);
    const isNew = !p; if (isNew) { p = { id: '', c: ci, b: '', n: '' } }
    p.n = name; if (g('brand') != null) p.b = g('brand'); p.c = ci;
    if (g('details') != null) { if (g('details')) p.d = g('details'); else delete p.d }
    if (g('details_ar') != null) { if (g('details_ar')) p.da = g('details_ar'); else delete p.da }
    const gp = g('price_aed') != null ? g('price_aed') : g('price'); if (gp != null) { const v = parseFloat(gp.replace(/[^0-9.]/g, '')); if (v > 0) p.pr = Math.round(v * 100) / 100; else delete p.pr }
    if (g('stock') != null) { const s = stIx(g('stock')); if (s) p.st = s; else delete p.st }
    if (g('visible') != null) { if (/^(no|false|0|hidden)$/i.test(g('visible'))) p.h = 1; else delete p.h }
    if (isNew) { let id = slug((p.b ? p.b + ' ' : '') + p.n), k2 = id, j = 2; while (next.find(x => x.id === k2)) k2 = id + '-' + j++; p.id = k2; next.push(p); add++ } else up++;
  });
  const msg = `Import preview:\n• ${up} items will be updated\n• ${add} new items will be added${bad.length ? `\n• ${bad.length} rows skipped:\n  ${bad.slice(0, 8).join('\n  ')}` : ''}\n\nApply these changes? (You can still review before publishing.)`;
  if (!confirm(msg)) return;
  CAT.products = next; touch(); toast(`Imported: ${up} updated, ${add} added. Review, then Publish.`, 'ok', 6000);
}

/* ---------- publish ---------- */
async function publish() {
  if (BUSY) return; const n = diffCount(); if (!n) return;
  BUSY = true; const b = $('#pubb'); b.disabled = true; b.innerHTML = '<i class="spin sm"></i>Publishing…';
  try {
    const images = Object.entries(IMGS).map(([path, b64]) => ({ path, b64 }));
    const size = JSON.stringify(images).length;
    if (size > 3_500_000) throw new Error('Too many new photos in one go. Publish after every 10–15 photos.');
    const r = await api('publish', { sha: SHA, catalog: CAT, images, client: await clientInfo(), message: `Update ${n} item${n === 1 ? '' : 's'} from admin` });
    for (const [path, b64] of Object.entries(IMGS)) PREV[path] = 'data:' + mime(path) + ';base64,' + b64;
    SHA = r.sha; CAT.v = r.v; BASE = JSON.stringify(CAT); IMGS = {}; saveDraft(); draw();
    toast(`<span class="spin sm"></span>Published. Updating the website… (about 2 minutes)`, 'ok', 0);
    waitLive(r.v);
  } catch (e) {
    if (e.status === 401) { toast('Your login expired. Log in again — your changes are kept on this device.', 'err', 7000); setTimeout(() => loginView({ login: true }), 1500) }
    else toast(esc(e.message), 'err', 8000);
  } finally { BUSY = false; b.disabled = false; b.innerHTML = `${ico('check', 2)}Publish to website` }
}
async function waitLive(v, tries = 0) {
  try { const r = await fetch('/api/live?t=' + Date.now(), { cache: 'no-store' }); const j = await r.json(); if (j.v >= v) return toast(`${ico('check', 2)} Live on the website now.`, 'ok', 5000) } catch (_) { }
  if (tries > 60) return toast('Published. The website will show the changes shortly.', 'ok', 6000);
  setTimeout(() => waitLive(v, tries + 1), 6000);
}
async function logout() {
  if (changed() && !confirm('You have unpublished changes. They stay saved on this device. Log out anyway?')) return;
  try { await api('logout', {}) } catch (_) { } location.reload();
}

boot();
})();
