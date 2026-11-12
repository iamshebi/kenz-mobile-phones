"use client";
// Light / dark theme switch in the header. The choice is remembered on this device.
// The new theme spreads out from the button in a soft circle (View Transitions); browsers without
// that get a smooth colour fade instead.
export default function ThemeToggle({ lang }) {
  const flip = (e) => {
    const root = document.documentElement;
    const apply = () => {
      const dark = root.classList.toggle("dark");
      try { localStorage.setItem("kz-theme", dark ? "dark" : "light"); } catch (_) {}
      const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", dark ? "#0A0A0A" : "#FBFAF7");
    };
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) return apply();
    if (!document.startViewTransition) {
      root.classList.add("theme-fade"); apply();
      clearTimeout(flip.t); flip.t = setTimeout(() => root.classList.remove("theme-fade"), 700);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add("vt-theme");
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
    )).catch(() => {});
    vt.finished.finally(() => root.classList.remove("vt-theme"));
  };
  const label = lang === "ar" ? "تبديل الوضع الداكن" : "Switch dark / light theme";
  return (
    <button type="button" className="tgl" onClick={flip} aria-label={label} title={label}>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></svg>
    </button>
  );
}
