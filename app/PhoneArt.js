// Original, hand-built SVG renders of each phone family in its finish colour.
// Realistic lighting: specular highlights, bevelled edges, metallic frames,
// multi-layer lens glass, blurred lock-screen wallpaper and soft shadows.
// Views: "hero" (front + back together), "back", "front", "side".
// No manufacturer photography or logos are used. If real photos are added to a
// product (product.photos), <PhoneView> shows those instead.

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
const toRgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const toHex = (rgb) => "#" + rgb.map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
const shade = (hex, amt) => {
  const rgb = toRgb(hex);
  return toHex(rgb.map((v) => (amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
};
const lum = (hex) => {
  const [r, g, b] = toRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
const light = (hex) => lum(hex) > 0.55;
const frameOf = (p) => p.frame || (light(p.hex) ? shade(p.hex, -0.14) : shade(p.hex, 0.22));

const PX_PER_MM = 2.05;

const geo = {
  "iphone-pro":     { back: [152, 312], front: [152, 312], rx: 32 },
  "iphone-air":     { back: [154, 316], front: [154, 316], rx: 34 },
  "iphone-16":      { back: [146, 302], front: [146, 302], rx: 30 },
  "iphone-17":      { back: [150, 308], front: [150, 308], rx: 32 },
  "iphone-e":       { back: [146, 302], front: [146, 302], rx: 28 },
  "iphone-duo":     { back: [184, 250], front: [368, 250], rx: 28 },
  "galaxy-ultra":   { back: [154, 318], front: [154, 318], rx: 12 },
  "galaxy-ultra26": { back: [154, 318], front: [154, 318], rx: 18 },
  "galaxy-s":       { back: [144, 298], front: [144, 298], rx: 26 },
  "galaxy-s26":     { back: [146, 302], front: [146, 302], rx: 28 },
  "galaxy-edge":    { back: [154, 316], front: [154, 316], rx: 26 },
  "galaxy-fold":    { back: [130, 316], front: [278, 316], rx: 18 },
  "galaxy-flip":    { back: [158, 172], front: [150, 336], rx: 26 },
};

// Hero composition: [scale, x, y, rotate] for front (behind) and back (in front)
const heroLayout = {
  standard:      { vb: [360, 390], front: [0.9, 34, 26, -5], back: [0.94, 178, 50, 5] },
  "iphone-duo":  { vb: [380, 390], front: [0.74, 12, 40, -3], back: [0.84, 212, 118, 4] },
  "galaxy-fold": { vb: [370, 390], front: [0.74, 14, 34, -4], back: [0.9, 232, 70, 4] },
  "galaxy-flip": { vb: [360, 390], front: [0.86, 50, 18, -5], back: [0.98, 184, 168, 5] },
};

/* ------------------------------ defs ------------------------------ */
function Defs({ id, p }) {
  const hex = p.hex;
  const metal = frameOf(p);
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={shade(hex, 0.18)} />
        <stop offset=".45" stopColor={hex} />
        <stop offset="1" stopColor={shade(hex, -0.2)} />
      </linearGradient>
      <linearGradient id={`${id}-spec`} x1="0" y1="0" x2="1" y2=".55">
        <stop offset="0" stopColor="#fff" stopOpacity=".1" />
        <stop offset=".16" stopColor="#fff" stopOpacity="0" />
        <stop offset=".27" stopColor="#fff" stopOpacity=".26" />
        <stop offset=".4" stopColor="#fff" stopOpacity="0" />
        <stop offset=".84" stopColor="#fff" stopOpacity="0" />
        <stop offset=".93" stopColor="#fff" stopOpacity=".12" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".75" />
        <stop offset=".35" stopColor="#fff" stopOpacity="0" />
        <stop offset=".65" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".35" />
      </linearGradient>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={shade(metal, 0.55)} />
        <stop offset=".25" stopColor={metal} />
        <stop offset=".5" stopColor={shade(metal, 0.3)} />
        <stop offset=".75" stopColor={shade(metal, -0.2)} />
        <stop offset="1" stopColor={shade(metal, 0.15)} />
      </linearGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={shade(metal, -0.3)} />
        <stop offset=".22" stopColor={shade(metal, 0.45)} />
        <stop offset=".38" stopColor={shade(metal, 0.1)} />
        <stop offset=".62" stopColor={metal} />
        <stop offset=".8" stopColor={shade(metal, 0.25)} />
        <stop offset="1" stopColor={shade(metal, -0.3)} />
      </linearGradient>
      <radialGradient id={`${id}-ring`} cx=".3" cy=".25" r=".9">
        <stop offset="0" stopColor={shade(metal, 0.6)} />
        <stop offset=".5" stopColor={metal} />
        <stop offset="1" stopColor={shade(metal, -0.35)} />
      </radialGradient>
      <radialGradient id={`${id}-glass`} cx=".38" cy=".34" r=".8">
        <stop offset="0" stopColor="#3d4766" />
        <stop offset=".35" stopColor="#1a1f33" />
        <stop offset=".75" stopColor="#0a0b12" />
        <stop offset="1" stopColor="#030304" />
      </radialGradient>
      <radialGradient id={`${id}-coat`} cx=".65" cy=".7" r=".55">
        <stop offset="0" stopColor="#6d5cff" stopOpacity=".55" />
        <stop offset=".6" stopColor="#1fbf8f" stopOpacity=".18" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-glare`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".14" />
        <stop offset=".3" stopColor="#fff" stopOpacity=".02" />
        <stop offset=".31" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="16" />
      </filter>
      <filter id={`${id}-ds`} x="-40%" y="-25%" width="180%" height="160%">
        <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#1a1408" floodOpacity=".2" />
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity=".12" />
      </filter>
    </defs>
  );
}

/* --------------------------- primitives --------------------------- */
function Lens({ cx, cy, r, id }) {
  const a1 = (210 * Math.PI) / 180, a2 = (275 * Math.PI) / 180, rr = r * 0.5;
  const arc = `M ${cx + rr * Math.cos(a1)} ${cy + rr * Math.sin(a1)} A ${rr} ${rr} 0 0 1 ${cx + rr * Math.cos(a2)} ${cy + rr * Math.sin(a2)}`;
  return (
    <g>
      <circle cx={cx} cy={cy + 1.2} r={r * 1.04} fill="#000" opacity=".22" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-ring)`} />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="#0c0c10" />
      <circle cx={cx} cy={cy} r={r * 0.7} fill={`url(#${id}-glass)`} />
      <circle cx={cx} cy={cy} r={r * 0.7} fill={`url(#${id}-coat)`} />
      <circle cx={cx} cy={cy} r={r * 0.38} fill="#040406" stroke="#2c3346" strokeWidth=".7" />
      <circle cx={cx} cy={cy} r={r * 0.18} fill="#0d1020" />
      <path d={arc} stroke="#fff" strokeOpacity=".55" strokeWidth={Math.max(r * 0.09, 1)} fill="none" strokeLinecap="round" />
      <circle cx={cx + r * 0.28} cy={cy + r * 0.3} r={r * 0.06} fill="#fff" opacity=".35" />
    </g>
  );
}
const Flash = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 1} fill="#000" opacity=".15" />
    <circle cx={cx} cy={cy} r={r} fill="#e9e5d8" />
    <circle cx={cx} cy={cy} r={r * 0.62} fill="#fffbe9" />
    <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.2} fill="#fff" />
  </g>
);
const Sensor = ({ cx, cy, r }) => (
  <g><circle cx={cx} cy={cy} r={r} fill="#111114" /><circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.25} fill="#fff" opacity=".25" /></g>
);

