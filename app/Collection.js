"use client";
import { useEffect, useRef, useState } from "react";
import PhoneView from "./PhoneArt";
import { products } from "./products";
import { wa } from "./content";

const specKeys = ["display", "chip", "camera", "front", "battery", "build"];

const WaIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" fill="currentColor">
    <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/>
  </svg>
);

const VIEWS = ["hero", "back", "front", "side"];

function Gallery({ p, t, lang }) {
  const [idx, setIdx] = useState(0);
  const track = useRef(null);
  const rtl = lang === "ar";

  const goTo = (n) => {
    const el = track.current;
    if (!el) return;
    const i = (n + VIEWS.length) % VIEWS.length;
    el.scrollTo({ left: (rtl ? -1 : 1) * i * el.clientWidth, behavior: "smooth" });
    setIdx(i);
  };
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    if (i !== idx) setIdx(i);
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(idx + (rtl ? -1 : 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(idx + (rtl ? 1 : -1)); }
  };

  return (
    <div className="gallery" onKeyDown={onKey}>
      <div className="g-track" ref={track} onScroll={onScroll} tabIndex={0} aria-roledescription="carousel" aria-label={`${p.name}, ${p.color[lang]}`}>
        {VIEWS.map((v, i) => (
          <div className={`g-slide${i === idx ? " is-active" : ""}`} key={v} aria-hidden={i !== idx} aria-label={t.views[v]}>
            <PhoneView product={p} view={v} />
          </div>
        ))}
      </div>
      <button className="g-arrow g-prev" onClick={() => goTo(idx - 1)} aria-label={t.prev}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <button className="g-arrow g-next" onClick={() => goTo(idx + 1)} aria-label={t.next}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      <div className="g-tabs" role="tablist">
        {VIEWS.map((v, i) => (
          <button key={v} role="tab" aria-selected={i === idx} className={i === idx ? "on" : ""} onClick={() => goTo(i)}>{t.views[v]}</button>
        ))}
      </div>
    </div>
  );
}

