"use client";

/**
 * Contact — built to the reference's contact framework.
 *
 * Geometry measured at 1920:
 *   Ground     ink, white type throughout
 *   Background a fixed filmstrip of images, 935px tall, drifting left at
 *              ~100px/s; the page scrolls over it rather than with it
 *   Body       pt 240 / pb 120, page inset, a 4-column grid (455px, 20px
 *              gutter) with a 60px row gap
 *   Heading    the display scale in white, full container width
 *   Details    six labelled groups placed on that grid — label in muted white,
 *              value in full white, both at 14px
 *
 * There is no form here and none in the reference: the page's whole argument is
 * "write to us and say what you need". The homepage keeps its enquiry form for
 * anyone who'd rather fill in fields.
 *
 * Background images come from /public/site/contact, falling back to the About
 * folder and then to project covers, so the strip is never empty.
 */

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BRAND, SERVICES } from "./content";
import { Container, Roll } from "./layout";
import { ArrowUpRight } from "./primitives";

/** Filmstrip height and drift, both measured off the reference. */
const STRIP_HEIGHT = "min(87svh, 935px)";
const DRIFT_PX_PER_SECOND = 100;

/** Abuja is UTC+1 year-round — no daylight saving to track. */
const STUDIO_TIME_ZONE = "Africa/Lagos";

export function ContactPage({ backdrop }: { backdrop: string[] }) {
  return (
    <main
      className="relative"
      style={{ backgroundColor: "var(--ink)", color: "var(--paper)", minHeight: "100svh" }}
    >
      <Filmstrip images={backdrop} />

      <Container
        className="relative"
        style={{ paddingTop: "clamp(140px, 12.5vw, 240px)", paddingBottom: "clamp(80px, 6.25vw, 120px)", zIndex: 1 }}
      >
        {/* The display sentence is body copy set large, not the page's
            subject, so it is a <p>. The heading it was standing in for is
            carried by an sr-only <h1> instead — same pattern as the About
            hero — which keeps the reference layout intact while giving
            crawlers and screen readers a heading that names the page. */}
        <h1 className="sr-only">Contact Equinoux</h1>
        <p className="t-display">
          Send a short brief with references and what you need. We&rsquo;ll come
          back with an approach and a schedule.
        </p>

        <div
          className="mt-[var(--space-xl)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          // 60px row gap and a 20px gutter, straight off the reference.
          style={{ columnGap: "var(--space-xs)", rowGap: 60 }}
        >
          {/* Row 1 — col 1, col 3, col 4 (col 2 stays empty, as the reference) */}
          <Detail label="Local time">
            <StudioClock />
            <Value>West Africa Time · UTC+1</Value>
          </Detail>

          <div className="hidden lg:block" aria-hidden="true" />

          <Detail label="New enquiries">
            <ValueLink href={`mailto:${BRAND.email}`}>{BRAND.email}</ValueLink>
          </Detail>

          <Detail label="Social">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <ValueLink href={BRAND.instagram} external>
                Instagram
              </ValueLink>
              <ValueLink href="https://www.linkedin.com/" external>
                LinkedIn
              </ValueLink>
              <ValueLink href="https://dribbble.com/" external>
                Dribbble
              </ValueLink>
            </div>
          </Detail>

          {/* Row 2 */}
          <Detail label="Studio">
            <Value>{BRAND.location.replace(" · ", "\n")}</Value>
          </Detail>

          <div className="hidden lg:block" aria-hidden="true" />

          <Detail label="Direct">
            <ValueLink href={BRAND.phoneHref}>{BRAND.phone}</ValueLink>
            <ValueLink href={BRAND.whatsapp} external>
              WhatsApp
            </ValueLink>
          </Detail>

          <div className="hidden lg:block" aria-hidden="true" />

          {/* Row 3 — the reference's pill list, carrying what you can ask for */}
          <div className="hidden lg:block" aria-hidden="true" />
          <div className="hidden lg:block" aria-hidden="true" />

          <Detail label="Enquire about" className="sm:col-span-2 lg:col-span-2">
            <ul className="mt-1 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <li key={s.key}>
                  <Link
                    href="/#services"
                    className="tap t-meta inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-300 hover:bg-[color:var(--paper)] hover:text-[color:var(--ink)]"
                    style={{ border: "1px solid var(--line-inverse)" }}
                  >
                    {s.name}
                    <ArrowUpRight className="h-3 w-3 rotate-90" />
                  </Link>
                </li>
              ))}
            </ul>
          </Detail>
        </div>
      </Container>
    </main>
  );
}