function Plate({ x, y, w, h, rx, p, id, island = false }) {
  const plate = light(p.hex) ? shade(p.hex, -0.05) : shade(p.hex, 0.08);
  return (
    <g>
      <rect x={x} y={y + 1.5} width={w} height={h} rx={rx} fill="#000" opacity=".12" />
      {island && <rect x={x - 1.5} y={y - 1.5} width={w + 3} height={h + 3} rx={rx + 1.5} fill={`url(#${id}-rim)`} />}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={plate} />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${id}-spec)`} />
      <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx={rx} fill="none" stroke={`url(#${id}-bevel)`} strokeWidth="1.2" />
    </g>
  );
}

function Shell({ w, h, rx, id }) {
  return (
    <g>
      <rect x={-3} y={-3} width={w + 6} height={h + 6} rx={rx + 3} fill={`url(#${id}-rim)`} />
      <rect x={0} y={0} width={w} height={h} rx={rx} fill={`url(#${id}-body)`} />
      <rect x={0} y={0} width={w} height={h} rx={rx} fill={`url(#${id}-spec)`} />
      <rect x={0.8} y={0.8} width={w - 1.6} height={h - 1.6} rx={rx} fill="none" stroke={`url(#${id}-bevel)`} strokeWidth="1.6" />
    </g>
  );
}