export default function Collection({ t, lang }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);
  const list = products.filter((p) => filter === "all" || p.brand === filter);
  const count = (b) => products.filter((p) => b === "all" || p.brand === b).length;

  const priceMsg = (p) => {
    const m = t.priceMsg;
    return [
      m.intro,
      "",
      `• ${m.model}: ${p.name}`,
      `• ${m.color}: ${p.color[lang]}`,
      `• ${m.storage}: ${p.storage}`,
      `• ${m.chip}: ${p.specs.chip[lang]}`,
      `• ${m.display}: ${p.specs.display[lang]}`,
      `• ${m.camera}: ${p.specs.camera[lang]}`,
      "",
      m.outro,
    ].join("\n");
  };

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (active) {
      if (!dlg.open) dlg.showModal();
      window.__lenis?.stop();
      dlg.querySelector(".sheet-scroll")?.scrollTo(0, 0);
    } else if (dlg.open) {
      dlg.close();
    }
  }, [active]);

  const closeSheet = () => {
    const dlg = dialogRef.current;
    if (!dlg || !dlg.open || dlg.classList.contains("closing")) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { dlg.close(); return; }
    dlg.classList.add("closing");
    setTimeout(() => { dlg.classList.remove("closing"); dlg.close(); }, 380);
  };

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => { setActive(null); window.__lenis?.start(); };
    const onClick = (e) => { if (e.target === dlg) closeSheet(); };
    const onCancel = (e) => { e.preventDefault(); closeSheet(); };
    dlg.addEventListener("close", onClose);
    dlg.addEventListener("click", onClick);
    dlg.addEventListener("cancel", onCancel);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("click", onClick);
      dlg.removeEventListener("cancel", onCancel);
    };
  }, []);

  const changeFilter = (f) => {
    if (f === filter) return;
    const grid = document.querySelector(".pgrid");
    grid?.classList.add("leaving");
    setTimeout(() => { setFilter(f); grid?.classList.remove("leaving"); }, 220);
  };

  // reveal newly filtered cards
  useEffect(() => {
    const cards = document.querySelectorAll(".pcard");
    cards.forEach((c, i) => {
      c.classList.remove("show");
      void c.offsetWidth;
      c.style.setProperty("--i", i % 6);
      c.classList.add("show");
    });
  }, [filter]);

  return (
    <section id="collection" className="sec collection">
      <div className="wrap">
        <div className="head center" data-reveal>
          <p className="eyebrow center">{t.eyebrow}</p>
          <h2>{t.title1}<span className="mark-hl">{t.title2}</span></h2>
          <p className="sub">{t.text}</p>
        </div>

        <div className="seg-wrap" data-reveal>
          <div className="seg" role="tablist" aria-label={t.filterAria}>
            {["all", "iphone", "galaxy"].map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? "on" : ""}
                onClick={() => changeFilter(f)}
              >
                {t.filters[f]} <span className="seg-count">{count(f)}</span>
              </button>
            ))}
            <span className="seg-pill" style={{ "--pos": ["all", "iphone", "galaxy"].indexOf(filter) }} aria-hidden="true" />
          </div>
        </div>

        <div className="pgrid">
          {list.map((p) => (
            <article className="pcard" key={p.id}>
              <button className="pcard-hit" onClick={() => setActive(p)} aria-label={`${t.viewSpecs}: ${p.name}, ${p.color[lang]}, ${p.storage}`} />
              {p.tag && <span className="ptag">{p.tag[lang]}</span>}
              <div className="pimg"><PhoneView product={p} view="hero" /></div>
              <div className="pinfo">
                <span className="swatch"><i style={{ background: p.hex }} />{p.color[lang]}</span>
                <h3 dir="ltr">{p.name}</h3>
                <p className="pstorage"><span dir="ltr">{p.storage}</span></p>
                <p className="pchip">{p.specs.chip[lang]}</p>
                <p className="pprice">{t.priceNote}</p>
                <div className="pactions">
                  <a className="btn btn-dark sm" href={wa(priceMsg(p))} target="_blank" rel="noopener"><WaIcon size={16} /> {t.askPrice}</a>
                  <button className="plink" onClick={() => setActive(p)}>{t.viewSpecs} <span aria-hidden="true">{lang === "ar" ? "←" : "→"}</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="pnote" data-reveal>{t.note}</p>
      </div>

      <dialog ref={dialogRef} className="sheet" aria-labelledby="sheet-title" data-lenis-prevent>
        {active && (
          <div className="sheet-in">
            <button className="sheet-close" onClick={closeSheet} aria-label={t.close}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="sheet-scroll">
              <div className="sheet-grid">
                <div className="sheet-art">
                  {active.tag && <span className="ptag">{active.tag[lang]}</span>}
                  <Gallery key={active.id} p={active} t={t} lang={lang} />
                </div>
                <div className="sheet-info">
                  <p className="eyebrow">{active.brand === "iphone" ? "iPhone" : "Galaxy"}</p>
                  <h3 id="sheet-title" className="sheet-title" dir="ltr">{active.name}</h3>
                  <div className="sheet-opts">
                    <span className="opt"><i style={{ background: active.hex }} />{active.color[lang]}</span>
                    <span className="opt" dir="ltr">{active.storage}</span>
                  </div>
                  <div className="sheet-price">
                    <span>{t.priceNote}</span>
                    <a className="btn btn-dark" href={wa(priceMsg(active))} target="_blank" rel="noopener"><WaIcon /> {t.askPrice}</a>
                  </div>
                  <h4 className="spec-title">{t.specsTitle}</h4>
                  <dl className="spec-list">
                    <div><dt>{t.labels.color}</dt><dd>{active.color[lang]}</dd></div>
                    <div><dt>{t.labels.storage}</dt><dd dir="ltr" className="ltr-val">{active.storage}</dd></div>
                    {specKeys.map((k) => (
                      <div key={k}><dt>{t.labels[k]}</dt><dd>{active.specs[k][lang]}</dd></div>
                    ))}
                  </dl>
                  <p className="sheet-note">{t.sheetNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
