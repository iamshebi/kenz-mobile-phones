// Buy now, pay later: official Tabby badge + Tamara (official logo file when /public/pay/tamara.svg exists).
import fs from "fs";
import nodePath from "path";
import { T, wa } from "./ui";

const hasTamara = (() => { try { return fs.existsSync(nodePath.join(process.cwd(), "public/pay/tamara.svg")); } catch (e) { return false; } })();

export const TabbyLogo = ({ h = 26 }) => <img className="pl-tabby" src="/pay/tabby.svg" alt="tabby" height={h} width={Math.round(h * 2.54)} />;
export const TamaraLogo = ({ h = 26 }) => hasTamara
  ? <img className="pl-tamara" src="/pay/tamara.svg" alt="Tamara" height={h} style={{ height: h, width: "auto" }} />
  : <span className="pl-tamara-t" style={{ height: h, fontSize: Math.round(h * 0.58) }}>Tamara</span>;

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
        <a className="btn dk" target="_blank" rel="noopener" href={wa(t.waHi)}>{t.ask}</a></div>
      <div className="pl-cards">
        <div className="pl-card"><TabbyLogo h={40} /><b>{t.tabby[0]}</b><small>{t.tabby[1]}</small></div>
        <div className="pl-card"><TamaraLogo h={40} /><b>{t.tamara[0]}</b><small>{t.tamara[1]}</small></div>
      </div>
    </div></div></section>
  );
}