function Cameras({ family, w, h, p, id }) {
  const L = (cx, cy, r) => <Lens cx={cx} cy={cy} r={r} id={id} />;
  switch (family) {
    case "iphone-pro": {
      const ph = h * 0.3, r = w * 0.12;
      return (<g>
        <Plate x={5} y={5} w={w - 10} h={ph} rx={26} p={p} id={id} />
        {L(w * 0.26, h * 0.093, r)}{L(w * 0.26, h * 0.232, r)}{L(w * 0.52, h * 0.163, r)}
        <Flash cx={w * 0.79} cy={h * 0.093} r={5.5} /><Sensor cx={w * 0.79} cy={h * 0.232} r={5} />
        <circle cx={w * 0.79} cy={h * 0.163} r={1.8} fill="#1a1a1d" />
      </g>);
    }
    case "iphone-air": {
      const bh = h * 0.12, by = 12;
      return (<g>
        <Plate x={6} y={by} w={w - 12} h={bh} rx={bh / 2} p={p} id={id} />
        {L(w * 0.2, by + bh / 2, bh * 0.36)}
        <Flash cx={w * 0.4} cy={by + bh / 2} r={4.6} /><circle cx={w * 0.51} cy={by + bh / 2} r={1.8} fill="#1a1a1d" />
      </g>);
    }
    case "iphone-16":
    case "iphone-17": {
      const pw = w * 0.3, ph = w * 0.64, px = w * 0.085, py = h * 0.035, r = w * 0.112;
      return (<g>
        <Plate x={px} y={py} w={pw} h={ph} rx={family === "iphone-16" ? pw / 2 : 20} p={p} id={id} />
        {L(px + pw / 2, py + pw / 2, r)}{L(px + pw / 2, py + ph - pw / 2, r)}
        <Flash cx={px + pw + 13} cy={py + ph / 2} r={4.6} />
      </g>);
    }
    case "iphone-e": {
      const s = w * 0.3, px = w * 0.08, py = h * 0.032;
      return (<g>
        <Plate x={px} y={py} w={s} h={s} rx={15} p={p} id={id} />
        {L(px + s / 2, py + s / 2, w * 0.1)}<Flash cx={px + s + 11} cy={py + 12} r={4.2} />
      </g>);
    }
    case "iphone-duo": {
      const bh = h * 0.22;
      return (<g>
        <Plate x={6} y={6} w={w - 12} h={bh} rx={22} p={p} id={id} />
        {L(w * 0.2, 6 + bh / 2, bh * 0.3)}{L(w * 0.42, 6 + bh / 2, bh * 0.3)}
        <Flash cx={w * 0.66} cy={6 + bh / 2} r={5} /><Sensor cx={w * 0.8} cy={6 + bh / 2} r={4.5} />
      </g>);
    }
    case "galaxy-ultra": {
      const r = w * 0.098;
      return (<g>
        {L(w * 0.2, h * 0.075, r)}{L(w * 0.2, h * 0.18, r)}{L(w * 0.2, h * 0.285, r)}
        {L(w * 0.42, h * 0.18, r * 0.78)}<Flash cx={w * 0.42} cy={h * 0.085} r={4.6} />
        <Sensor cx={w * 0.42} cy={h * 0.27} r={3.4} />
      </g>);
    }
    case "galaxy-ultra26":
    case "galaxy-s26": {
      const pw = w * 0.3, ph = h * 0.36, px = w * 0.06, py = h * 0.026, r = w * 0.1;
      return (<g>
        <Plate x={px} y={py} w={pw} h={ph} rx={pw / 2} p={p} id={id} island />
        {L(px + pw / 2, py + pw / 2, r)}{L(px + pw / 2, py + ph / 2, r)}{L(px + pw / 2, py + ph - pw / 2, r)}
        {family === "galaxy-ultra26"
          ? (<>{L(w * 0.46, h * 0.2, r * 0.75)}<Flash cx={w * 0.46} cy={h * 0.09} r={4.6} /></>)
          : <Flash cx={px + pw + 12} cy={py + 16} r={4.6} />}
      </g>);
    }
    case "galaxy-s": {
      const r = w * 0.1;
      return (<g>
        {L(w * 0.2, h * 0.08, r)}{L(w * 0.2, h * 0.185, r)}{L(w * 0.2, h * 0.29, r)}
        <Flash cx={w * 0.41} cy={h * 0.08} r={4.6} />
      </g>);
    }
    case "galaxy-edge": {
      const pw = w * 0.3, ph = w * 0.62, px = w * 0.075, py = h * 0.035;
      return (<g>
        <Plate x={px} y={py} w={pw} h={ph} rx={pw / 2} p={p} id={id} island />
        {L(px + pw / 2, py + pw / 2, w * 0.11)}{L(px + pw / 2, py + ph - pw / 2, w * 0.11)}
        <Flash cx={px + pw + 13} cy={py + 15} r={4.6} />
      </g>);
    }
    case "galaxy-fold": {
      const pw = w * 0.42, ph = h * 0.37, px = w * 0.09, py = h * 0.03, r = w * 0.13;
      return (<g>
        <Plate x={px} y={py} w={pw} h={ph} rx={pw / 2} p={p} id={id} island />
        {L(px + pw / 2, py + pw / 2, r)}{L(px + pw / 2, py + ph / 2, r)}{L(px + pw / 2, py + ph - pw / 2, r)}
        <Flash cx={px + pw + 12} cy={py + 15} r={4.2} />
      </g>);
    }
    case "galaxy-flip": {
      const sx = 6, sy = 6, sw = w - 12, sh = h - 12;
      return (<g>
        <Wallpaper x={sx} y={sy} w={sw} h={sh} rx={20} p={p} id={`${id}-cover`} defsId={id} />
        <text x={w - 20} y={44} textAnchor="end" fill="#fff" fillOpacity=".95" fontSize="25" fontWeight="600" fontFamily="Inter, Helvetica, Arial, sans-serif">10:09</text>
        {L(w * 0.19, h - h * 0.21, w * 0.095)}{L(w * 0.4, h - h * 0.21, w * 0.095)}
        <Flash cx={w * 0.57} cy={h - h * 0.21} r={3.8} />
        <rect x={sx} y={sy} width={sw} height={sh} rx={20} fill={`url(#${id}-glare)`} />
      </g>);
    }
    default:
      return null;
  }
}

