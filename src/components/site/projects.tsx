"use client";

/**
 * Selected work — a continuous media column with the index beside it.
 *
 * Desktop geometry, measured off the reference:
 *   • the media column is exactly half the viewport, flush to the left edge
 *     with no page inset, and the images stack contiguously — no gaps
 *   • each image is 600px tall at 1920 (31.25vw, capped)
 *   • the caption sits in the right column, top-aligned to its image, one
 *     10px gutter away: project name in ink, client in muted, 20px line step
 *   • no section heading — the list is the section
 *
 * The motion is a lag on entry, not a parallax. Inside an image the content
 * tracks its own frame 1:1; what moves is the row itself. A row appearing from
 * the bottom of the viewport starts pulled up over the image above it and
 * slides down into place, settling once its top reaches ~78% of the viewport.
 * Because each row is transformed it makes its own stacking context, so later
 * rows paint over earlier ones and the overlap reads as a reveal.
 *
 * Below the large breakpoint this recomposes into full-bleed strips with the
 * caption beneath — the reference's own small-screen variant, and the only
 * arrangement where a 50/50 split would leave both halves unusable.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { PROJECTS, type Project } from "./projects-data";
import { CoverMedia } from "./cover-media";
import { useMounted } from "./primitives";
import { Container, Roll, Section } from "./layout";
import { ArrowUpRight } from "./primitives";

/** 600px at a 1920 viewport, scaling down and never growing past it. */
const MEDIA_HEIGHT = "clamp(280px, 31.25vw, 600px)";

/**
 * Entry lag, fitted to the reference frame-by-frame.
 *
 * A row's lift is linear in its viewport position with slope -0.566, reaching
 * zero once its natural top is 78.8% of the way down the viewport. Net effect:
 * the row travels at 0.434x scroll speed while entering, then locks to 1x.
 *
 * Expressed against viewport height rather than row height, because that is
 * what the measurement is actually proportional to — the settle line is a
 * position on screen, not a fraction of the image.
 *
 *   window   1.20vh (well below the fold) -> 0.788vh (settle)
 *   lift     0.566 * (1.20 - 0.788) = 0.233  ->  23vh
 */
const ENTRY_START = "start 1.2";
const ENTRY_SETTLE = "start 0.788";
const ENTRY_LIFT = "-23vh";

export function Projects() {
  const shown = PROJECTS.filter((p) => p.cover);

  return (
    <Section id="work" top="xl">
      {/* The reference shows no heading here. Keeping one for the document
          outline and for anyone navigating by headings, without painting it. */}
      <h2 className="sr-only">Selected work</h2>

      {/* ── Desktop: continuous media column + aligned index ── */}
      <div className="hidden lg:block">
        {shown.map((p) => (
          <ProjectRow key={p.slug} project={p} />
        ))}

        <Container className="mt-[var(--space-lg)]">
          <Link
            href="/work"
            className="tap t-meta inline-flex w-fit items-center gap-2 underline-offset-[6px] hover:underline"
          >
            <Roll>All projects</Roll>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </div>

      {/* ── Below the large breakpoint: full-bleed strips ── */}
      <div className="lg:hidden">
        <div className="flex flex-col gap-[var(--space-md)]">
          {shown.map((p) => (
            <ProjectStrip key={p.slug} project={p} />
          ))}
        </div>

        <Container className="mt-[var(--space-md)]">
          <Link href="/work" className="tap t-meta inline-flex items-center gap-2 underline underline-offset-[6px]">
            All projects
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </div>
    </Section>
  );
}

/** One row: half-width media flush left, caption top-aligned beside it. */
function ProjectRow({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Linear the whole way — no easing. The lag itself is the effect; easing on
  // top of it makes the row visibly decelerate, which the reference does not.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [ENTRY_START, ENTRY_SETTLE],
  });
  // Gated on mount: the server always takes the non-reduced arm, so branching
  // here during render disagrees with a reduced-motion client.
  const mounted = useMounted();
  const y = useTransform(scrollYProgress, [0, 1], reduce && mounted ? ["0vh", "0vh"] : [ENTRY_LIFT, "0vh"]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative">
      <Link
        href={`/work/${project.slug}`}
        className="group grid"
        style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--grid-gap)" }}
      >
        {/* Media — flush to the viewport's left edge, no inset. */}
        <div
          className="relative overflow-hidden"
          style={{ height: MEDIA_HEIGHT, backgroundColor: "var(--paper-soft)" }}
        >
          <CoverMedia project={project} sizes="50vw" />
        </div>

        {/* Caption — top-aligned with the image.

            The reference's second line is the client, which works there
            because the project and the client are named differently. Half of
            ours are the same string ("Kaysteph Group" / "Kaysteph Group"), so
            the pair reads as a stutter — the sector carries real information
            in the same slot instead. */}
        <div style={{ paddingRight: "var(--page-inset)" }}>
          <span className="t-meta block">
            <Roll>{project.title}</Roll>
          </span>
          <span className="t-meta block" style={{ color: "var(--muted)" }}>
            {project.industry ?? project.tag}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Small-screen variant: a full-bleed strip with the caption beneath it. */
function ProjectStrip({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="block">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(260px, 52vw, 400px)", backgroundColor: "var(--paper-soft)" }}
      >
        <CoverMedia project={project} sizes="100vw" />
      </div>
      <Container className="mt-[var(--space-2xs)]">
        <div className="t-meta">{project.title}</div>
        <div className="t-meta" style={{ color: "var(--muted)" }}>
          {project.industry ?? project.tag}
        </div>
      </Container>
    </Link>
  );
}
