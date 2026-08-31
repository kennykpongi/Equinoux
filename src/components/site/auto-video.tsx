"use client";

/**
 * A silent, looping clip that plays only while it is on screen.
 *
 * This is the single place video playback is decided, because phones are where
 * background video quietly fails and the failures are not obvious from a
 * desktop:
 *
 *   - The source is assigned in JS rather than as a <source> child, so a phone
 *     fetches the small cut and everything else the large one. Choosing before
 *     the first load avoids fetching one file and then the other.
 *   - preload="metadata", not "none". iOS is unreliable at starting a
 *     programmatic play() on an element that has never loaded anything.
 *   - Playback is gated on an IntersectionObserver, so a multi-megabyte file
 *     does not decode behind three screens of scroll.
 *   - If play() is refused we say so instead of failing silently. iOS Low Power
 *     Mode blocks autoplay outright, and prefers-reduced-motion means we must
 *     not autoplay at all — both surface the same play control over the poster,
 *     so the footage is always reachable rather than a still frame with no
 *     explanation.
 *
 * State is only ever set from async callbacks (the play() promise, media
 * events), never synchronously inside an effect, to stay clear of
 * set-state-in-effect.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Give the element its source, once, at the last possible moment.
 *
 * Deferred rather than set on mount because several surfaces render a desktop
 * and a mobile variant of the same card and hide one with display:none — and a
 * hidden <video> with a src still downloads. Attaching from the observer means
 * a variant that never intersects never costs a byte.
 */
function attach(el: HTMLVideoElement, src: string, srcSmall?: string) {
  if (el.src) return;
  el.src = srcSmall && window.matchMedia("(max-width: 767px)").matches ? srcSmall : src;
  el.load();
}

export function AutoVideo({
  src,
  srcSmall,
  poster,
  label,
  className = "absolute inset-0 h-full w-full object-cover",
}: {
  src: string;
  /** Served below 768px when present. */
  srcSmall?: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const [started, setStarted] = useState(false);

  // The server has no media queries, so useReducedMotion() disagrees with the
  // client on the first paint. Rendering the control on that difference is a
  // hydration mismatch, so it waits for the client snapshot.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const showPlay = mounted && !started && (blocked || reduce === true);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          el.pause();
          return;
        }
        attach(el, src, srcSmall);
        el.play().then(
          () => setBlocked(false),
          () => setBlocked(true),
        );
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, src, srcSmall]);

  function start() {
    const el = ref.current;
    if (!el) return;
    attach(el, src, srcSmall);
    void el.play().then(
      () => {
        setStarted(true);
        setBlocked(false);
      },
      () => setStarted(false),
    );
  }

  return (
    <>
      <video
        ref={ref}
        className={className}
        poster={poster}
        preload="metadata"
        muted
        loop
        playsInline
        aria-label={label}
        onPlaying={() => setBlocked(false)}
      />

      {showPlay && (
        <button
          type="button"
          onClick={start}
          className="tap absolute inset-0 z-10 flex items-center justify-center"
          aria-label={`Play: ${label}`}
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(11,11,11,0.55)",
              border: "1px solid rgba(243,242,239,0.55)",
              backdropFilter: "blur(6px)",
            }}
          >
            {/* Play triangle, nudged right so it reads centred in the circle. */}
            <svg width="16" height="18" viewBox="0 0 18 20" aria-hidden="true" style={{ marginLeft: 3 }}>
              <path d="M0 0 L18 10 L0 20 Z" fill="var(--paper)" />
            </svg>
          </span>
        </button>
      )}
    </>
  );
}