/* ─────────────────────────── Pieces ─────────────────────────── */

function Detail({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="t-meta" style={{ color: "var(--ink-inverse)" }}>
        {label}
      </h2>
      <div className="mt-6 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <span className="t-meta whitespace-pre-line">{children}</span>
  );
}

function ValueLink({
  href,
  children,
  external,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="tap t-meta w-fit"
    >
      <Roll>{children}</Roll>
    </a>
  );
}

/**
 * The studio's local time, ticking. Rendered empty on the server and filled
 * after mount — the server has no idea what minute it is by the time the page
 * reaches a reader, and a stale baked-in clock is worse than none.
 */
function StudioClock() {
  /* The system clock is an external store, so it is read as one. The snapshot
     is a formatted string that only changes when the minute does, which is
     what keeps React from re-rendering on every tick. */
  const now = useSyncExternalStore(subscribeToClock, readStudioTime, readNoTime);

  return (
    <span className="t-meta tabular-nums">{now ?? "—"}</span>
  );
}

const CLOCK_FORMAT = {
  timeZone: STUDIO_TIME_ZONE,
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} as const;

function subscribeToClock(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

const readStudioTime = () => new Intl.DateTimeFormat("en-GB", CLOCK_FORMAT).format(new Date());

/** No clock on the server: whatever minute it renders in is wrong by the time
 *  anyone reads it, and a wrong time is worse than none. */
const readNoTime = () => null;

/**
 * The fixed filmstrip. Images run at a common height with their natural widths,
 * duplicated once so the -50% translate wraps seamlessly. Duration is derived
 * from the track's own length, so the drift stays at a constant speed however
 * many images are in the folder.
 */
function Filmstrip({ images }: { images: string[] }) {
  const reduce = useReducedMotion();
  // A square-ish frame at strip height; the exact width only sets the tempo.
  const approxFrameWidth = 620;
  const trackWidth = images.length * approxFrameWidth;
  const duration = Math.max(30, Math.round(trackWidth / DRIFT_PX_PER_SECOND));

  return (
    /* The fixed layer covers the whole viewport in ink, with the strip itself
       occupying the top band. Sizing it to the strip alone leaves the paper
       body ground showing through on an overscroll bounce, which on a page
       this dark reads as a flash of white. */
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "var(--ink)", zIndex: 0 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes eqx-strip-x{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
        .eqx-filmstrip{display:flex;width:max-content;height:100%;animation:eqx-strip-x var(--eqx-strip-duration) linear infinite;will-change:transform}
        @media (prefers-reduced-motion:reduce){.eqx-filmstrip{animation:none}}
      `}</style>

      {/* The strip itself occupies the top band, as on the reference. */}
      <motion.div
        className="absolute inset-x-0 top-0"
        style={{ height: STRIP_HEIGHT }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eqx-filmstrip" style={{ ["--eqx-strip-duration" as string]: `${duration}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex h-full">
              {images.map((src, i) => (
                <div key={`${copy}-${i}`} className="relative h-full shrink-0" style={{ width: approxFrameWidth }}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    // Only the first screenful is worth fetching eagerly.
                    priority={copy === 0 && i < 3}
                    sizes="620px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legibility: the display type sits straight on top of the photography. */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(11,11,11,0.42)" }} />
      </motion.div>
    </div>
  );
}