function Wallpaper({ x, y, w, h, rx, p, id, defsId }) {
  const hex = p.hex;
  const base = shade(hex, light(hex) ? -0.72 : -0.55);
  return (
    <g>
      <clipPath id={`${id}-clip`}><rect x={x} y={y} width={w} height={h} rx={rx} /></clipPath>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={base} />
      <g clipPath={`url(#${id}-clip)`}>
        <g filter={`url(#${defsId}-blur)`}>
          <ellipse cx={x + w * 0.85} cy={y + h * 0.9} rx={w * 0.75} ry={h * 0.32} fill={shade(hex, 0.15)} opacity=".95" />
          <ellipse cx={x + w * 0.15} cy={y + h * 0.62} rx={w * 0.55} ry={h * 0.22} fill={shade(hex, light(hex) ? -0.25 : 0.35)} opacity=".75" />
          <ellipse cx={x + w * 0.4} cy={y + h * 0.05} rx={w * 0.7} ry={h * 0.18} fill={shade(hex, 0.45)} opacity=".45" />
        </g>
      </g>
    </g>
  );
}

function Screen({ w, h, rx, p, id, family }) {
  const apple = family.startsWith("iphone");
  const crease = family === "iphone-duo" || family === "galaxy-fold" ? "v" : family === "galaxy-flip" ? "h" : null;
  const bezel = family.startsWith("galaxy-ultra") ? 4 : 5;
  const ix = bezel, iy = bezel, iw = w - bezel * 2, ih = h - bezel * 2, irx = Math.max(rx - bezel, 6);
  const cx = crease === "v" ? w * 0.75 : w / 2;
  const ty = h * (family === "galaxy-flip" ? 0.17 : 0.25);
  return (
    <g>
      <rect x={-3} y={-3} width={w + 6} height={h + 6} rx={rx + 3} fill={`url(#${id}-rim)`} />
      <rect x={0} y={0} width={w} height={h} rx={rx} fill="#040406" />
      <Wallpaper x={ix} y={iy} w={iw} h={ih} rx={irx} p={p} id={`${id}-wall`} defsId={id} />
      {crease === "v" && <rect x={w / 2 - 1} y={iy} width={2} height={ih} fill="#fff" opacity=".07" />}
      {crease === "h" && <rect x={ix} y={h / 2 - 1} width={iw} height={2} fill="#fff" opacity=".08" />}
      {apple && family !== "iphone-duo" && <rect x={w / 2 - w * 0.14} y={13} width={w * 0.28} height={11} rx={5.5} fill="#000" />}
      {!apple && family !== "galaxy-fold" && <circle cx={w / 2} cy={15} r={4.2} fill="#000" />}
      {family === "galaxy-fold" && <circle cx={w * 0.75} cy={17} r={3.6} fill="#000" />}
      <text x={cx} y={ty - 36} textAnchor="middle" fill="#fff" fillOpacity=".7" fontSize="9.5" fontWeight="500" fontFamily="Inter, Helvetica, Arial, sans-serif">Saturday 7</text>
      <text x={cx} y={ty} textAnchor="middle" fill="#fff" fillOpacity=".95" fontSize={family === "galaxy-flip" ? 30 : 36} fontWeight="600" fontFamily="Inter, Helvetica, Arial, sans-serif">10:09</text>
      <rect x={w / 2 - w * 0.17} y={h - 12} width={w * 0.34} height={3.5} rx={1.75} fill="#fff" opacity=".6" />
      <rect x={0} y={0} width={w} height={h} rx={rx} fill={`url(#${id}-glare)`} />
    </g>
  );
}

