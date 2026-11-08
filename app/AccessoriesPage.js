import Motion from "./Motion";
import Shop from "./Shop";
import { Header, Footer } from "./Chrome";
import { withShop } from "./shopContent";

export default function AccessoriesPage({ t: base }) {
  const t = withShop(base);
  const s = t.shop;
  return (
    <>
      <Motion />
      <Header t={t} page="accessories" />
      <main id="top">
        <section className="page-hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="wrap">
            <p className="eyebrow load" style={{ "--d": "0ms" }}>{s.eyebrow}</p>
            <h1 className="load" style={{ "--d": "90ms" }}>{s.title1}<span className="mark-hl">{s.title2}</span></h1>
            <p className="lead load" style={{ "--d": "180ms" }}>{s.text}</p>
          </div>
        </section>
        <Shop t={s} lang={t.lang} />
      </main>
      <Footer t={t} page="accessories" />
    </>
  );
}
