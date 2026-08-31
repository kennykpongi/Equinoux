"use client";

/**
 * Testimonials — an editorial header over an edge-to-edge infinite marquee.
 *
 * The marquee is a CSS translate of a track that holds the card sequence twice;
 * shifting it by exactly -50% lands copy 2 where copy 1 began, so the loop is
 * seamless with no JS and no scroll listener. The duplicate copy is
 * aria-hidden, so assistive tech reads each quote once.
 *
 * The quotes are real, named and attributed, so the card carries the person:
 * their words, then their name, then their role and company. Add entries to
 * TESTIMONIALS and they join the marquee automatically.
 *
 * Cards are white and radiused against the paper ground — the one place on
 * the site that softens its corners, so the quotes read as something handed
 * over rather than another ink block. A hairline keeps the white edge legible
 * against paper, which sits only a few points below it.
 *
 * Cards share a height — the row would otherwise read ragged, since the
 * quotes run from eight words to sixty. They do not stretch their contents to
 * fill it though: an attribution pushed to the foot of a tall card ends up a
 * long way from the words it belongs to, so the content stacks from the top
 * and the slack falls at the bottom.
 */

import { Reveal } from "./primitives";
import { TESTIMONIALS } from "./content";
import { Container, Section } from "./layout";

/** Seconds for one full pass. Scaled by card count so density feels constant. */
const SECONDS_PER_CARD = 7;

function Card({ quote, name, role }: (typeof TESTIMONIALS)[number]) {
  return (
    <figure
      className="flex w-[16.5rem] shrink-0 flex-col rounded-2xl p-6 sm:w-[23rem] sm:p-7 md:w-[26rem]"
      style={{
        backgroundColor: "#ffffff",
        color: "var(--ink)",
        /* White on paper is only a few points apart, so the card needs an
           edge to read as a card rather than a lighter patch of ground. */
        border: "1px solid var(--line)",
      }}
    >
      <blockquote className="t-lede">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-8 border-t pt-6" style={{ borderColor: "var(--line-strong)" }}>
        <span className="t-meta block font-semibold">{name}</span>
        <span className="t-meta mt-1 block" style={{ color: "var(--muted)" }}>
          {role}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  // A short list would make a track narrower than the viewport, which breaks
  // the seamless wrap — double it first so one copy always overflows.
  const sequence = TESTIMONIALS.length < 5 ? [...TESTIMONIALS, ...TESTIMONIALS] : TESTIMONIALS;
  const duration = sequence.length * SECONDS_PER_CARD;

  return (
    <Section id="testimonials" top="2xl" className="overflow-hidden">
      <style>{`
        @keyframes eqx-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
        .eqx-marquee-track{display:flex;width:max-content;animation:eqx-marquee var(--eqx-duration) linear infinite;will-change:transform}
        @media (hover:hover){
          .eqx-marquee:hover .eqx-marquee-track{animation-play-state:paused}
        }
        /* Halt the loop and let the row be scrolled by hand instead. */
        @media (prefers-reduced-motion:reduce){
          .eqx-marquee-track{animation:none}
          .eqx-marquee{overflow-x:auto}
        }
      `}</style>

      <Container>
        <Reveal>
          <h2 className="t-display text-balance">
            We could tell you
            <br className="hidden sm:inline" />{" "}
            we&rsquo;re good<span style={{ color: "var(--muted)" }}>*</span>
          </h2>
          <p className="t-meta mt-8" style={{ color: "var(--muted)" }}>
            *But they&rsquo;re more convincing
          </p>
        </Reveal>
      </Container>

      {/* Infinite marquee — full-bleed, fading into the paper at both edges */}
      <div
        className="eqx-marquee relative mt-[var(--space-lg)]"
        style={{
          ["--eqx-duration" as string]: `${duration}s`,
          maskImage: "linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%)",
        }}
      >
        <div className="eqx-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-[var(--grid-gap)] pr-[var(--grid-gap)]" aria-hidden={copy === 1}>
              {sequence.map((t, i) => (
                <Card key={`${copy}-${i}`} {...t} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