function Side({ t, h, p, id, family }) {
  const apple = family.startsWith("iphone");
  const r = Math.min(t / 2, 10);
  const metal = frameOf(p);
  const btn = shade(metal, light(metal) ? -0.1 : 0.15);
  const fold = family === "iphone-duo" || family === "galaxy-fold" || family === "galaxy-flip";
  const bumpW = family === "iphone-air" ? 3 : family === "galaxy-s" || family === "galaxy-ultra" ? 2.5 : 4.5;
  const bumpH = family === "galaxy-flip" ? 0 : family === "iphone-air" ? h * 0.13 : family.startsWith("galaxy") ? h * 0.36 : h * 0.3;
  const buttons = apple
    ? [[0.15, 0.05], [0.24, 0.085], [0.345, 0.085]]
    : family === "galaxy-flip" ? [[0.3, 0.18], [0.55, 0.14]] : [[0.2, 0.13], [0.38, 0.07]];
  return (
    <g>
      {bumpH > 0 && <rect x={t - 2} y={h * 0.03} width={bumpW + 2} height={bumpH} rx={2.5} fill={shade(p.hex, light(p.hex) ? -0.08 : 0.1)} />}
      <rect x={-1.6} y={0} width={2.6} height={h} rx={1.3} fill="#0a0a0d" />
      <rect x={0} y={0} width={t} height={h} rx={r} fill={`url(#${id}-metal)`} />
      <rect x={t - 1.8} y={4} width={1.8} height={h - 8} fill={p.hex} />
      {fold && <rect x={t / 2 - 0.6} y={6} width={1.2} height={h - 12} fill="#000" opacity=".35" />}
      {buttons.map(([top, len], i) => (
        <g key={i}>
          <rect x={t * 0.2} y={h * top} width={t * 0.6} height={h * len} rx={Math.min(t * 0.3, 3)} fill={btn} />
          <rect x={t * 0.2} y={h * top} width={t * 0.25} height={h * len} rx={Math.min(t * 0.12, 2)} fill="#fff" opacity=".35" />
        </g>
      ))}
      <rect x={0} y={h * 0.08} width={t} height={1.4} fill="#000" opacity=".18" />
      <rect x={0} y={h * 0.92} width={t} height={1.4} fill="#000" opacity=".18" />
    </g>
  );
}

