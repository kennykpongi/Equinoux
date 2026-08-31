"use client";

/**
 * Services — the reference's card row, measured off a 30fps screen capture.
 *
 * Geometry at a 1920 viewport:
 *   Grid     four equal columns across the full 20px-inset container, ~5px
 *            gutter; media 455 x 463, so effectively square
 *   Title    16px near-black, 22px below the media
 *   Meta     13px at rgb(163,162,161), 19px below the title
 *
 * Motion, fitted frame by frame (see `.flip` in globals.css):
 *   Hover    a two-image track slides by exactly one frame in ~0.47s on an
 *            ease-out. The second image rises from below and the first leaves
 *            through the top, both translating together — not a wipe, not a
 *            crossfade. It reverses on the way out.
 *   Scroll   in the capture the row carries no reveal at all: it tracks the
 *            page 1:1 with no fade, no parallax and no entry lag (measured —
 *            the row and the section below it move by identical deltas every
 *            frame). What reads as animation is the inertial scroll settle,
 *            which Lenis already supplies site-wide. The cards keep this
 *            site's fade-and-rise on entry so the section does not pop in
 *            against its neighbours; everything else here is the capture.
 *
 * The second frame of each card is a client's brand key visual, so hovering
 * names the work rather than decorating the card. They live in /public/brand,
 * one per client, kept out of the portfolio folders because the case studies
 * account for every file in theirs. Design Systems still shows a project
 * photograph — there is no fifth key visual yet.
 *
 * This replaces the accordion that stood here. Its `headline` copy is now the
 * card's meta line; `body` and `points` remain in content.ts, unrendered, for
 * a services page that can carry them at length.
 */

import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "./content";
import { Container, Roll, Section } from "./layout";
import { Reveal, ArrowUpRight } from "./primitives";

export function Services() {
  return (
    <Section id="services" top="2xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>
          <Reveal>
            <h2 className="t-display">Services</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:self-end lg:pb-3">
            <p className="t-statement max-w-[24ch]">
              Five disciplines,
              <br />
              one system.
            </p>
          </Reveal>
        </div>

        <ul
          className="mt-[var(--space-lg)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          style={{ gap: "var(--grid-gap)" }}
        >
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 0.06}>
              <ServiceCard
                name={s.name}
                meta={s.headline}
                rest={s.image}
                flip={s.flip}
              />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-[var(--space-sm)]">
          <Link href="/contact" className="tap t-meta inline-flex items-center gap-2">
            <Roll>Start a project</Roll>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * One card. The frame is square and clipped; the track inside it is twice as
 * tall and holds both images, so the flip is a single transform on one node.
 */
function ServiceCard({
  name,
  meta,
  rest,
  flip,
}: {
  name: string;
  meta: string;
  rest: string;
  flip: string;
}) {
  return (
    <div className="group">
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1 / 1", backgroundColor: "var(--paper-soft)" }}
      >
        <div className="flip">
          <div className="relative h-1/2 w-full">
            <Image
              src={rest}
              alt={name}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative h-1/2 w-full">
            <Image
              src={flip}
              alt=""
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* 22px under the media, then 19px to the meta line — both measured. */}
      <h3 className="t-lede" style={{ marginTop: 22 }}>
        {name}
      </h3>
      <p className="t-meta" style={{ marginTop: 12, color: "var(--muted)" }}>
        {meta}
      </p>
    </div>
  );
}
