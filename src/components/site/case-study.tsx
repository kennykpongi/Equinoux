"use client";

/**
 * Case study — one editorial template for every project.
 *
 * Replaces the four bespoke per-project pages, which each carried their own
 * animation stack (GSAP/ScrollTrigger, a custom cursor, a lightbox) and their
 * own visual language. One template means one set of tokens, one motion
 * vocabulary, and imagery that gets the same breathing room everywhere.
 *
 * Reading order: title → facts → the work at full scale → then the argument
 * and the evidence alternating, a paragraph at a time → the outcome.
 *
 * The narrative is deliberately not delivered in one block. Brief, Challenge
 * and Approach are spread across the first three chapters of work, so each
 * paragraph introduces the images that follow it and the page reads as a
 * visual story rather than an essay with a gallery bolted on. A chapter that
 * carries an introduction sits closer to it than the usual band spacing, so
 * the two read as one unit. Remaining chapters run on uninterrupted, and the
 * pinned index still makes the whole length navigable.
 */

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { getNextProject, type Chapter, type Media, type Project } from "./projects-data";
import { Container, LabelRow, Roll, Section, type Space } from "./layout";
import { Reveal, ArrowUpRight, ArrowRight, useMounted } from "./primitives";
import { AutoVideo } from "./auto-video";

/** Column counts, as literal classes so Tailwind can see them. */
const COLS: Record<Chapter["cols"], string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

/** What each frame is actually asked to render, so the CDN sends that width. */
const SIZES: Record<Chapter["cols"], string> = {
  1: "100vw",
  2: "(min-width: 768px) 50vw, 100vw",
  3: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
};

/**
 * Where an in-page link parks its target: just clear of the pinned index.
 * Anchors sit on each band's container rather than the band itself, so a jump
 * lands on the heading instead of a screenful of the band's top padding.
 */
const ANCHOR_OFFSET = 145;

export function CaseStudy({ project }: { project: Project }) {
  const next = getNextProject(project.slug);
  const hero = project.hero.kind === "image" && project.hero.src ? project.hero.src : project.cover;

  const facts = [
    { label: "Client", value: project.client },
    { label: "Sector", value: project.industry ?? "—" },
    { label: "Scope", value: project.role.join(", ") },
    { label: "Disciplines", value: project.disciplines.join(", ") },
    { label: "Year", value: project.year },
  ];

  const chapters = [
    { n: "01", title: "Brief", body: project.brief },
    { n: "02", title: "Challenge", body: project.challenge },
    { n: "03", title: "Approach", body: project.approach },
  ];

  const index = [
    ...project.chapters.map((c) => ({ id: c.id, label: c.label })),
    { id: "outcome", label: "Outcome" },
  ];

  return (
    <>
      {/* ── Header ── */}
      <Section top="none">
        <Container style={{ paddingTop: "var(--space-2xl)" }}>
          <Link href="/work" className="tap t-meta inline-flex items-center gap-2" style={{ color: "var(--muted)" }}>
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            <Roll>All works</Roll>
          </Link>

          <h1 className="t-display mt-8">{project.title}</h1>

          <div className="mt-[var(--space-lg)] grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--space-sm)" }}>
            <p className="t-statement">{project.summary}</p>
            <dl className="lg:pt-2">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-[8.5rem_1fr] gap-4 border-t py-4"
                  style={{ borderColor: "var(--line-strong)" }}
                >
                  <dt className="t-meta" style={{ color: "var(--muted)" }}>
                    {f.label}
                  </dt>
                  <dd className="t-meta">{f.value}</dd>
                </div>
              ))}
              <div className="border-t" style={{ borderColor: "var(--line-strong)" }} />
            </dl>
          </div>
        </Container>
      </Section>

      {/* ── Hero media, full-bleed ── */}
      {hero && (
        <div className="mt-[var(--space-xl)]">
          <ParallaxMedia src={hero} alt={`${project.title}: ${project.tag}`} priority height="clamp(340px, 74svh, 900px)" />
        </div>
      )}

      <ChapterIndex sections={index} />

      {/* ── The argument and the evidence, alternating ── */}
      {project.chapters.map((chapter, i) => {
        const intro = chapters[i];
        return (
          <Fragment key={chapter.id}>
            {intro && <Argument {...intro} />}
            {/* A chapter that follows its own introduction closes up against
                it; the rest keep the full band spacing. */}
            <ChapterBand chapter={chapter} title={project.title} top={intro ? "lg" : "2xl"} />
          </Fragment>
        );
      })}

      {/* ── Outcome ── */}
      <Section top="2xl">
        <Container id="outcome" style={{ scrollMarginTop: ANCHOR_OFFSET }}>
          <LabelRow label="Outcome" as="h2">
            <Reveal>
              <p className="t-statement max-w-[30ch]">{project.outcome}</p>
            </Reveal>
          </LabelRow>

          {project.metrics && project.metrics.length > 0 && (
            <div
              className="mt-[var(--space-xl)] grid grid-cols-1 sm:grid-cols-3"
              style={{ gap: "var(--grid-gap)" }}
            >
              {project.metrics.map((m, i) => (
                <Reveal
                  key={m.label}
                  delay={i * 0.08}
                  className="border-t pt-6"
                  style={{ borderColor: "var(--line-strong)" }}
                >
                  <div className="t-title">{m.value}</div>
                  <div className="t-meta mt-3" style={{ color: "var(--muted)" }}>
                    {m.label}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── Next project ── */}
      <Section top="2xl" bottom="none">
        <Container>
          <span className="t-meta" style={{ color: "var(--muted)" }}>
            Next project
          </span>
        </Container>
        <Link href={`/work/${next.slug}`} className="group mt-6 block">
          {next.cover && (
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "clamp(280px, 56svh, 680px)", backgroundColor: "var(--paper-soft)" }}
            >
              <Image
                src={next.cover}
                alt=""
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(11,11,11,0.35)" }} />
              <Container className="absolute inset-0 flex flex-col justify-end pb-[var(--space-sm)]">
                <span className="t-title" style={{ color: "var(--paper)" }}>
                  <Roll>{next.title}</Roll>
                </span>
                <span className="t-meta mt-3 inline-flex items-center gap-2" style={{ color: "rgba(243,242,239,0.75)" }}>
                  {next.tag}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Container>
            </div>
          )}
        </Link>
      </Section>
    </>
  );
}

