// Page frame: intro curtain, header, mobile menu, footer and the motion script.
import Fx from "./Fx";
import { T, wa, path } from "./ui";
import { site } from "./content";
import { departments } from "./catalog";
import { WaIcon } from "./kit";
import { MegaMenu, Search } from "./Nav";
import Pay from "./Pay";

const Logo = ({ t }) => (
  <a className="logo" href={path(t.lang)} aria-label={t.brandFull}>
    <img src="/logo-mark-sm.png" alt="" width="25" height="30" />
    <span><b>{t.brand}</b><small>{t.brandSub}</small></span>
  </a>
);

// alt: the same page in the other language
export default function Site({ lang, page, alt, children }) {
  const t = T[lang];
  const nav = [[path(lang, "/#services"), t.services], [path(lang, "/shop"), t.shop, "shop"], [path(lang, "/#genuine"), t.why], [path(lang, "/#visit"), t.visit]];
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "try{if(sessionStorage.getItem('kz-seen'))document.documentElement.classList.add('seen');sessionStorage.setItem('kz-seen','1')}catch(e){}" }} />
      <div className="curtain" aria-hidden="true"><img src="/logo-mark.png" alt="" /></div>
      <header id="hd">
        <div className="w bar">
          <Logo t={t} />
          <nav className="nv" aria-label={t.menu}>{nav.map((n) => n[2] === "shop" ? <MegaMenu key={n[0]} lang={lang} label={n[1]} active={page === "shop"} /> : <a key={n[0]} href={n[0]}>{n[1]}</a>)}</nav>
          <div className="hr">
            <Search lang={lang} />
            <a className="lang" href={alt} hrefLang={t.other} lang={t.other}>{t.otherLabel}</a>
            <a className="btn dk sm" target="_blank" rel="noopener" href={wa(t.waHi)}><WaIcon /><span>{t.msg}</span></a>
            <button className="burger" id="bg" aria-label={t.menu} aria-expanded="false"><i /></button>
          </div>
        </div>
      </header>
      <div className="mnav" id="mnav">
        {nav.map((n) => <a key={n[0]} href={n[0]}>{n[1]}</a>)}
        <a className="btn gd" target="_blank" rel="noopener" href={wa(t.waHi)}><WaIcon />{t.msg}</a>
      </div>
      <main id="app">{children}</main>
      <footer>
        <div className="w">
          <div className="fg">
            <div><Logo t={t} /><p className="big">{t.fBig}</p></div>
            <div><h5>{t.fShop}</h5>{departments.slice(0, 6).map((d) => <a key={d.id} href={path(lang, `/shop?d=${d.id}`)}>{d[lang]}</a>)}</div>
            <div><h5>{t.fStore}</h5><a href={path(lang, "/#services")}>{t.services}</a><a href={path(lang, "/#visit")}>{t.visit}</a><a href={site.mapsLink} target="_blank" rel="noopener">{t.dir}</a><span className="fh">{t.hours}</span></div>
            <div><h5>{t.waL}</h5><a href={wa(t.waHi)} target="_blank" rel="noopener" dir="ltr">{site.phoneDisplay}</a><a href={`tel:${site.phoneIntl}`}>{t.callL}</a><span className="fh">{t.pay}</span></div>
          </div>
          <Pay lang={lang} variant="foot" />
          <div className="huge" aria-hidden="true">KENZ</div>
          <div className="fb"><span>© {new Date().getFullYear()} {t.brandFull} · {t.addr}</span><span>{t.rights}</span></div>
        </div>
      </footer>
      <a className="fwa" href={wa(t.waHi)} target="_blank" rel="noopener" aria-label={t.msg}><WaIcon /></a>
      <Fx />
    </>
  );
}
