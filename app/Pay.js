// Buy now, pay later: official Tabby badge (Tabby brand assets) + official Tamara badge (Tamara CDN).
import TamaraLogoC from "./TamaraLogo";
import { T, wa } from "./ui";

export const TabbyLogo = ({ h = 26 }) => <img className="pl-tabby" src="/pay/tabby.svg" alt="tabby" height={h} width={Math.round(h * 2.54)} />;
export const TamaraLogo = ({ h = 26 }) => <TamaraLogoC h={h} />;

// variant: "band" (home), "pdp" (product page), "foot" (footer line)
export default function Pay({ lang, variant = "band", product }) {
  const t = T[lang].pay2;
  if (variant === "foot") return (
    <div className="pl-foot"><span>{t.foot}</span><TabbyLogo h={24} /><TamaraLogo h={24} /></div>
  );
  if (variant === "strip") return (
    <div className="w"><div className="pl-strip"><div className="pl-logos"><TabbyLogo h={24} /><TamaraLogo h={24} /></div><p><b>{t.title}</b> {t.pdp}</p><a className="lk" target="_blank" rel="noopener" href={wa(t.waHi)}>{t.ask}</a></div></div>
  );
  if (variant === "pdp") return (
    <div className="pl-pdp">
      <div className="pl-logos"><TabbyLogo h={26} /><TamaraLogo h={26} /></div>
      <p><b>{t.title}</b> {t.pdp}</p>
      <a className="lk" target="_blank" rel="noopener" href={wa(t.waP(product))}>{t.ask}</a>
    </div>
  );
  return (
    <section className="sec"><div className="w"><div className="pl-band rv">
      <div className="pl-copy"><span className="eyb">{t.eyb}</span><h2>{t.title}</h2><p>{t.text}</p>
        <a className="btn dk" target="_blank" rel="noopener" href={wa(t.waHi)}>{t.ask}</a><small className="pl-note">{t.note}</small></div>
      <div className="pl-cards">
        <div className="pl-card"><TabbyLogo h={40} /><b>{t.tabby[0]}</b><small>{t.tabby[1]}</small></div>
        <div className="pl-card"><TamaraLogo h={40} /><b>{t.tamara[0]}</b><small>{t.tamara[1]}</small></div>
      </div>
    </div></div></section>
  );
}