/* ─────────────────────────── Pieces ─────────────────────────── */

/**
 * The pinned chapter index, same mechanic as the studio page: it marks the
 * last section whose top has passed under the bar, so it always names the
 * chapter you are actually looking at. It carries the paper ground because
 * section labels scroll directly beneath it.
 *
 * The bar scrolls horizontally on narrow screens rather than wrapping — a
 * two-line index that changes height as it pins is worse than a swipe.
 */
function ChapterIndex({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0].id);

  /* Depended on as a string: `sections` is built inline by the parent, so a
     reference dependency would re-subscribe on any future re-render. */
  const ids = sections.map((s) => s.id).join(",");

  useEffect(() => {
    const list = ids.split(",");
    const THRESHOLD = 200; // just below the pinned bar
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current = list[0];
        for (const id of list) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= THRESHOLD) current = id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return (
    <div
      className="sticky z-30"
      style={{ top: 94, backgroundColor: "var(--paper)", paddingTop: 14, paddingBottom: 14 }}
    >
      <Container>
        <nav aria-label="Case study sections" className="rail -mx-1 overflow-x-auto px-1">
          <ul className="flex w-max gap-7 md:w-full md:justify-between md:gap-4">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  className="tap t-meta whitespace-nowrap transition-colors duration-500"
                  style={{ color: active === s.id ? "var(--ink)" : "rgba(11,11,11,0.28)" }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}

/** One paragraph of the argument, introducing the chapter beneath it. */
function Argument({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <Section top="2xl">
      <Container>
        <Reveal>
          <LabelRow label={`${n} ${title}`} as="h2">
            <p className="t-lede max-w-[64ch]">{body}</p>
          </LabelRow>
        </Reveal>
      </Container>
    </Section>
  );
}

/** One labelled band of delivered work. */
function ChapterBand({ chapter, title, top = "2xl" }: { chapter: Chapter; title: string; top?: Space }) {
  return (
    <Section top={top}>
      <Container id={chapter.id} style={{ scrollMarginTop: ANCHOR_OFFSET }}>
        <LabelRow label={chapter.label} as="h2">
          <div className={`grid ${COLS[chapter.cols]}`} style={{ gap: "var(--space-sm)", alignItems: "start" }}>
            {chapter.media.map((m) => (
              <Figure key={m.src} media={m} title={title} cols={chapter.cols} />
            ))}
          </div>
        </LabelRow>
      </Container>
    </Section>
  );
}

/**
 * One asset in its frame.
 *
 * Photography is cropped to the frame it was given. Artwork is contained
 * inside it instead (a mark with its edges cut off is not a mark), which is
 * also why reversed artwork carries its own ground: white on paper is nothing.
 *
 * `caption` is deliberately not printed under the frame. Naming every plate
 * ("Flask", "T-shirt", "Business card") turned the page into an inventory
 * list and described what the reader could already see. It stays in the data
 * as the alt text, so the work is still named for anyone who cannot see it.
 */
function Figure({ media, title, cols }: { media: Media; title: string; cols: Chapter["cols"] }) {
  const alt = `${title}: ${media.caption}`;

  return (
    <Reveal style={media.full ? { gridColumn: "1 / -1" } : undefined}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: media.ratio,
          backgroundColor: media.ground ?? "var(--paper-soft)",
        }}
      >
        {media.video ? (
          <AutoVideo
            src={media.video}
            srcSmall={media.videoSmall}
            poster={media.src}
            label={alt}
            className={`absolute inset-0 h-full w-full ${media.contain ? "object-contain" : "object-cover"}`}
          />
        ) : (
          <Image
            src={media.src}
            alt={alt}
            fill
            sizes={media.full ? "100vw" : SIZES[cols]}
            className={media.contain ? "object-contain p-[6%]" : "object-cover"}
          />
        )}
      </div>
    </Reveal>
  );
}

/**
 * A full-bleed plate whose photo is over-scaled inside a clipped frame, so it
 * drifts as the plate crosses the viewport without ever showing an edge.
 */
function ParallaxMedia({
  src,
  alt,
  height,
  priority,
}: {
  src: string;
  alt: string;
  height: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Gated on mount for the same reason as Reveal: the server always takes the
  // non-reduced arm, so branching here during render disagrees with a
  // reduced-motion client and React reports a mismatch on the transform.
  const mounted = useMounted();
  const y = useTransform(scrollYProgress, [0, 1], reduce && mounted ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height, backgroundColor: "var(--paper-soft)" }}>
      <motion.div className="absolute inset-x-0" style={{ top: "-10%", height: "120%", y }}>
        <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
