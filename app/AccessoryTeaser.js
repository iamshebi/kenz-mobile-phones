import "./cards.css";
import { categories, accessories } from "./accessories";

const FEATURED = ["apple", "samsung", "huawei", "audio", "chargers", "car", "power", "fragrance"];

export default function AccessoryTeaser({ t }) {
  const s = t.shop;
  const base = t.lang === "ar" ? "/ar/accessories" : "/accessories";
  const cats = FEATURED.map((k) => categories.find((c) => c.key === k));
  return (
    <section id="accessories" className="sec acc-teaser">
      <div className="wrap">
        <div className="head teaser-head" data-reveal>
          <div>
            <p className="eyebrow">{s.teaser.eyebrow}</p>
            <h2>{s.teaser.title1}<span className="mark-hl">{s.teaser.title2}</span></h2>
            <p className="sub">{s.teaser.text}</p>
          </div>
          <a className="btn btn-dark" href={base}>{s.teaser.cta} <span aria-hidden="true">{t.arrow}</span></a>
        </div>
        <div className="cat-grid">
          {cats.map((c, i) => {
            const n = accessories.filter((a) => a.cat === c.key).length;
            return (
              <a className="cat-tile" key={c.key} href={`${base}?cat=${c.key}`} data-reveal style={{ "--d": `${(i % 4) * 80}ms` }}>
                <span className="cat-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="cat-meta">
                  <h3>{c[t.lang]}</h3>
                  <span>{n} {s.teaser.items}</span>
                </div>
                <span className="cat-arrow" aria-hidden="true">{t.arrow}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
