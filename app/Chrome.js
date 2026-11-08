// Shared site chrome: header, mobile menu, footer, floating WhatsApp button.
import "./shop.css";
import Image from "next/image";
import Icon from "./Icon";
import { site, wa } from "./content";

export const WaIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" fill="currentColor">
    <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/>
  </svg>
);

const LangSwitch = ({ t, href, className = "" }) => (
  <a className={`lang-switch ${className}`} href={href} hrefLang={t.lang === "en" ? "ar" : "en"} aria-label={t.switchAria} lang={t.lang === "en" ? "ar" : "en"}>
    <Icon name="globe" size={16} />
    <span>{t.switchLabel}</span>
  </a>
);

const BrandName = ({ t }) => (
  <span className="brand-name">{t.lang === "ar" ? <b>كنز</b> : <b>KENZ</b>} {t.brandSuffix}</span>
);

// page: "home" or "accessories"
export function links(t, page) {
  const home = page === "home" ? "" : t.lang === "ar" ? "/ar" : "/";
  const acc = t.lang === "ar" ? "/ar/accessories" : "/accessories";
  return [
    { href: `${home}#collection`, label: t.nav.premium },
    { href: acc, label: t.nav.accessories, active: page === "accessories" },
    { href: `${home}#services`, label: t.nav.services },
    { href: `${home}#promise`, label: t.nav.why },
    { href: `${home}#visit`, label: t.nav.visit },
  ];
}

export function Header({ t, page = "home" }) {
  const isAr = t.lang === "ar";
  const switchHref = page === "accessories" ? (isAr ? "/accessories" : "/ar/accessories") : t.switchHref;
  const homeHref = page === "home" ? "#top" : isAr ? "/ar" : "/";
  const items = links(t, page);
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header className="nav">
        <div className="wrap nav-in">
          <a href={homeHref} className="brand" aria-label={isAr ? "كنز للهواتف المتحركة، الصفحة الرئيسية" : "KENZ Mobile Phones, home"}>
            <Image src="/logo-mark-sm.png" alt="" width={79} height={96} priority className="nav-mark" />
            <BrandName t={t} />
          </a>
          <nav className="links" aria-label={isAr ? "القائمة الرئيسية" : "Main"}>
            {items.map((l) => <a key={l.href} href={l.href} className={l.active ? "is-active" : undefined} aria-current={l.active ? "page" : undefined}>{l.label}</a>)}
          </nav>
          <div className="nav-actions">
            <LangSwitch t={t} href={switchHref} />
            <a className="btn btn-dark sm nav-call" href={`tel:${site.phoneIntl}`}>{t.nav.call}</a>
            <button className="menu-btn" aria-label={t.nav.menuOpen} aria-expanded="false"><span /></button>
          </div>
        </div>
      </header>
      <div className="mobile-menu" aria-hidden="true">
        {items.map((l) => <a key={l.href} className="m-link" href={l.href}>{l.label}</a>)}
        <a className="btn btn-dark" href={`tel:${site.phoneIntl}`}>{t.nav.callFull} <span dir="ltr">{site.phoneDisplay}</span></a>
      </div>
    </>
  );
}

export function Footer({ t, page = "home" }) {
  const isAr = t.lang === "ar";
  const switchHref = page === "accessories" ? (isAr ? "/accessories" : "/ar/accessories") : t.switchHref;
  return (
    <>
      <footer className="foot">
        <div className="wrap foot-in">
          <div className="brand">
            <Image src="/logo-mark-sm.png" alt="" width={79} height={96} className="nav-mark" />
            <BrandName t={t} />
          </div>
          <span className="muted">© {new Date().getFullYear()} · {t.footer.location}</span>
          <span className="muted small">{t.footer.hours} · <span dir="ltr">{site.phoneDisplay}</span></span>
          <LangSwitch t={t} href={switchHref} className="foot-switch" />
        </div>
      </footer>
      <a className="float-wa" href={wa(t.visit.waMsg)} aria-label={t.floatAria}><WaIcon size={24} /></a>
    </>
  );
}
