"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { T, wa, path } from "./ui";
import { items, departments, categories, catName, full, deptOf } from "./catalog";
import { Card, Ico, WaIcon } from "./kit";

const PG = 36;

export default function Shop({ lang }) {
  const t = T[lang];
  const [S, set] = useState({ d: "", c: "", b: "", q: "", s: 0 });
  const [n, setN] = useState(PG);
  const [ready, setReady] = useState(false);
  const first = useRef(true);

  // read ?d= ?c= ?b= ?q= (also old ?cat= / ?brand= links)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const c = p.get("c") || p.get("cat") || "";
    set({ d: c ? "" : p.get("d") || "", c: categories.some((x) => x.key === c) ? c : "", b: p.get("b") || p.get("brand") || "", q: p.get("q") || "", s: 0 });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (first.current) { first.current = false; return; }
    const u = new URLSearchParams();
    if (S.d) u.set("d", S.d); if (S.c) u.set("c", S.c); if (S.b) u.set("b", S.b); if (S.q) u.set("q", S.q);
    history.replaceState(null, "", location.pathname + (u.toString() ? `?${u}` : ""));
  }, [S, ready]);

  const dep = departments.find((x) => x.id === S.d) || (S.c ? deptOf(S.c) : null);
  const title = S.c ? catName(S.c, lang) : dep ? dep[lang] : t.all;
  useEffect(() => { document.title = `${title} · ${t.brandFull}`; }, [title, t.brandFull]);

  const filter = (ignoreBrand) => {
    const q = S.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const dd = departments.find((x) => x.id === S.d);
    return items.filter((p) => (!S.c || p.c === S.c) && (!dd || dd.cats.includes(p.c)) && (ignoreBrand || !S.b || p.b === S.b) &&
      (!q.length || q.every((w) => `${p.b} ${p.n} ${p.d.en} ${p.d.ar} ${catName(p.c, "en")} ${catName(p.c, "ar")}`.toLowerCase().includes(w))));
  };
  const all = useMemo(() => {
    let r = filter(false);
    if (S.s === 1) r = [...r].sort((a, b) => a.n.localeCompare(b.n));
    else if (S.s === 2) r = [...r].sort((a, b) => (a.b || "zz").localeCompare(b.b || "zz") || a.n.localeCompare(b.n));
    else r = [...r].sort((a, b) => (a.k === "phone" ? 0 : 1) - (b.k === "phone" ? 0 : 1) || (a.img ? 0 : 1) - (b.img ? 0 : 1));
    return r;
  }, [S]); // eslint-disable-line react-hooks/exhaustive-deps

  const brands = useMemo(() => {
    const bc = {}; filter(true).forEach((p) => { if (p.b) bc[p.b] = (bc[p.b] || 0) + 1; });
    const top = Object.entries(bc).sort((a, b) => b[1] - a[1]).slice(0, 24).map((e) => e[0]);
    if (S.b && !top.includes(S.b)) top.unshift(S.b);
    return top;
  }, [S.d, S.c, S.q, S.b]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (patch, top) => {
    const run = () => { set((s) => ({ ...s, ...patch })); setN(PG); };
    document.startViewTransition ? document.startViewTransition(run) : run();
    if (top && scrollY > 260) scrollTo({ top: 0, behavior: "smooth" });
  };
  const cnt = (f) => items.filter(f).length;
  const shown = all.slice(0, n);
  const askName = S.c ? catName(S.c, "en") : dep ? dep.en : "your store";

  return (
    <div className="w">
      <div className="shead">
        <div className="crumb"><a href={path(lang)}>{t.home}</a><span>/</span><a href={path(lang, "/shop")}>{t.shop}</a>{(S.d || S.c) && <><span>/</span><span>{title}</span></>}</div>
        <h1>{title}</h1>
        <div className="sub"><p>{t.shopP}</p></div>
      </div>
      <div className="shop">
        <aside className="side"><h6>{t.depts}</h6>
          <ul className="dl">
            <li className={!S.d && !S.c ? "on" : ""}><button className="dh" onClick={() => go({ d: "", c: "", b: "" }, true)}>{t.all} <sup>{items.length}</sup></button></li>
            {departments.map((x) => (
              <li key={x.id} className={dep === x ? "on" : ""}>
                <button className="dh" onClick={() => go({ d: x.id, c: "", b: "" }, true)}>{x[lang]} <sup>{cnt((p) => x.cats.includes(p.c))}</sup></button>
                <div className="cl"><div><div>{x.cats.map((k) => <button key={k} className={S.c === k ? "on" : ""} onClick={() => go({ c: k, d: "", b: "" }, true)}>{catName(k, lang)} <sup>{cnt((p) => p.c === k)}</sup></button>)}</div></div></div>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          <div className="dchips">
            <button className={!dep ? "on" : ""} onClick={() => go({ d: "", c: "", b: "" })}>{t.all}</button>
            {departments.map((x) => <button key={x.id} className={dep === x ? "on" : ""} onClick={() => go({ d: x.id, c: "", b: "" })}>{x[lang]}</button>)}
          </div>
          <div className="tb">
            <label className="q"><Ico k="search" sw={1.6} /><input type="search" autoComplete="off" placeholder={t.search} value={S.q} onChange={(e) => { const q = e.target.value; set((s) => ({ ...s, q })); setN(PG); }} /></label>
            <select className="sel" aria-label="Category" value={S.c} onChange={(e) => go(e.target.value ? { c: e.target.value, d: "" } : { c: "" })}>
              <option value="">{dep ? dep[lang] : t.all}</option>
              {(dep ? dep.cats : categories.map((x) => x.key)).map((k) => <option key={k} value={k}>{catName(k, lang)}</option>)}
            </select>
            <select className="sel" aria-label="Sort" value={S.s} onChange={(e) => go({ s: +e.target.value })}>{t.sort.map((s, i) => <option key={i} value={i}>{s}</option>)}</select>
          </div>
          {brands.length > 1 && <div className="bchips">
            <button className={!S.b ? "on" : ""} onClick={() => go({ b: "" })}>{t.allB}</button>
            {brands.map((b) => <button key={b} className={S.b === b ? "on" : ""} onClick={() => go({ b })}>{b}</button>)}
          </div>}
          <div className="res">{all.length > 0 && <span dangerouslySetInnerHTML={{ __html: t.showing(shown.length, all.length) }} />}</div>
          <div className="grid">
            {all.length ? shown.map((p, i) => <Card key={p.id} p={p} i={Math.min(i % PG, 18)} lang={lang} />) : <div className="empty"><b>{t.none}</b>{t.noneP}</div>}
          </div>
          {all.length > n && <div className="more"><button className="btn lt" onClick={() => setN(n + PG)}>{t.more}</button></div>}
          <div className="ask"><div><h3>{t.askCat(title)}</h3><p>{t.askCatP}</p></div><a className="btn dk" target="_blank" rel="noopener" href={wa(t.waC(askName))}><WaIcon />{t.ask}</a></div>
        </div>
      </div>
    </div>
  );
}
