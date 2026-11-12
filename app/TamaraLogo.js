"use client";
import { useState } from "react";

// Official Tamara badge from Tamara's own CDN (same as the Zaitoon site); falls back to text if it can't load.
const SRC = "https://cdn.tamara.co/assets/png/tamara-logo-badge-en.png";
export default function TamaraLogo({ h = 26 }) {
  const [ok, setOk] = useState(true);
  return ok
    ? <img className="pl-tamara" src={SRC} alt="tamara" height={h} style={{ height: h, width: "auto" }} referrerPolicy="no-referrer" onError={() => setOk(false)} />
    : <span className="pl-tamara-t" style={{ height: h, fontSize: Math.round(h * 0.58) }}>tamara</span>;
}
