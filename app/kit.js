// Small shared pieces used by server pages and the client shop: icons, product card, WhatsApp links.
import { T, wa, path } from "./ui";
import { site } from "./content";
import { catName, full, hasPr, fmtPr } from "./catalog";

const P = {
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M10.5 5h3"/>',
  badge: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 8 5-3 5 3-1.5-8"/><path d="m9.6 9 1.6 1.6 3.2-3.2"/>',
  head: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6.5" rx="1.6"/><rect x="17" y="14" width="4" height="6.5" rx="1.6"/>',
  buds: '<path d="M7.5 5a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3"/><path d="M7.5 5a3 3 0 0 0-1 5.8V19a1.2 1.2 0 0 0 2.4 0v-6"/><path d="M16.5 5a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3"/><path d="M16.5 5a3 3 0 0 1 1 5.8V19a1.2 1.2 0 0 1-2.4 0v-6"/>',
  watch: '<rect x="6.5" y="6.5" width="11" height="11" rx="3"/><path d="M9 6.5 9.6 2.5h4.8l.6 4M9 17.5l.6 4h4.8l.6-4M12 9.5V12l1.6 1.2"/>',
  bank: '<rect x="6" y="3" width="12" height="18" rx="2.4"/><path d="M12.8 7.5 10.5 12h3l-2.3 4.5"/>',
  plug: '<path d="M9 2.5v5M15 2.5v5"/><path d="M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 16v5.5"/>',
  car: '<path d="M4 15.5 5.6 9.8A2 2 0 0 1 7.5 8.3h9a2 2 0 0 1 1.9 1.5L20 15.5"/><rect x="3" y="15.5" width="18" height="4" rx="1.4"/><circle cx="7" cy="17.5" r=".6"/><circle cx="17" cy="17.5" r=".6"/>',
  cable: '<path d="M7 2.5v4M10 2.5v4"/><rect x="5.5" y="6.5" width="6" height="4.5" rx="1"/><path d="M8.5 11v3.5a3.5 3.5 0 0 0 7 0V10"/><rect x="13.5" y="5.5" width="4" height="4.5" rx="1"/><path d="M15.5 3v2.5"/>',
  shield: '<path d="M12 2.5 19.5 5v6c0 5-3.4 8.6-7.5 10.5C7.9 19.6 4.5 16 4.5 11V5z"/><path d="m9 11.8 2.2 2.2L15.2 10"/>',
  stand: '<path d="M8 3h8l-1 11H9z"/><path d="M12 14v5M7 21h10"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19 13 11"/>',
  smoke: '<path d="M7 21h10M8.5 21l1-6h5l1 6"/><path d="M12 12c-2-2 2-3 0-5s2-3 0-4.5"/>',
  cam: '<rect x="2.5" y="6.5" width="19" height="13" rx="2.5"/><path d="M8 6.5 9.5 4h5L16 6.5"/><circle cx="12" cy="13" r="3.8"/>',
  game: '<path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.5l-.8 3.4a2.4 2.4 0 0 1-4.2 1L15 16H9l-1.4 1.4a2.4 2.4 0 0 1-4.2-1L2.6 13A4.5 4.5 0 0 1 7 7.5z"/><path d="M7.5 10.5v3M6 12h3"/><circle cx="16" cy="11" r=".7"/><circle cx="17.5" cy="13" r=".7"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
  pickup: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
};
const CI = { iphone: "phone", galaxy: "phone", apple: "plug", samsung: "buds", huawei: "buds", audio: "head", chargers: "plug", car: "car", power: "bank", cables: "cable", stands: "stand", watches: "watch", protection: "shield", fragrance: "smoke", care: "spark", creator: "cam", tech: "game" };

export const Ico = ({ k, sw = 1.2, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: P[k] || P.spark }} />
);
export const Arrow = () => <svg className="ar" viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: P.arrow }} />;
export const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z" /></svg>
);
export const catIcon = (c) => CI[c] || "spark";

// Rich-text bits from ui.js (only <em> is used)
export const H = ({ as: Tag = "span", html, ...rest }) => <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
export const Lines = ({ arr, base = 0.15 }) => arr.map((s, i) => (
  <span className="ln" key={i} style={{ "--d": `${base + i * 0.1}s` }}><span dangerouslySetInnerHTML={{ __html: s }} /></span>
));

export const purl = (p, lang) => `${site.url}${path(lang, `/product/${p.id}`)}`;
export const href = (p, lang) => path(lang, `/product/${p.id}`);

