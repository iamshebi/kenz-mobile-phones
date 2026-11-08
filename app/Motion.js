"use client";
import { useEffect } from "react";
import Lenis from "lenis";

// Smooth scrolling, scroll reveals, progress bar, nav state, hero parallax,
// mobile menu and the card glow — all in one lightweight client component.
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // ---- smooth scroll (desktop wheel + anchor links); native touch on phones
    let lenis = null;
    let raf = 0;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, anchors: { offset: -70 } });
      window.__lenis = lenis;
      const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }

    // ---- reveal on scroll
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));

    // ---- scroll-driven bits
    const nav = document.querySelector(".nav");
    const bar = document.querySelector(".progress");
    const frame = document.querySelector(".hero-visual .frame");
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav && nav.classList.toggle("scrolled", y > 24);
      if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (frame && !reduce && window.innerWidth > 900 && y < window.innerHeight * 1.2) {
        frame.style.translate = `0 ${y * 0.08}px`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---- mobile menu
    const btn = document.querySelector(".menu-btn");
    const menu = document.querySelector(".mobile-menu");
    const setMenu = (open) => {
      root.classList.toggle("menu-open", open);
      btn?.setAttribute("aria-expanded", String(open));
      menu?.setAttribute("aria-hidden", String(!open));
      if (lenis) open ? lenis.stop() : lenis.start();
    };
    const onBtn = () => setMenu(!root.classList.contains("menu-open"));
    const onMenuClick = (e) => { if (e.target.closest("a")) setMenu(false); };
    const onKey = (e) => { if (e.key === "Escape") setMenu(false); };
    btn?.addEventListener("click", onBtn);
    menu?.addEventListener("click", onMenuClick);
    window.addEventListener("keydown", onKey);

    // ---- page transition when switching language
    const onLang = (e) => {
      const a = e.target.closest?.(".lang-switch");
      if (!a || reduce || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      root.classList.add("page-leave");
      setTimeout(() => { window.location.href = a.getAttribute("href"); }, 380);
    };
    document.addEventListener("click", onLang);
    const onShow = (e) => { if (e.persisted) root.classList.remove("page-leave"); };
    window.addEventListener("pageshow", onShow);

    // ---- cursor-follow glow on cards (pointer devices only)
    const onMove = (ev) => {
      const card = ev.target.closest?.(".glow");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      card.style.setProperty("--my", `${ev.clientY - r.top}px`);
    };
    if (window.matchMedia("(hover: hover)").matches) document.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      btn?.removeEventListener("click", onBtn);
      menu?.removeEventListener("click", onMenuClick);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("click", onLang);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);
  return null;
}
