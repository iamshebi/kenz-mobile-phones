import Image from "next/image";
import Motion from "./Motion";
import Icon from "./Icon";
import Collection from "./Collection";
import { Header, Footer, WaIcon } from "./Chrome";
import AccessoryTeaser from "./AccessoryTeaser";
import { withShop } from "./shopContent";
import { site, wa, brands } from "./content";

const d = (i) => ({ "--d": `${i * 90}ms` });

const Title = ({ a, b }) => (<>{a}<span className="mark-hl">{b}</span></>);

export default function Home({ t: base }) {
  const t = withShop(base);
  const isAr = t.lang === "ar";

  return (
    <>
      <Motion />
      <Header t={t} page="home" />

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="grid-lines" aria-hidden="true" />
          <div className="wrap hero-center">
            <div className="mark load" style={d(0)}>
              <div className="halo h1" /><div className="halo h2" /><div className="halo h3" />
              <Image src="/logo-mark.png" alt={isAr ? "شعار كنز للهواتف المتحركة" : "KENZ Mobile Phones logo"} width={684} height={829} priority sizes="140px" />
            </div>
            <p className="eyebrow center load" style={d(1)}>{t.hero.location}</p>
            <h1 className="load" style={d(2)}>
              {t.hero.title1}<br /><span className="mark-hl">{t.hero.title2}</span>
            </h1>
            <p className="lead load" style={d(3)}>
              {t.hero.leadA}<strong>{t.hero.leadB}</strong>{t.hero.leadC}
            </p>
            <div className="cta center load" style={d(4)}>
              <a className="btn btn-dark" href={wa(t.hero.waMsg)}><WaIcon /> {t.hero.cta1}</a>
              <a className="btn btn-line" href="#collection">{t.hero.cta2}</a>
            </div>
            <ul className="facts load" style={d(5)}>
              {t.hero.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
          <a href="#premium" className="scroll-cue" aria-label={t.hero.scroll}><span /></a>
        </section>

        {/* BRAND MARQUEE */}
        <section className="marquee" aria-label={t.brandsAria} dir="ltr">
          <div className="track">
            {[...brands, ...brands, ...brands].map((b, i) => <span key={i}>{b}<i /></span>)}
          </div>
        </section>

        {/* PREMIUM */}
        <section id="premium" className="sec">
          <div className="wrap premium">
            <div className="premium-copy" data-reveal>
              <p className="eyebrow">{t.premium.eyebrow}</p>
              <h2><Title a={t.premium.title1} b={t.premium.title2} /></h2>
              <p className="sub">{t.premium.text}</p>
              <div className="cta">
                <a className="btn btn-dark" href="#collection">{t.premium.cta}</a>
              </div>
            </div>
            <div className="premium-lines">
              {t.premium.lines.map((l, i) => (
                <a className="pline" key={l.name} href={wa(`${t.premium.waMsg}${l.name}`)} data-reveal style={d(i)}>
                  <span className="pnum">0{i + 1}</span>
                  <div><h3>{l.name}</h3><p>{l.note}</p></div>
                  <span className="parrow" aria-hidden="true">{t.arrow}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="wrap">
            <div className="quality">
              {t.premium.quality.map((q, i) => (
                <div className="q-item" key={q.title} data-reveal style={d(i)}>
                  <span className="q-dot"><Icon name="check" size={15} /></span>
                  <h3>{q.title}</h3>
                  <p>{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COLLECTION */}
        <Collection t={t.collection} lang={t.lang} />

        {/* ACCESSORIES TEASER */}
        <AccessoryTeaser t={t} />

        {/* HIGHLIGHTS */}
        <section className="hl-sec">
          <div className="wrap hl">
            {t.highlights.map((h, i) => (
              <div className="hl-item" key={h.title} data-reveal style={d(i)}>
                <Icon name={h.icon} size={22} />
                <div><b>{h.title}</b><span>{h.text}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="sec">
          <div className="wrap">
            <div className="head" data-reveal>
              <p className="eyebrow">{t.services.eyebrow}</p>
              <h2><Title a={t.services.title1} b={t.services.title2} /></h2>
              <p className="sub">{t.services.text}</p>
            </div>

            <div className="svc-label" data-reveal><span className="tag">{t.services.hwTag}</span><p>{t.services.hwText}</p></div>
            <div className="grid3">
              {t.hardware.map((r, i) => (
                <article className="card svc" key={r.title} data-reveal style={d(i % 3)}>
                  <div className="ico"><Icon name={r.icon} /></div>
                  <h3>{r.title}</h3>
                  <ul>{r.points.map((p) => <li key={p}><Icon name="check" size={14} />{p}</li>)}</ul>
                  <a className="more" href={wa(t.services.quoteMsg(r.title))}>{t.services.quote} <span>{t.arrow}</span></a>
                </article>
              ))}
            </div>

            <div className="svc-label" data-reveal><span className="tag">{t.services.swTag}</span><p>{t.services.swText}</p></div>
            <div className="grid4">
              {t.software.map((r, i) => (
                <article className="card svc" key={r.title} data-reveal style={d(i)}>
                  <div className="ico"><Icon name={r.icon} /></div>
                  <h3>{r.title}</h3>
                  <ul>{r.points.map((p) => <li key={p}><Icon name="check" size={14} />{p}</li>)}</ul>
                  <a className="more" href={wa(t.services.askMsg(r.title))}>{t.services.ask} <span>{t.arrow}</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PICKUP + TRADE-IN */}
        <section className="sec tight">
          <div className="wrap duo">
            <article className="feature dark" data-reveal>
              <div className="ico y"><Icon name="pickup" size={24} /></div>
              <p className="eyebrow">{t.pickup.eyebrow}</p>
              <h3 className="fh">{t.pickup.title}</h3>
              <p>{t.pickup.text}</p>
              <a className="btn btn-yellow sm" href={wa(t.pickup.waMsg)}>{t.pickup.cta}</a>
            </article>
            <article className="feature" data-reveal style={d(1)}>
              <div className="ico"><Icon name="swap" size={24} /></div>
              <p className="eyebrow">{t.trade.eyebrow}</p>
              <h3 className="fh">{t.trade.title}</h3>
              <p>{t.trade.text}</p>
              <a className="btn btn-line sm" href={wa(t.trade.waMsg)}>{t.trade.cta}</a>
            </article>
          </div>
        </section>

        {/* PROCESS */}
        <section className="sec alt">
          <div className="wrap">
            <div className="head center" data-reveal>
              <p className="eyebrow center">{t.process.eyebrow}</p>
              <h2><Title a={t.process.title1} b={t.process.title2} /></h2>
            </div>
            <ol className="steps">
              {t.process.steps.map((s, i) => (
                <li key={s.title} data-reveal style={d(i)}>
                  <span className="num">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PROMISE */}
        <section id="promise" className="sec">
          <div className="wrap">
            <div className="head" data-reveal>
              <p className="eyebrow">{t.promise.eyebrow}</p>
              <h2><Title a={t.promise.title1} b={t.promise.title2} /></h2>
              <p className="sub">{t.promise.text}</p>
            </div>
            <div className="grid4">
              {t.promise.items.map((p, i) => (
                <article className="card promise" key={p.title} data-reveal style={d(i)}>
                  <div className="ico y"><Icon name={p.icon} size={24} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRIVACY */}
        <section className="sec privacy-sec">
          <div className="wrap privacy">
            <div className="lock-art" data-reveal>
              <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
              <div className="lock-core"><Icon name="lock" size={46} /></div>
            </div>
            <div data-reveal style={d(1)}>
              <p className="eyebrow">{t.privacy.eyebrow}</p>
              <h2><Title a={t.privacy.title1} b={t.privacy.title2} /></h2>
              <ul className="checks">
                {t.privacy.points.map((p) => (
                  <li key={p}><Icon name="shield" size={19} /><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* STORE */}
        <section id="shop" className="sec">
          <div className="wrap">
            <div className="head" data-reveal>
              <p className="eyebrow">{t.store.eyebrow}</p>
              <h2><Title a={t.store.title1} b={t.store.title2} /></h2>
              <p className="sub">{t.store.text}</p>
            </div>
            <div className="grid4">
              {t.store.items.map((p, i) => (
                <article className="card" key={p.title} data-reveal style={d(i % 4)}>
                  <div className="ico sm"><Icon name={p.icon} size={19} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PAY */}
        <section className="sec tight">
          <div className="wrap pay" data-reveal>
            <div>
              <p className="eyebrow">{t.pay.eyebrow}</p>
              <h2><Title a={t.pay.title1} b={t.pay.title2} /></h2>
              <p className="sub">{t.pay.text}</p>
            </div>
            <div className="pay-badges">
              {t.pay.badges.map((b) => <span className="badge" key={b}>{b}</span>)}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec">
          <div className="wrap narrow">
            <div className="head" data-reveal>
              <p className="eyebrow">{t.faq.eyebrow}</p>
              <h2><Title a={t.faq.title1} b={t.faq.title2} /></h2>
            </div>
            {t.faq.items.map((f, i) => (
              <details key={f.q} data-reveal style={d(i % 4)}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* VISIT */}
        <section id="visit" className="sec alt">
          <div className="wrap visit">
            <div data-reveal>
              <p className="eyebrow">{t.visit.eyebrow}</p>
              <h2>{t.visit.name}</h2>
              <p className="alt-name" lang={t.visit.altLang} dir={t.visit.altLang === "ar" ? "rtl" : "ltr"}>{t.visit.altName}</p>
              <dl>
                <dt>{t.visit.addressLabel}</dt>
                <dd>{t.visit.address}</dd>
                <dt>{t.visit.hoursLabel}</dt>
                <dd>{t.visit.hours}</dd>
                <dt>{t.visit.phoneLabel}</dt>
                <dd><a href={`tel:${site.phoneIntl}`} dir="ltr">{site.phoneDisplay}</a></dd>
              </dl>
              <div className="cta">
                <a className="btn btn-dark" href={wa(t.visit.waMsg)}><WaIcon /> {t.visit.wa}</a>
                <a className="btn btn-line" href={site.mapsLink} target="_blank" rel="noopener">{t.visit.directions}</a>
              </div>
            </div>
            <div className="map-wrap" data-reveal style={d(1)}>
              <iframe
                className="map"
                src={`${site.mapEmbed}&hl=${t.lang}`}
                title={t.visit.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} page="home" />
    </>
  );
}
