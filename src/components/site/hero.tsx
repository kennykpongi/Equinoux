"use client";

/**
 * Hero — a single viewport, split composition.
 *
 * Desktop: the photograph holds the right half of the screen against an ink
 * field; the wordmark is set at display scale along the bottom-left edge with
 * the studio descriptor sitting above it. Below the large breakpoint the photo
 * goes full-bleed behind a scrim and the same anchors hold.
 *
 * The image is deliberately over-scaled (120%) inside a clipped frame so it can
 * drift on scroll without ever revealing an edge.
 */

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BRAND } from "./content";
import { Container } from "./layout";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "12%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", backgroundColor: "var(--ink)", color: "var(--paper)" }}
    >
      {/* Media plate — right half on desktop, full-bleed below it. */}
      <div className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-1/2">
        <motion.div className="absolute inset-x-0" style={{ top: "-10%", height: "120%", y: mediaY }}>
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center grayscale"
          />
        </motion.div>
        {/* Legibility scrim: heavy below the large breakpoint where type overlaps
            the photo, a soft left-edge blend above it. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "linear-gradient(180deg, rgba(11,11,11,0.30) 0%, rgba(11,11,11,0.55) 55%, rgba(11,11,11,0.88) 100%)" }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(90deg, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0) 32%)" }}
        />
      </div>

      {/* Content anchors: descriptor at ~53% of the viewport, wordmark on the
          baseline — the proportions the reference sets. */}
      <Container className="relative flex h-full flex-col justify-end pb-[6svh]">
        <motion.p
          className="t-meta max-w-[19rem] pb-[8svh]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: reduce ? 0 : 0.25 }}
        >
          Strategic design studio based in Abuja,
          <br />
          building brand and online experiences.
        </motion.p>

        <motion.h1
          className="t-display"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: reduce ? 0 : 0.35 }}
        >
          {BRAND.name}
          <br />
          Studio®
        </motion.h1>
      </Container>

      {/* Scroll affordance */}
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 hidden lg:block"
        style={{ padding: "var(--page-inset)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <span className="t-meta" style={{ color: "rgba(243,242,239,0.7)" }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
