"use client";

/**
 * Manifesto — the studio film, directly after the hero.
 *
 * The clip carries its own typography ("SINCE 2020 / STRATEGIC DESIGN STUDIO /
 * NIGERIA") so nothing is overlaid on it; the section is the film and nothing
 * else.
 *
 * The type in the film runs very nearly edge to edge, so any horizontal crop
 * eats words — and object-cover on a portrait phone viewport discards about
 * three quarters of the frame width, which turns STUDIO into "TUDI". So the
 * film only fills the screen from md up, where the crop costs ~120px a side and
 * takes nothing but texture. Below that it runs full-bleed at its own aspect
 * ratio in an ink field, and every word survives.
 *
 * Playback rules, including the phone cases, live in AutoVideo.
 */

import { AutoVideo } from "./auto-video";

export function Manifesto() {
  return (
    <section
      id="film"
      aria-label="Studio film"
      className="relative flex w-full items-center overflow-hidden py-[16svh] md:h-[100svh] md:py-0"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <AutoVideo
        src="/film/manifesto-loop.mp4"
        srcSmall="/film/manifesto-loop-sm.mp4"
        poster="/film/manifesto-poster.jpg"
        label="Equinoux, strategic design studio, Abuja, Nigeria. Established 2020."
        className="w-full object-contain md:absolute md:inset-0 md:h-full md:object-cover"
      />
    </section>
  );
}
