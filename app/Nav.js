"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { items, departments, catName, full, hasPr, fmtPr } from "./catalog";
import { T, path } from "./ui";

const Arr = () => <svg className="ar" viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const SearchIc = () => <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
const href = (p, lang) => path(lang, `/product/${p.id}`);

// ---------- Mega menu (desktop): departments → categories → products ----------
export function MegaMenu({ lang, label, active }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [dep, setDep] = useState(departments[0].id);
  const [cat, setCat] = useState("");
  const timer = useRef();
  const d = departments.find((x) => x.id === dep) || departments[0];
  const products = useMemo(() => items.filter((p) => (cat ? p.c === cat : d.cats.includes(p.c))).sort((a, b) => (b.img ? 1 : 0) - (a.img ? 1 : 0)).slice(0, 6), [d, cat]);
  const total = items.filter((p) => (cat ? p.c === cat : d.cats.includes(p.c))).length;
  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 160); };
  useEffect(() => { const k = (e) => e.key === "Escape" && setOpen(false); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  const allHref = cat ? path(lang, `/shop?c=${cat}`) : path(lang, `/shop?d=${d.id}`);
  return (
    <div className={`mm${open ? " open" : ""}`} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) hide(); }}>
      <a href={path(lang, "/shop")} className={active ? "on" : undefined} aria-haspopup="true" aria-expanded={open}>{label} <svg viewBox="0 0 24 24" width="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></a>
      <div className="mmp" role="menu">
        <div className="w mmg">
          <ul className="mmd">
            {departments.map((x) => (
              <li key={x.id}><a href={path(lang, `/shop?d=${x.id}`)} className={x.id === d.id ? "on" : undefined} onMouseEnter={() => { setDep(x.id); setCat(""); }} onFocus={() => { setDep(x.id); setCat(""); }}>
                <span>{x[lang]}</span><sup>{items.filter((p) => x.cats.includes(p.c)).length}</sup><Arr /></a></li>
            ))}
          </ul>
          <div className="mmc">
            <h6>{d[lang]}</h6>
            <a href={path(lang, `/shop?d=${d.id}`)} className={!cat ? "on" : undefined} onMouseEnter={() => setCat("")}>{t.all}</a>
            {d.cats.map((k) => <a key={k} href={path(lang, `/shop?c=${k}`)} className={cat === k ? "on" : undefined} onMouseEnter={() => setCat(k)} onFocus={() => setCat(k)}>{catName(k, lang)} <sup>{items.filter((p) => p.c === k).length}</sup></a>)}
          </div>
          <div className="mmx">
            <div className="mmh"><h6>{cat ? catName(cat, lang) : d[lang]}</h6><a className="lk" href={allHref}>{t.mmAll(total)} <Arr /></a></div>
            <div className="mmi">
              {products.map((p) => (
                <a key={p.id} href={href(p, lang)} className="mmt">
                  <span className="mmim">{p.img ? <img src={p.img} alt="" loading="lazy" /> : <b>{p.n.slice(0, 2)}</b>}</span>
                  <span className="mmtx"><small>{p.b || catName(p.c, lang)}</small><b>{p.n}</b>{hasPr(p) ? <i className="mp" dir={lang === "ar" ? "rtl" : "ltr"}>{fmtPr(p.pr, lang)}</i> : <i>{p.d[lang]}</i>}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Search (every page) ----------
export function Search({ lang }) {
  const t = T[lang];
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const box = useRef(), inp = useRef();
  const res = useMemo(() => {
    const w = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!w.length) return [];
    return items.map((p) => {
      const hay = `${p.b} ${p.n} ${p.d.en} ${p.d.ar} ${catName(p.c, "en")} ${catName(p.c, "ar")}`.toLowerCase();
      if (!w.every((x) => hay.includes(x))) return null;
      const name = full(p).toLowerCase();
      return { p, s: (name.startsWith(w[0]) ? 0 : name.includes(w[0]) ? 1 : 2) + (p.img ? 0 : 0.5) };
    }).filter(Boolean).sort((a, b) => a.s - b.s).slice(0, 8).map((r) => r.p);
  }, [q]);
  useEffect(() => {
    const k = (e) => {
      if ((e.key === "/" && !/input|textarea/i.test(document.activeElement?.tagName)) || ((e.metaKey || e.ctrlKey) && e.key === "k")) { e.preventDefault(); setOpen(true); setTimeout(() => inp.current?.focus(), 30); }
      if (e.key === "Escape") setOpen(false);
    };
    const c = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    addEventListener("keydown", k); addEventListener("mousedown", c);
    return () => { removeEventListener("keydown", k); removeEventListener("mousedown", c); };
  }, []);
  useEffect(() => { document.body.classList.toggle("so", open); }, [open]);
  const go = (e) => {
    e.preventDefault();
    if (res[hi] && q.trim()) location.href = href(res[hi], lang);
    else location.href = path(lang, `/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };
  const key = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(h + 1, res.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
  };
  return (
    <div className={`gs${open ? " open" : ""}`} ref={box}>
      <button className="gsb" type="button" aria-label={t.search} onClick={() => { setOpen(true); setTimeout(() => inp.current?.focus(), 30); }}><SearchIc /><span>{t.searchShort}</span><kbd>/</kbd></button>
      <div className="gsp">
        <form className="gsf" role="search" onSubmit={go}>
          <SearchIc />
          <input ref={inp} type="search" value={q} placeholder={t.search} aria-label={t.search} autoComplete="off"
            onChange={(e) => { setQ(e.target.value); setHi(0); }} onKeyDown={key} />
          <button type="button" className="gsx" aria-label={t.close} onClick={() => setOpen(false)}>×</button>
        </form>
        {q.trim() ? (
          res.length ? (
            <ul className="gsr">
              {res.map((p, i) => (
                <li key={p.id}><a href={href(p, lang)} className={i === hi ? "on" : undefined} onMouseEnter={() => setHi(i)}>
                  <span className="mmim">{p.img ? <img src={p.img} alt="" loading="lazy" /> : <b>{p.n.slice(0, 2)}</b>}</span>
                  <span className="mmtx"><small>{p.b || catName(p.c, lang)} · {catName(p.c, lang)}</small><b>{p.n}</b><i>{p.d[lang]}{hasPr(p) && <> · <span className="sp-pr" dir={lang === "ar" ? "rtl" : "ltr"}>{fmtPr(p.pr, lang)}</span></>}</i></span>
                </a></li>
              ))}
              <li><a className="gsall" href={path(lang, `/shop?q=${encodeURIComponent(q.trim())}`)}>{t.seeAllRes(q.trim())} <Arr /></a></li>
            </ul>
          ) : <p className="gse">{t.noRes}</p>
        ) : (
          <div className="gsq"><small>{t.popular}</small>
            {["iPhone 18", "Galaxy S26", "AirPods", "MagSafe", "Power bank", "Smart watch", "Bakhoor"].map((s) => <button key={s} type="button" onClick={() => { setQ(s); inp.current?.focus(); }}>{s}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}
