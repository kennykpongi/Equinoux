"use client";

/**
 * Motion and icon primitives.
 *
 * Layout and typography live in ./layout and globals.css; this file only holds
 * the two motion helpers the sections share and the line-icon set.
 *
 * All motion respects prefers-reduced-motion:
 *  - Reveal renders content statically (no transform/opacity animation)
 *  - useCountUp jumps straight to the final value
 */

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type ElementType,
  type CSSProperties,
} from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

/**
 * True only after hydration.
 *
 * The server has no media queries, so useReducedMotion() is always false there
 * while a reduced-motion client reads true. Anything that branches on it during
 * render therefore emits different markup on each side and React reports a
 * hydration mismatch. Gating on this makes the first client render agree with
 * the server, and the reduced-motion result lands on the render straight after.
 *
 * useSyncExternalStore rather than an effect, so no state is written during
 * render or in an effect.
 */
const subscribeNever = () => () => {};
export function useMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/* ─── Reveal: fade + rise on scroll into view ─── */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
  once = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  once?: boolean;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  // `hidden` is what gets serialised into the server HTML, so it must not
  // depend on reduced motion. The reduction lives in the transition instead,
  // which is never written to markup: a reduced-motion visitor lands on `show`
  // instantly, with no travel, and the two renders still agree.
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: reduce
        ? { duration: 0, delay: 0 }
        : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
    },
  };

  return (
    <MotionTag
      /* `eqx-reveal` is the hook the no-JS fallback in app/layout.tsx uses to
         force these back to visible — the server HTML carries the inline
         opacity:0 that the animation starts from. */
      className={className ? `eqx-reveal ${className}` : "eqx-reveal"}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/* ─── Count-up number, triggered on view ─── */
export function useCountUp(target: number, duration = 1600) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  // Reduced motion is a derived read of the final figure, not a state write:
  // setting state for it would cost a render pass to display a constant. It is
  // gated on mount because the server renders 0 here and a reduced-motion
  // client would otherwise render the target on its first pass, which is a
  // hydration mismatch on the text itself.
  const mounted = useMounted();
  const value = reduce && mounted ? target : animated;

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setAnimated(t === 1 ? target : target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduce]);

  return { value, ref };
}

/** A formatted count-up stat (e.g. "+180%", "350+", "1.8s"). */
export function CountStat({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const { value, ref } = useCountUp(target);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ─── Line icons (replace emoji glyphs for crisp, scalable marks) ─── */
type IconProps = { className?: string; strokeWidth?: number; style?: CSSProperties };

export function ArrowUpRight({ className, strokeWidth = 1.75, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight({ className, strokeWidth = 1.75, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className, strokeWidth = 2, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function CrossIcon({ className, strokeWidth = 2, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MailIcon({ className, strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}

export function PhoneIcon({ className, strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M6.5 3h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.6 6.6L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 3 5.7 2.5 2.5 0 0 1 5.5 3Z" />
    </svg>
  );
}

export function PinIcon({ className, strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function InstagramIcon({ className, strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M6.2 9.3H3.6V20h2.6V9.3ZM4.9 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20.4 13.6c0-2.9-1.6-4.5-3.8-4.5-1.4 0-2.3.7-2.8 1.5V9.3H11.3V20h2.6v-5.6c0-1.4.6-2.3 1.9-2.3s1.9.9 1.9 2.3V20h2.7v-6.4Z" />
    </svg>
  );
}

export function DribbbleIcon({ className, strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M5 7.5c4.4 2.2 8.9 3 13.7 2.4M3.6 14.4c4.4-1.4 8.4-.7 11.8 2.2M9.2 3.5c3.2 3.9 5.3 8.4 6 13.9" />
    </svg>
  );
}