function Device({ p, kind, id, transform, className }) {
  const g = geo[p.family];
  const [w, h] = kind === "front" ? g.front : g.back;
  const rx = kind === "front" && (p.family === "iphone-duo" || p.family === "galaxy-fold") ? g.rx - 4 : g.rx;
  return (
    <g className={className}>
      <g transform={transform} filter={`url(#${id}-ds)`}>
        {kind === "back"
          ? (<g><Shell w={w} h={h} rx={rx} id={id} /><Cameras family={p.family} w={w} h={h} p={p} id={id} /></g>)
          : <Screen w={w} h={h} rx={rx} p={p} id={id} family={p.family} />}
      </g>
    </g>
  );
}

export function PhoneArt({ product: p, view = "back", className = "" }) {
  const id = `${p.id}-${view}`;
  const g = geo[p.family];
  let vbW, vbH = 380, content;

  if (view === "hero") {
    const lay = heroLayout[p.family] || heroLayout.standard;
    [vbW, vbH] = lay.vb;
    const tf = (kind, [s, x, y, r]) => {
      const [w, h] = kind === "front" ? g.front : g.back;
      return `translate(${x} ${y}) scale(${s}) rotate(${r} ${w / 2} ${h / 2})`;
    };
    content = (
      <>
        <Device p={p} kind="front" id={id} transform={tf("front", lay.front)} className="h-front" />
        <Device p={p} kind="back" id={id} transform={tf("back", lay.back)} className="h-back" />
      </>
    );
  } else if (view === "side") {
    const t = Math.max(10, p.mm * PX_PER_MM);
    const h = g.back[1];
    vbW = 220;
    content = (
      <g filter={`url(#${id}-ds)`} transform={`translate(${vbW / 2 - t / 2} ${(vbH - h) / 2 - 6})`}>
        <Side t={t} h={h} p={p} id={id} family={p.family} />
      </g>
    );
  } else {
    const [w, h] = view === "front" ? g.front : g.back;
    vbW = Math.max(w + 70, 220);
    content = <Device p={p} kind={view} id={id} transform={`translate(${(vbW - w) / 2} ${(vbH - h) / 2 - 6})`} />;
  }

  return (
    <svg className={`phone-art view-${view} ${className}`} viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label={`${p.name}, ${p.color.en}`}>
      <Defs id={id} p={p} />
      {content}
    </svg>
  );
}

// Shows a real photo when the product has one for this view, otherwise the render.
export default function PhoneView({ product, view = "back", className = "" }) {
  const key = view === "hero" ? "back" : view;
  const photo = product.photos?.[key];
  if (photo) {
    return <img src={photo} alt={`${product.name}, ${product.color.en}`} className={`phone-art phone-photo ${className}`} loading="lazy" />;
  }
  return <PhoneArt product={product} view={view} className={className} />;
}
