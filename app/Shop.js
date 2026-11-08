"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "./cards.css";
import { PHOTOS, photoFile } from "./photos";
import { categories, accessories, brandList } from "./accessories";
import { wa } from "./content";

const PAGE = 24;
const GENUINE = new Set(["apple", "samsung", "huawei"]);

const WaIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" fill="currentColor">
    <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/>
  </svg>
);

export default function Shop({ t, lang }) {
  const s = t;
  const [cat, setCat] = useState("all");
  const [brand, setBrand] = useState("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [fade, setFade] = useState(false);
  const chipsRef = useRef(null);
  const first = useRef(true);

  const brandLabel = (b) => (b === "Assorted" ? s.assorted : b);
  const catName = (k) => categories.find((c) => c.key === k)?.[lang] || "";

  // read ?cat= / ?brand= / ?q= on load
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("cat"), b = p.get("brand"), qq = p.get("q");
    if (c && categories.some((x) => x.key === c)) setCat(c);
    if (b && brandList.includes(b)) setBrand(b);
    if (qq) setQ(qq);
  }, []);

  // keep URL in sync (shareable filtered links)
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const p = new URLSearchParams();
    if (cat !== "all") p.set("cat", cat);
    if (brand !== "all") p.set("brand", brand);
    if (q.trim()) p.set("q", q.trim());
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [cat, brand, q]);

  // scroll active chip into view
  useEffect(() => {
    const el = chipsRef.current?.querySelector(".chip.on");
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [cat]);

  const animate = (fn) => {
    setFade(true);
    setTimeout(() => { fn(); setLimit(PAGE); setFade(false); }, 180);
  };

  const needle = q.trim().toLowerCase();
  const list = useMemo(() => accessories.filter((a) =>
    (cat === "all" || a.cat === cat) &&
    (brand === "all" || a.brand === brand) &&
    (!needle || `${a.name} ${a.brand} ${brandLabel(a.brand)} ${a.details.en} ${a.details.ar} ${catName(a.cat)}`.toLowerCase().includes(needle))
  ), [cat, brand, needle]); // eslint-disable-line react-hooks/exhaustive-deps

  const countFor = (k) => accessories.filter((a) => (k === "all" || a.cat === k) && (brand === "all" || a.brand === brand)).length;
  const brandsInCat = useMemo(() => brandList.filter((b) => accessories.some((a) => a.brand === b && (cat === "all" || a.cat === cat))), [cat]);

  const msg = (a) => [
    s.msg.intro, "",
    `• ${s.msg.product}: ${a.name}`,
    `• ${s.msg.brand}: ${brandLabel(a.brand)}`,
    `• ${s.msg.category}: ${catName(a.cat)}`,
    `• ${s.msg.details}: ${a.details[lang]}`,
    "", s.msg.outro,
  ].join("\n");

  const shown = list.slice(0, limit);

  return (
    <section className="shop">
      <div className="wrap">
        <div className="shop-bar">
          <label className="search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); if (e.target.value && cat !== "all") setCat("all"); }} placeholder={s.search} aria-label={s.search} />
            {q && <button className="search-clear" onClick={() => setQ("")} aria-label={s.clear}>×</button>}
          </label>
          <label className="brand-select">
            <span>{s.brand}</span>
            <select value={brand} onChange={(e) => { const v = e.target.value; animate(() => setBrand(v)); }} aria-label={s.brand}>
              <option value="all">{s.allBrands}</option>
              {brandsInCat.map((b) => <option key={b} value={b}>{brandLabel(b)}</option>)}
            </select>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </label>
        </div>

        <div className="chips" ref={chipsRef} role="tablist" aria-label={s.category}>
          {[{ key: "all", en: s.all, ar: s.all }, ...categories].map((c) => {
            const n = countFor(c.key);
            if (c.key !== "all" && n === 0) return null;
            return (
              <button key={c.key} role="tab" aria-selected={cat === c.key} className={`chip${cat === c.key ? " on" : ""}${GENUINE.has(c.key) ? " chip-genuine" : ""}`}
                onClick={() => animate(() => { setCat(c.key); if (brand !== "all" && !accessories.some((a) => a.brand === brand && (c.key === "all" || a.cat === c.key))) setBrand("all"); })}>
                {c.key === "all" ? s.all : c[lang]} <span>{n}</span>
              </button>
            );
          })}
        </div>

        <p className="shop-count" aria-live="polite">{s.count.replace("{n}", list.length)}</p>

        <div className={`agrid${fade ? " fading" : ""}`}>
          {shown.map((a, i) => { const f = photoFile(a); const has = PHOTOS.has(f); return (
            <article className={`acard${has ? "" : " nophoto"}`} key={a.id} style={{ "--i": i % PAGE }}>
              {GENUINE.has(a.cat) && <span className="ptag">{s.genuine}</span>}
              {has && <div className="aimg"><img src={`/products/${f}.webp`} alt={`${brandLabel(a.brand)} ${a.name}`} loading="lazy" decoding="async" width="800" height="800" /></div>}
              <div className="ainfo">
                <p className="abrand">{brandLabel(a.brand)}</p>
                <h3 dir="auto">{a.name}</h3>
                <p className="adet">{a.details[lang]}</p>
                <div className="aactions">
                  <a className="btn btn-dark sm" href={wa(msg(a))} target="_blank" rel="noopener"><WaIcon /> {s.ask}</a>
                </div>
              </div>
            </article>
          ); })}
        </div>

        {list.length === 0 && (
          <div className="shop-empty">
            <p>{s.none}</p>
            <a className="btn btn-dark" href={wa(`${s.msg.intro}\n\n${q}`)} target="_blank" rel="noopener"><WaIcon /> {s.noneCta}</a>
          </div>
        )}

        {list.length > limit && (
          <div className="more-wrap">
            <button className="btn btn-line" onClick={() => setLimit((l) => l + PAGE)}>{s.more} <span className="more-n">({list.length - limit})</span></button>
          </div>
        )}

        <p className="pnote">{s.note}</p>
      </div>
    </section>
  );
}