// WhatsApp enquiry with the product's details prefilled (fully in the page language)
const L = {
  en: { col: "Colour", sto: "Storage", chip: "Chip", disp: "Display", cam: "Camera", br: "Brand", det: "Details", cat: "Category" },
  ar: { col: "اللون", sto: "السعة", chip: "المعالج", disp: "الشاشة", cam: "الكاميرا", br: "الماركة", det: "التفاصيل", cat: "الفئة" },
};
export function waP(p, lang) {
  const t = T[lang], l = L[lang], cat = catName(p.c, lang);
  const lines = p.k === "phone" && p.specs
    ? [p.color ? `${l.col}: ${p.color[lang]}` : p.d[lang] && `${l.det}: ${p.d[lang]}`, p.storage && `${l.sto}: ${p.storage}`, `${l.chip}: ${p.specs.chip[lang]}`, `${l.disp}: ${p.specs.display[lang]}`, `${l.cam}: ${p.specs.camera[lang]}`].filter(Boolean)
    : [p.b && `${l.br}: ${p.b}`, p.d[lang] && `${l.det}: ${p.d[lang]}`, `${l.cat}: ${cat}`].filter(Boolean);
  return wa(t.waP({ name: full(p), lines }, purl(p, lang)));
}

// Buy now: WhatsApp order message with the price
export const BUY = {
  en: { b: "Buy now", bl: "Buy now on WhatsApp", m: (n, d, pr, u) => ["Hello KENZ Mobile Phones 👋", "I'd like to buy:", "", `• ${n}`, ...(d ? [`• ${d}`] : []), `• Price: ${pr}`, "", "Please confirm availability, payment and delivery or pickup.", u].join("\n") },
  ar: { b: "اشترِ الآن", bl: "اشترِ الآن عبر واتساب", m: (n, d, pr, u) => ["مرحباً كنز للهواتف المتحركة 👋", "أود شراء:", "", `• ${n}`, ...(d ? [`• ${d}`] : []), `• السعر: ${pr}`, "", "يرجى تأكيد التوفر وطريقة الدفع والتوصيل أو الاستلام.", u].join("\n") },
};
export const waBuy = (p, lang) => wa(BUY[lang].m(full(p), p.d[lang], fmtPr(p.pr, lang), purl(p, lang)));

// "AED 1,899.00" / "1,899.00 درهم" — one plain line, same style for currency and number
export const Price = ({ p, lang, className = "" }) => hasPr(p) ? <span className={`prc ${className}`.trim()} dir={lang === "ar" ? "rtl" : "ltr"}>{fmtPr(p.pr, lang)}</span> : null;

const STL = { out: { en: "Out of stock", ar: "غير متوفر حالياً" }, soon: { en: "Coming soon", ar: "قريباً" } };
export const stLabel = (p, lang) => (p.st && STL[p.st] ? STL[p.st][lang] : "");
export const StChip = ({ p, lang, className = "" }) => p.st && STL[p.st] ? <span className={`chip st-${p.st} ${className}`.trim()}>{STL[p.st][lang]}</span> : null;

// Card / list buttons: Buy now + Enquire when priced, Enquire only otherwise
export const BuyBtns = ({ p, lang }) => hasPr(p)
  ? <><a className="wa buy" target="_blank" rel="noopener" href={waBuy(p, lang)}><WaIcon />{BUY[lang].b}</a><a className="wa" target="_blank" rel="noopener" href={waP(p, lang)}>{T[lang].enq}</a></>
  : <a className="wa" target="_blank" rel="noopener" href={waP(p, lang)}><WaIcon />{T[lang].enq}</a>;

export const Visual = ({ p, big, lang }) => p.img
  ? <img src={p.img} alt={full(p)} width="800" height="800" {...(big ? { fetchPriority: "high" } : { loading: "lazy", decoding: "async" })} />
  : <div className="ph"><Ico k={catIcon(p.c)} sw={big ? 1 : 1.1} /><b>{p.n.split(/\s+/).slice(0, 4).join(" ")}</b><small>{T[lang].photo}</small></div>;

export function Card({ p, i = 0, lang, fb }) {
  const t = T[lang], pr = hasPr(p);
  return (
    <article className={`c${p.k === "phone" ? " cp" : ""}`} style={{ "--i": i }} data-b={fb}>
      <a className="cv" href={href(p, lang)} aria-label={full(p)} />
      <div className="im"><Visual p={p} lang={lang} />
        {p.st ? <StChip p={p} lang={lang} /> : p.tag ? <span className="chip">{p.tag[lang]}</span> : p.genuine ? <span className="chip y">{t.genuine}</span> : null}
        {p.hex && <i className="sw" style={{ background: p.hex }} />}
      </div>
      <div className="bd">
        <div className="br">{p.b || catName(p.c, lang)}</div>
        <div className="nm">{p.n}</div>
        {p.d[lang] && <div className="dt">{p.d[lang]}</div>}
        <Price p={p} lang={lang} />
        <div className={`ft${pr ? " has-pr" : ""}`}>{!pr && <span className="cat">{catName(p.c, lang)}</span>}<BuyBtns p={p} lang={lang} /></div>
      </div>
    </article>
  );
}
