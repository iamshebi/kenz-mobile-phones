import Site from "./Site";
import { ogImage } from "./meta";
import { T, path } from "./ui";
import { site } from "./content";
import { items, byId, catName, deptOf, full, hasPr } from "./catalog";
import { Card, Ico, Arrow, WaIcon, Lines, Visual, waP, waBuy, BUY, Price, StChip, stLabel } from "./kit";
import Pay from "./Pay";

const SPEC = ["display", "chip", "camera", "front", "battery", "build"];

export function productMeta(id, lang) {
  const p = byId(id);
  if (!p) return {};
  const t = T[lang], name = full(p), desc = `${name}${p.d[lang] ? ` · ${p.d[lang]}` : ""}. ${hasPr(p) ? t.pNoteP : t.pNote}`;
  const url = path(lang, `/product/${p.id}`);
  return {
    title: `${name} · ${t.brandFull} · ${lang === "ar" ? "رأس الخيمة" : "Ras Al Khaimah"}`,
    description: desc,
    alternates: { canonical: url, languages: { en: `/product/${p.id}`, ar: `/ar/product/${p.id}` } },
    openGraph: { title: name, description: desc, images: [p.img || ogImage(lang)], locale: lang === "ar" ? "ar_AE" : "en_AE" },
  };
}

export default function Product({ id, lang }) {
  const t = T[lang], p = byId(id), isAr = lang === "ar";
  const alt = isAr ? `/product/${id}` : `/ar/product/${id}`;
  if (!p) return <Site lang={lang} page="shop" alt={alt}><div className="w"><div className="shead"><h1>{t.nf}</h1><div className="sub"><a className="btn dk" href={path(lang, "/shop")}>{t.back}</a></div></div></div></Site>;
  const dep = deptOf(p.c);
  const rel = [...items.filter((i) => i.c === p.c && i.id !== p.id), ...items.filter((i) => i.c !== p.c && dep.cats.includes(i.c))]
    .sort((a, b) => (b.img ? 1 : 0) - (a.img ? 1 : 0)).slice(0, 10);
  const views = p.views && p.views.length > 1 ? p.views : null;
  const pr = hasPr(p);
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: full(p), image: p.img ? `${site.url}${p.img}` : undefined,
    brand: p.b ? { "@type": "Brand", name: p.b } : undefined, description: p.d.en, category: catName(p.c, "en"),
    url: `${site.url}${path(lang, `/product/${p.id}`)}`,
    offers: pr ? { "@type": "Offer", price: p.pr.toFixed(2), priceCurrency: "AED", availability: `https://schema.org/${p.st === "out" ? "OutOfStock" : p.st === "soon" ? "PreOrder" : "InStock"}`, url: `${site.url}${path(lang, `/product/${p.id}`)}` } : undefined,
  };
  return (
    <Site lang={lang} page="shop" alt={alt}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="w">
        <div className="pdp" data-gal>
          <div className="pg">
            <div className="pim rv in"><Visual p={p} big lang={lang} />{p.st ? <StChip p={p} lang={lang} /> : <>{p.tag && <span className="chip">{p.tag[lang]}</span>}{p.genuine && <span className="chip y">{t.genuine}</span>}</>}</div>
            {views && <div className="th">{views.map((v, i) => <button key={v.v} data-src={v.src} className={i === 0 ? "on" : undefined} aria-label={t.views[v.v]}><img src={v.src} alt="" loading="lazy" /><span>{t.views[v.v]}</span></button>)}</div>}
          </div>
          <div className="pin2">
            <div className="crumb rv in"><a href={path(lang, "/shop")}>{t.shop}</a><span>/</span><a href={path(lang, `/shop?d=${dep.id}`)}>{dep[lang]}</a><span>/</span><a href={path(lang, `/shop?c=${p.c}`)}>{catName(p.c, lang)}</a></div>
            <div className="br rv in" style={{ "--d": ".05s" }}>{p.b || catName(p.c, lang)}</div>
            <h1><Lines arr={[p.n]} /></h1>
            {p.d[lang] && <p className="det rv in" style={{ "--d": ".25s" }}>{p.hex && <i className="sw" style={{ background: p.hex }} />}{p.d[lang]}</p>}
            {pr && <div className="pprice rv in" style={{ "--d": ".28s" }}><Price p={p} lang={lang} className="big" /></div>}
            {pr ? <div className="row pb3 rv in" style={{ "--d": ".32s" }}>
              <a className="btn gd" target="_blank" rel="noopener" href={waBuy(p, lang)}><WaIcon /><span className="lg">{BUY[lang].bl}</span><span className="bs">{BUY[lang].b}</span></a>
              <a className="btn lt" target="_blank" rel="noopener" href={waP(p, lang)}><span className="lg">{t.enqL}</span><span className="bs">{t.enq}</span></a>
              <a className="btn lt" href={`tel:${site.phoneIntl}`}><span className="lg">{t.callUs}</span><span className="bs">{t.callS}</span></a>
            </div> : <div className="row rv in" style={{ "--d": ".32s" }}>
              <a className="btn gd" target="_blank" rel="noopener" href={waP(p, lang)}><WaIcon />{t.enqL}</a>
              <a className="btn lt" href={`tel:${site.phoneIntl}`}>{t.callUs}</a>
            </div>}
            <div className="rv in" style={{ "--d": ".36s" }}><Pay lang={lang} variant="pdp" product={full(p)} /></div>
            <div className="note rv in" style={{ "--d": ".4s" }}><Ico k="info" sw={1.5} /><span>{pr ? t.pNoteP : t.pNote}</span></div>
            <ul className="spec rv in" style={{ "--d": ".48s" }}>
              {p.b && <li><span>{t.pBrand}</span><a href={path(lang, `/shop?b=${encodeURIComponent(p.b)}`)}>{p.b}</a></li>}
              {p.color && <li><span>{t.pColor}</span><span>{p.color[lang]}</span></li>}
              {p.storage && <li><span>{t.pStorage}</span><span dir="ltr">{p.storage}</span></li>}
              <li><span>{t.pCat}</span><a href={path(lang, `/shop?c=${p.c}`)}>{catName(p.c, lang)}</a></li>
              <li><span>{t.pAv}</span><span>{stLabel(p, lang) || t.pAvV}</span></li>
              <li><span>{t.pDel}</span><span>{t.pDelV}</span></li>
              <li><span>{t.pPay}</span><span>{t.pPayV}</span></li>
            </ul>
            {p.specs && <>
              <h2 className="specT rv">{t.specT}</h2>
              <ul className="spec specs rv">{SPEC.map((k) => <li key={k}><span>{t.specs[k]}</span><span>{p.specs[k][lang]}</span></li>)}</ul>
            </>}
          </div>
        </div>
        {rel.length > 0 && <section className="sec">
          <div className="sh"><div><span className="eyb rv">{t.rel}</span><h2 className="rv" style={{ "--d": ".08s" }}>{catName(p.c, lang)}</h2></div>
            <div className="shr"><a className="lk rv" href={path(lang, `/shop?c=${p.c}`)}>{t.shop} <Arrow /></a>
              <div className="sbt rv" data-for="rel"><button data-s="-1" aria-label="Previous"><Ico k="left" sw={1.5} /></button><button data-s="1" aria-label="Next"><Ico k="right" sw={1.5} /></button></div></div></div>
          <div className="scr rv" id="rel">{rel.map((r, i) => <Card key={r.id} p={r} i={i} lang={lang} />)}</div>
        </section>}
      </div>
    </Site>
  );
}
