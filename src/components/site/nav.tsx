"use client";

/**
 * Site navigation — a floating glass pill, not a bar.
 *
 * The pill sits inset from the viewport edges and hovers over the content.
 * It carries two palettes: an ink/blur variant while it is over the dark hero,
 * and a paper variant once the page has scrolled past it, so contrast holds on
 * both grounds. The `+` control opens a full-screen editorial index.
 *
 * Keyboard: the toggle is a real button, the overlay traps nothing but closes
 * on Escape, and focus returns to the toggle when it does.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BRAND } from "./content";
import { Container, Roll } from "./layout";
import { MailIcon, PhoneIcon, PinIcon } from "./primitives";

const LINKS = [
  { href: "/work", label: "Works" },
  { href: "/about", label: "Studio" },
  { href: "/#services", label: "Services" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const CREDO = ["Thoughtful", "Intentional", "Timeless"];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteNav({
  overHero = false,
  onDark = false,
}: {
  overHero?: boolean;
  /** Force the ink palette — for pages whose ground is dark the whole way down. */
  onDark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  /* Pages that open on a dark hero start in the ink palette and flip to paper
     once that hero has been scrolled past. Everything else is paper from the
     first frame — derived, so no state has to be set just to say "always". */
  const scrolled = !overHero || pastHero;

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight - 120);
    // Deferred to the next frame rather than called inline: a restored scroll
    // position has to be picked up, but doing it synchronously in the effect
    // body forces a second render pass on every mount.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [overHero]);

  /* Close the overlay when the route changes. Adjusting state during render
     on a changed value is the supported pattern here; an effect would leave
     the stale menu painted for a frame. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* Lock the page behind the overlay. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // While the overlay is up the pill always reads as paper-on-ink.
  const dark = onDark ? !open : !scrolled && !open;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50" style={{ paddingTop: "var(--page-inset)" }}>
        <Container>
          <nav
            className="pointer-events-auto flex items-center justify-between rounded-full transition-colors duration-500"
            style={{
              height: 54,
              paddingLeft: 20,
              paddingRight: 8,
              backgroundColor: dark ? "rgba(11,11,11,0.28)" : "rgba(243,242,239,0.72)",
              border: `1px solid ${dark ? "rgba(243,242,239,0.14)" : "var(--line-strong)"}`,
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              color: dark ? "var(--paper)" : "var(--ink)",
            }}
          >
            <Link href="/" className="tap t-meta font-semibold" aria-label={`${BRAND.name} home`}>
              <Roll>{`${BRAND.name}®`}</Roll>
            </Link>

            {/* Inline index — the overlay stays available at every width. */}
            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="tap t-meta opacity-80 transition-opacity hover:opacity-100">
                    <Roll>{l.label}</Roll>
                  </Link>
                </li>
              ))}
            </ul>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex items-center justify-center rounded-full transition-colors duration-300"
              style={{
                width: 52,
                height: 38,
                backgroundColor: dark ? "rgba(243,242,239,0.14)" : "rgba(11,11,11,0.07)",
                color: "currentColor",
              }}
            >
              {/* A plus that rotates into a cross — one shape, two states. */}
              <span
                className="relative block h-[14px] w-[14px] transition-transform duration-500"
                style={{ transform: open ? "rotate(135deg)" : "none", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                aria-hidden="true"
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ backgroundColor: "currentColor" }} />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ backgroundColor: "currentColor" }} />
              </span>
            </button>
          </nav>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            initial={{ opacity: 0, y: reduce ? 0 : "-2%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : "-2%" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          >
            <div className="flex h-full flex-col overflow-y-auto" style={{ paddingTop: 94 }}>
              <Container className="flex flex-1 flex-col">
                <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[1fr_34rem]">
                  {/* Numbered index */}
                  <nav aria-label="Main" className="flex flex-col justify-center">
                    <ul>
                      {LINKS.map((l, i) => (
                        <motion.li
                          key={l.href}
                          initial={{ opacity: 0, x: reduce ? 0 : -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : 0.08 + i * 0.055 }}
                          style={{ borderTop: "1px solid var(--line-inverse)" }}
                        >
                          <Link
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-baseline gap-5 py-4 md:gap-8"
                          >
                            <span className="t-meta tabular-nums" style={{ color: "var(--ink-inverse)" }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="t-title">
                              <Roll>{l.label}</Roll>
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  {/* Editorial plate */}
                  <motion.div
                    className="relative hidden overflow-hidden lg:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : 0.15 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/site/menu.jpg"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover grayscale"
                      style={{ objectPosition: "75% center" }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(11,11,11,0.15) 0%, rgba(11,11,11,0.85) 100%)" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <p className="t-sub max-w-sm">{BRAND.tagline}</p>
                      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                        {CREDO.map((c) => (
                          <li key={c} className="t-meta" style={{ color: "var(--ink-inverse)" }}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                {/* Contact bar */}
                <motion.div
                  className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-3"
                  style={{ borderTop: "1px solid var(--line-inverse)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : 0.35 }}
                >
                  <a href={`mailto:${BRAND.email}`} className="tap t-meta flex items-center gap-3 hover:opacity-70">
                    <MailIcon className="h-4 w-4 shrink-0" style={{ color: "var(--ink-inverse)" }} />
                    {BRAND.email}
                  </a>
                  <a href={BRAND.phoneHref} className="tap t-meta flex items-center gap-3 hover:opacity-70">
                    <PhoneIcon className="h-4 w-4 shrink-0" style={{ color: "var(--ink-inverse)" }} />
                    {BRAND.phone}
                  </a>
                  <span className="t-meta flex items-center gap-3">
                    <PinIcon className="h-4 w-4 shrink-0" style={{ color: "var(--ink-inverse)" }} />
                    {BRAND.location}
                  </span>
                </motion.div>
              </Container>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
