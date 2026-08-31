"use client";

/**
 * Smooth scrolling.
 *
 * Lenis supplies the inertia the reference has — a short lerp that carries a
 * flick a little further than the raw wheel delta and settles, rather than any
 * kind of scroll hijacking: page length, scrollbar, keyboard paging and browser
 * history all behave normally.
 *
 * Mounted once per route (it was previously duplicated per page, which meant
 * two rAF loops fighting over the same scroll position). Disabled outright
 * under `prefers-reduced-motion`, where native scrolling takes over.
 */

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // In-page anchors have to be handed to Lenis, otherwise the native jump
    // and the lerp fight each other. The landing offset clears the floating nav
    // pill by default, but a target that declares its own `scroll-margin-top`
    // gets that instead — pages with a pinned section index need more room, and
    // the amount belongs with the section, not hard-coded here.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      const hash = href.startsWith("#") ? href : href.startsWith("/#") ? href.slice(1) : null;
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      /* Resolved to an absolute page position rather than handed over as an
         element: Lenis measures a target with `offsetTop`, which is relative
         to the nearest positioned ancestor, so an anchor on anything inside a
         `position: relative` band lands somewhere arbitrary. */
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop);
      const top = el.getBoundingClientRect().top + window.scrollY - (margin || 94);
      lenis.scrollTo(top);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
