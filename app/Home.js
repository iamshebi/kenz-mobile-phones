import Site from "./Site";
import { T, wa, path } from "./ui";
import { content, site } from "./content";
import { items, departments, phoneList, brandCount, pick, catName, full, categories } from "./catalog";
import { Card, Ico, Arrow, WaIcon, H, Lines, href, waP } from "./kit";
import { workshop, credit } from "./workshop";

const d = (i) => ({ "--d": `${i}s` });

const HERO = ["galaxy-s26-ultra-cobalt-violet-1-tb", "iphone-18-pro-max-burgundy-2-tb", "apple-airpods-max-2", "samsung-galaxy-watch-ultra"];
const SIG = ["apple-airpods-pro-3", "samsung-galaxy-buds4-pro", "apple-airpods-max-2", "samsung-galaxy-watch-ultra", "apple-magsafe-charger-1-m", "apple-iphone-air-magsafe-battery", "samsung-galaxy-watch8", "apple-airtag-4-pack", "green-lion-qi2-2-mag-flex-3-in-1-wireless-charger", "apple-apple-pencil-usb-c", "green-lion-malaga-10000mah-magsafe-power-bank", "samsung-galaxy-smarttag2"];
const MQ = ["Apple", "Samsung", "Huawei", "Anker", "Green Lion", "oraimo", "JBL", "Mevor", "Porodo", "SAAFO", "Soundcore", "Belkin", "UGREEN", "Powerology"];

// three photos for each department tile (first ones that have a photo)
const PIN = { phones: ["iphone-18-pro-max-burgundy-2-tb", "galaxy-z-flip7-mint-256-gb", "iphone-air-sky-blue-256-gb"], genuine: ["apple-airpods-pro-3", "samsung-galaxy-buds4-pro", "apple-magsafe-charger-1-m"], wear: ["samsung-galaxy-watch-ultra", "samsung-galaxy-watch8", "green-lion-force-smart-watch"] };
const pics = (dep) => {
  const chosen = (PIN[dep.id] || []).map((id) => items.find((i) => i.id === id)).filter((p) => p && p.img);
  const rest = items.filter((i) => dep.cats.includes(i.c) && i.img && !chosen.includes(i));
  return [...chosen, ...rest].slice(0, 3);
};

