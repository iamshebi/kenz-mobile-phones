"use client";
import { useEffect } from "react";

// All page motion in one place: scroll reveals, sticky header, mobile menu,
// count-up stats, hero parallax, scroller arrows, phone tabs and gallery.
export default function Fx() {
  useEffect(() => {
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const rtl = document.documentElement.dir === "rtl";
    const off = [];
    const on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); off.push(() => el.removeEventListener(ev, fn, o)); };

    // reveal
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    const watch = () => $$(".rv:not(.in),.ln:not(.in)").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch); mo.observe(document.getElementById("app"), { childList: true, subtree: true });

    // header
    const hd = document.getElementById("hd");
    const onScroll = () => hd && hd.classList.toggle("s", scrollY > 8);
    onScroll(); on(window, "scroll", onScroll, { passive: true });

    // mobile menu
    const bg = document.getElementById("bg");
    const setMenu = (open) => { document.body.classList.toggle("mo", open); bg?.setAttribute("aria-expanded", String(open)); };
    bg && on(bg, "click", () => setMenu(!document.body.classList.contains("mo")));
    on(window, "keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    $$(".mnav a").forEach((a) => on(a, "click", () => setMenu(false)));

    // keep the shop filters when switching language
    $$(".lang").forEach((a) => on(a, "click", () => { if (location.search && !a.href.includes("?")) a.href += location.search; }));

    // count-up
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.n, suf = el.dataset.s || "", t0 = performance.now(), dur = reduce ? 1 : 1600;
      const step = (n) => { const k = Math.min(1, (n - t0) / dur), v = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * v) + (k === 1 ? suf : ""); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    $$("[data-n]").forEach((n) => cio.observe(n));

    // hero parallax
    const st = document.getElementById("stage");
    if (st && matchMedia("(pointer:fine)").matches && !reduce) {
      let raf;
      on(st, "mousemove", (e) => {
        const r = st.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => $$(".fl", st).forEach((f) => { const k = +f.dataset.depth; f.style.transform = `translate3d(${mx * k}px,${my * k}px,0)`; }));
      });
      on(st, "mouseleave", () => $$(".fl", st).forEach((f) => { f.style.transition = "transform 1.2s cubic-bezier(.22,1,.36,1)"; f.style.transform = ""; setTimeout(() => (f.style.transition = ""), 1200); }));
    }

    // scroller arrows: <div class="sbt" data-for="id">
    $$(".sbt").forEach((g) => {
      const s = document.getElementById(g.dataset.for);
      $$("[data-s]", g).forEach((b) => on(b, "click", () => s?.scrollBy({ left: (rtl ? -1 : 1) * +b.dataset.s * s.clientWidth * 0.8, behavior: "smooth" })));
    });

    // phone wall tabs
    $$("[data-tabs]").forEach((tabs) => {
      const s = document.getElementById(tabs.dataset.tabs);
      $$("button", tabs).forEach((b) => on(b, "click", () => {
        $$("button", tabs).forEach((x) => x.classList.toggle("on", x === b));
        const f = b.dataset.f;
        const run = () => { $$(".c", s).forEach((c) => { c.hidden = f !== "all" && c.dataset.b !== f; }); s.scrollTo({ left: 0 }); };
        document.startViewTransition && !reduce ? document.startViewTransition(run) : run();
      }));
    });

    // product gallery thumbs
    $$("[data-gal]").forEach((g) => {
      const main = g.querySelector(".pim img");
      $$(".th button", g).forEach((b) => on(b, "click", () => {
        $$(".th button", g).forEach((x) => x.classList.toggle("on", x === b));
        if (main) { main.style.animation = "none"; main.offsetHeight; main.style.animation = ""; main.src = b.dataset.src; }
      }));
    });

    return () => { io.disconnect(); mo.disconnect(); cio.disconnect(); off.forEach((f) => f()); };
  }, []);
  return null;
}
