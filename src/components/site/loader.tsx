"use client";

/**
 * First-open intro — an ink screen with the wordmark, which lifts away to
 * reveal the site.
 *
 * Robustness: dismissal is driven by setTimeout + a CSS transition, NOT by a
 * requestAnimationFrame-based animation library. If the tab is backgrounded or
 * rAF is throttled during first load, an rAF-driven exit could stall and leave
 * the overlay stuck over the whole site. Timers keep firing regardless, so the
 * overlay always unmounts.
 *
 * - Shows once per browser session (sessionStorage flag, claimed at import).
 * - Respects prefers-reduced-motion (fades instead of sliding, and faster).
 * - Locks scroll while visible.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const KEY = "eqx-intro-shown";
const HOLD = 1500; // visible duration before it starts leaving
const SLIDE = 800; // CSS transition duration

/**
 * Claimed once, when this module is first imported in the browser: whoever
 * reads it first gets the intro and every later mount in the session gets
 * `false`. Resolving it here rather than in an effect means the overlay's
 * initial state is already correct on its first real render.
 */
const FIRST_VISIT =
  typeof window === "undefined"
    ? false
    : (() => {
        const seen = sessionStorage.getItem(KEY) !== null;
        if (!seen) sessionStorage.setItem(KEY, "1");
        return !seen;
      })();

/* The overlay must never appear in the server HTML — it would be baked into
   the page for anyone without JS. This reports "we're on the client" without
   a state write. */
const subscribeNever = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function Loader() {
  const mounted = useSyncExternalStore(subscribeNever, onClient, onServer);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(FIRST_VISIT);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";

    const hold = reduce ? 350 : HOLD;
    const slide = reduce ? 200 : SLIDE;

    const t1 = setTimeout(() => setLeaving(true), hold);
    const t2 = setTimeout(() => {
      setActive(false);
      document.body.style.overflow = "";
    }, hold + slide);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, [active, reduce]);

  if (!mounted || !active) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center"
      style={{
        backgroundColor: "var(--ink)",
        color: "var(--paper)",
        transition: reduce
          ? `opacity ${SLIDE}ms ease`
          : `transform ${SLIDE}ms cubic-bezier(0.76,0,0.24,1)`,
        transform: reduce ? "none" : leaving ? "translateY(-100%)" : "translateY(0)",
        opacity: reduce && leaving ? 0 : 1,
      }}
    >
      <span className="t-display flex" aria-label="Equinoux">
        {"Equinoux".split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block"
            style={{
              animation: reduce ? undefined : "eqx-loader-in 0.55s cubic-bezier(0.16,1,0.3,1) both",
              animationDelay: reduce ? undefined : `${0.08 + i * 0.05}s`,
            }}
          >
            {ch}
          </span>
        ))}
      </span>
      <style>{`@keyframes eqx-loader-in{from{opacity:0;transform:translateY(0.4em)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