export default function Home({ lang }) {
  const t = T[lang], c = content[lang], isAr = lang === "ar";
  const hero = pick(HERO);
  const count = (dep) => items.filter((i) => dep.cats.includes(i.c)).length;
  const services = [...c.hardware, ...c.software, { title: c.pickup.eyebrow, points: [c.pickup.title, c.pickup.text.split(".")[0]] }, { title: c.trade.eyebrow, points: [c.trade.title] }];
  return (
    <Site lang={lang} page="home" alt={isAr ? "/" : "/ar"}>
      {/* HERO */}
      <section className="hero"><div className="w">
        <div className="rv in">
          <span className="eyb">{t.eyb}</span>
          <h1 className="hx"><Lines arr={t.h1} /></h1>
          <p className="lead rv" style={d(0.5)}>{t.lead}</p>
          <div className="row rv" style={d(0.62)}>
            <a className="btn dk" href={path(lang, "/shop")}>{t.explore} <Arrow /></a>
            <a className="btn lt" target="_blank" rel="noopener" href={wa(t.waHi)}><WaIcon />{t.ask}</a>
          </div>
          <div className="stats rv" style={d(0.75)}>
            <div><b data-n={items.length} data-s="+">0</b><small>{t.st[0]}</small></div>
            <div><b data-n={categories.length}>0</b><small>{t.st[1]}</small></div>
            <div><b data-n={brandCount}>0</b><small>{t.st[2]}</small></div>
          </div>
        </div>
        <div className="stage rv" style={d(0.3)} id="stage">
          <div className="halo"><div className="ring" /><div className="orb" /></div>
          {hero.map((p, i) => (
            <a key={p.id} href={href(p, lang)} className={`fl f${i + 1}`} data-depth={[18, -26, 22, -14][i]} aria-label={full(p)}>
              <div><img src={p.img} alt={full(p)} {...(i < 2 ? { fetchPriority: "high" } : {})} /></div>
            </a>
          ))}
          <div className="tag"><i />{t.live}</div>
        </div>
      </div></section>

      <div className="mq" aria-hidden="true" dir="ltr"><div className="tr">{[...MQ, ...MQ].map((b, i) => <span key={i}>{b}</span>)}</div></div>

      {/* DEPARTMENTS */}
      <section className="sec" id="departments"><div className="w">
        <div className="sh"><div><span className="eyb rv">{t.depL}</span><H as="h2" className="rv" style={d(0.08)} html={t.depH} /></div><p className="rv" style={d(0.16)}>{t.depP}</p></div>
        <div className="deps">
          {departments.map((dep, i) => { const ps = pics(dep); return (
            <a key={dep.id} className="dp rv" style={d((i % 3) * 0.08)} href={path(lang, `/shop?d=${dep.id}`)}>
              <span className="n">{String(i + 1).padStart(2, "0")} — {count(dep)} {t.items}</span>
              <h3>{dep[lang]}</h3>
              <p className="ct">{dep.cats.map((k) => catName(k, lang)).join(" · ")}</p>
              {ps.length >= 2 ? <div className="pics">{ps.map((p) => <img key={p.id} src={p.img} alt="" loading="lazy" />)}</div> : <div className="glyph"><Ico k={dep.icon} sw={0.8} /></div>}
              <span className="go"><Ico k="arrow" sw={1.5} /></span>
            </a>
          ); })}
        </div>
      </div></section>

      {/* SIGNATURE */}
      <section className="sec"><div className="w">
        <div className="sh"><div><span className="eyb rv">{t.sigL}</span><H as="h2" className="rv" style={d(0.08)} html={t.sigH} /></div>
          <div className="sbt rv" data-for="scr"><button data-s="-1" aria-label="Previous"><Ico k="left" sw={1.5} /></button><button data-s="1" aria-label="Next"><Ico k="right" sw={1.5} /></button></div></div>
        <div className="scr rv" id="scr">{pick(SIG).filter((p) => p.img).map((p, i) => <Card key={p.id} p={p} i={i} lang={lang} />)}</div>
      </div></section>

      {/* PHONE WALL */}
      <section className="sec" id="phones"><div className="w">
        <div className="sh"><div><span className="eyb rv">{t.phL}</span><H as="h2" className="rv" style={d(0.08)} html={t.phH} /></div><a className="lk rv" href={path(lang, "/shop?d=phones")}>{t.phAll} <Arrow /></a></div>
        <ul className="plist">{phoneList.slice(0, 12).map((p, i) => (
          <li key={p.id} className="rv" style={d((i % 5) * 0.05)}>
            <a className="pl" href={href(p, lang)}><span className="pb">{p.b}</span><span className="pn">{p.n}</span><span className="pd">{p.d[lang]}</span></a>
            <a className="wa" target="_blank" rel="noopener" href={waP(p, lang)}><WaIcon />{t.enq}</a>
          </li>
        ))}</ul>
      </div></section>

      {/* PROMISE */}
      <section className="sec"><div className="w"><span className="eyb rv">{t.prL}</span>
        <div className="pr">{c.promise.items.map((r, i) => <div key={r.title} className="rv" style={d(i * 0.08)}><span className="k">0{i + 1}</span><h4>{r.title}</h4><p>{r.text}</p></div>)}</div>
      </div></section>

      {/* WORKSHOP */}
      <section className="sec" id="services"><div className="w">
        <div className="sh"><div><span className="eyb rv">{t.wkL}</span><H as="h2" className="rv" style={d(0.08)} html={t.wkH} /></div><p className="rv" style={d(0.16)}>{t.wkP}</p></div>
        <div className="wk">
          {workshop.map((w, i) => (
            <a key={w.key} className={`wt rv wt${i + 1}`} style={d((i % 3) * 0.08)} target="_blank" rel="noopener" href={wa(t.waS(w.msg))}>
              <img src={w.img} alt={w[lang][0]} loading="lazy" />
              <div className="wc"><span className="k">0{i + 1}</span><h3>{w[lang][0]}</h3><p>{w[lang][1]}</p><span className="wfix"><WaIcon />{t.fix}</span></div>
            </a>
          ))}
        </div>
        <p className="cred">{t.photos}: {workshop.map((w, i) => <span key={w.key}>{i ? ", " : ""}<a href={credit(w.ref)} target="_blank" rel="noopener">{w.by}</a></span>)} / <a href="https://unsplash.com/?utm_source=kenz_mobile_phones&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a></p>
      </div></section>

      {/* SERVICES BAND */}
      <div className="w"><div className="band"><div className="svc">
        <div><span className="eyb rv">{t.svL}</span><H as="h2" className="rv" style={{ marginTop: 18 }} html={t.svH} /><p className="rv">{t.svP}</p>
          <div className="row rv"><a className="btn gd" target="_blank" rel="noopener" href={wa(t.waS(t.services))}><WaIcon />{t.ask}</a><a className="btn lt" href={`tel:${site.phoneIntl}`}>{t.callUs}</a></div></div>
        <ul className="svl">{services.map((s, i) => (
          <li key={s.title} className="rv" style={d(i * 0.04)}><div><b>{s.title}</b><small>{s.points.slice(0, 2).join(" · ")}</small></div>
            <a target="_blank" rel="noopener" href={wa(t.waS(s.title))} aria-label={s.title}><Ico k="arrow" sw={1.5} /></a></li>
        ))}</ul>
      </div></div></div>

      {/* VISIT */}
      <section className="sec" id="visit"><div className="w">
        <div className="sh"><div><span className="eyb rv">{t.viL}</span><H as="h2" className="rv" style={d(0.08)} html={t.viH} /></div><p className="rv">{t.viP}</p></div>
        <div className="vis">
          <a className="map rv" href={site.mapsLink} target="_blank" rel="noopener">
            <div className="grd" /><div className="pin"><img src="/logo-mark-sm.png" alt="" /></div>
            <h3>{t.addr}</h3><span className="lk" style={{ marginTop: 14, alignSelf: "flex-start" }}>{t.dir} <Arrow /></span>
          </a>
          <div className="vc rv" style={d(0.1)}><ul className="vl">
            <li><span>{t.waL}</span><a dir="ltr" target="_blank" rel="noopener" href={wa(t.waHi)}>{site.phoneDisplay}</a></li>
            <li><span>{t.callL}</span><a dir="ltr" href={`tel:${site.phoneIntl}`}>{site.phoneDisplay}</a></li>
            <li><span>{t.hoursL}</span><b>{t.hours}</b></li>
            <li><span>{t.payL}</span><b>{t.pay}</b></li>
            <li><span>{t.dir}</span><a href={site.mapsLink} target="_blank" rel="noopener">Google Maps <Arrow /></a></li>
          </ul></div>
        </div>
      </div></section>
    </Site>
  );
}

