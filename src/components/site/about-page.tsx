"use client";

/**
 * About — built to the reference's About framework, section for section.
 *
 * Structure and geometry, measured at 1920:
 *   Hero        ghost wordmark at ~171px behind a centred media plate that
 *               drifts toward the pointer; the section index sits at its foot
 *   Index       sticky at top:120, six evenly-spread labels, active in ink and
 *               the rest recessive
 *   About       pt 200 — "Intro about us" label + a 32px statement across the
 *               left half; "Focus and our value" label + a 14px list on the right
 *   Team        pt 240 — members alternate left/right, media 622 wide with the
 *               name set on the outer edge, top-aligned
 *   Service     pt 240 — industries at 14px on the left, the service list at
 *               64px through the middle, a media plate + link on the right
 *   Approach    pt 240 — a clipped cover column stepping through phases, an
 *               underlined phase list, and the active phase's copy on the right
 *   Clients     pt 240 — a 64px statement, then client pills and a media plate
 *   Marquee     a full-bleed strip of project imagery closing the page
 *
 * Every figure below comes from content.ts or projects-data.ts. The reference's
 * "Honors & press" band is deliberately absent: Equinoux has no awards or press
 * to list, and the alternative is fabricating credentials.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { BRAND, TEAM, TEAM_SUMMARY, SERVICES, PROCESS, TRUST } from "./content";
import { PROJECTS } from "./projects-data";
import { Container, Roll, Section } from "./layout";
import { Reveal, ArrowUpRight } from "./primitives";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "team", label: "Team" },
  { id: "service", label: "Service" },
  { id: "approach", label: "Approach" },
  { id: "clients", label: "Clients" },
] as const;

/** How the studio actually works — a restatement of practice, not claims. */
const FOCUS = [
  "Strategy before surface",
  "Systems, not single assets",
  "Craft in the details",
  "Honest collaboration",
  "Senior attention throughout",
  "Production-ready outcomes",
];

/**
 * Each phase's key points, summarised from its own description in PROCESS —
 * what that phase produces, not invented deliverables.
 */
const PHASE_POINTS: Record<string, string[]> = {
  "01": ["Business", "Market", "Audience", "Success criteria"],
  "02": ["Positioning", "Creative direction", "Blueprint"],
  "03": ["Identity", "System", "Typography & motion"],
  "04": ["Launch", "Hand-off", "Ongoing partnership"],
};

/** Used when /public/site/about is empty, so the hero is never blank. */
const FALLBACK_HERO_IMAGE = "/site/menu.jpg";

export function AboutPage({ heroImages = [] }: { heroImages?: string[] }) {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const images = heroImages.length > 0 ? heroImages : [FALLBACK_HERO_IMAGE];

  /* The index marks the last section whose top has passed under the bar.
     An IntersectionObserver band was tried first and reads a section behind
     whenever a tall section is still clipping the band — this is deterministic
     and always names the section you are actually looking at. */
  useEffect(() => {
    const THRESHOLD = 200; // just below the pinned bar
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Widened: SECTIONS is `as const`, so this would otherwise narrow to
        // the first id's literal type and reject every later assignment.
        let current: string = SECTIONS[0].id;
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= THRESHOLD) current = s.id;
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
  }, []);

  return (
    <>
      <AboutHero images={images} />

      {/* The index sits at the foot of the hero, then pins under the nav.
          It carries the paper ground so section labels scroll cleanly beneath
          it — on the reference the two collide and the bar becomes unreadable
          against the copy passing under it. */}
      <div
        className="sticky z-30"
        style={{ top: 94, backgroundColor: "var(--paper)", paddingTop: 14, paddingBottom: 14 }}
      >
        <Container>
          <nav aria-label="Page sections" className="flex justify-between">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className="tap t-meta transition-colors duration-500"
                style={{ color: active === s.id ? "var(--ink)" : "rgba(11,11,11,0.28)" }}
              >
                <Roll>{s.label}</Roll>
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <AboutIntro />
      <TeamBand />
      <ServiceBand />
      <ApproachBand />
      <ClientsBand />
      <ClosingMarquee />
    </>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

/** Pointer travel, in px, that advances the plate to the next image. */
const TRAVEL_PER_IMAGE = 1100;
/** Fallback cadence where there is no fine pointer (touch, or reduced motion). */
const AUTO_ADVANCE_MS = 4000;

/**
 * A ghost wordmark sized to the full container width sits behind a centred
 * media plate.
 *
 * The plate does two things with the pointer: it drifts toward it, and it
 * advances through the image set as the pointer travels — so the media is
 * genuinely driven by the cursor rather than just decorated by it. Without a
 * fine pointer (or under reduced motion) it falls back to a slow timer, and
 * with a single image it simply sits still.
 *
 * Images come from /public/site/about, read at build time — see
 * lib/public-media.ts. Nothing here needs editing to add or remove one.
 */
function AboutHero({ images }: { images: string[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [index, setIndex] = useState(0);

  const count = images.length;

  /* Which frames are actually in the DOM: the current one, the one before it
     so the cross-fade has something to fade out of, and the one after so it is
     already fetched when its turn comes. Three at a time however large the
     folder gets. Frames that drop out come back from cache. */
  const mounted = new Set([index, (index + 1) % count, (index - 1 + count) % count]);

  /* Pointer drift + travel-driven advance. */
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    let travel = 0;
    let last: { x: number; y: number } | null = null;

    const onMove = (e: MouseEvent) => {
      const b = el.getBoundingClientRect();
      // −1..1 from the centre, scaled right down: this is a drift, not a chase.
      const dx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
      const dy = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        if (plateRef.current) {
          plateRef.current.style.transform = `translate3d(${(dx * 26).toFixed(1)}px, ${(dy * 18).toFixed(1)}px, 0)`;
        }
      });

      if (count > 1) {
        if (last) travel += Math.hypot(e.clientX - last.x, e.clientY - last.y);
        last = { x: e.clientX, y: e.clientY };
        if (travel >= TRAVEL_PER_IMAGE) {
          travel = 0;
          setIndex((i) => (i + 1) % count);
        }
      }
    };

    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [reduce, count]);

  /* Timer fallback wherever the pointer can't drive it. */
  useEffect(() => {
    if (count < 2) return;
    if (!reduce && window.matchMedia("(pointer: fine)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduce, count]);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "min(95svh, 1026px)" }}
    >
      <h1 className="sr-only">
        {BRAND.name}, strategic design studio, {BRAND.location}
      </h1>

      {/* Ghost wordmark. Decorative: the real heading is above. */}
      <Container className="pointer-events-none absolute inset-x-0" aria-hidden="true">
        <div
          className="w-full whitespace-nowrap text-center font-bold"
          style={{
            color: "var(--paper-soft)",
            fontSize: "clamp(3rem, 11.2vw, 13.4rem)",
            lineHeight: 1,
            letterSpacing: "-0.08em",
          }}
        >
          {BRAND.name} Studio®
        </div>
      </Container>

      <motion.div
        ref={plateRef}
        className="relative overflow-hidden"
        style={{
          // 640px at 1920 to match the reference, but floored so it stays the
          // dominant element on a phone — 42vw alone renders a 157px thumbnail
          // there and hands the LCP to an image further down the page.
          width: "clamp(260px, 42vw, 640px)",
          aspectRatio: "1 / 1",
          backgroundColor: "var(--paper-soft)",
          transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)",
          willChange: "transform",
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Frames are stacked and cross-faded rather than swapped, so the plate
            never flashes the empty ground between two images.

            Every frame lives inside the visible plate, so `loading="lazy"`
            defers nothing — mounting all of them would fetch the entire folder
            on first paint, which at sixteen images is several megabytes for
            pictures most visitors never stay long enough to see. */}
        {images.map((src, i) =>
          mounted.has(i) ? (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 1600px) 640px, (min-width: 1024px) 42vw, 90vw"
              className="object-cover grayscale transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ objectPosition: "center", opacity: i === index ? 1 : 0 }}
            />
          ) : null
        )}
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── About ─────────────────────────── */

function AboutIntro() {
  return (
    <Section id="about" top="xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--space-sm)" }}>
          <Reveal>
            <h2 className="t-meta" style={{ color: "var(--muted)" }}>
              Intro about us
            </h2>
            {/* 32px / 1.1 / -0.03em, filling the column — the reference sets
                this measure to the full half-width, not a narrow paragraph. */}
            <p
              className="mt-9"
              style={{ fontSize: "clamp(1.5rem, 1.67vw, 2rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              {BRAND.name}® is an independent, founder-led design studio working
              across brand strategy, identity, web and design systems. We help
              ambitious teams look consistent, read clearly, and hold their
              position, whether someone meets you on a website, a storefront or
              a business card. Every engagement starts with the underlying logic
              and ends with a system built to stay coherent as the business grows.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end lg:text-right">
            <h2 className="t-meta" style={{ color: "var(--muted)" }}>
              Focus and our value
            </h2>
            <ul className="mt-9 flex flex-col gap-1">
              {FOCUS.map((f) => (
                <li key={f} className="t-meta">
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ─────────────────────────── Team ─────────────────────────── */

/**
 * Members alternate sides: the first sits in the right half with its name to
 * the right of the media, the second in the left half with its name set flush
 * right before the media. With a single founder only the first slot is used —
 * adding a second entry to TEAM fills the other side automatically.
 */
function TeamBand() {
  return (
    <Section id="team" top="2xl">
      <Container>
        <h2 className="t-meta" style={{ color: "var(--muted)" }}>
          Team
        </h2>

        <div className="mt-10 flex flex-col" style={{ gap: "var(--space-sm)" }}>
          {TEAM.map((m, i) => {
            const onRight = i % 2 === 0;
            return (
              <Reveal key={m.name} className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>
                {/* Spacer keeps the member in its half on desktop. */}
                {onRight && <div className="hidden lg:block" aria-hidden="true" />}

                <div
                  className={`flex flex-col gap-4 sm:flex-row ${onRight ? "" : "sm:flex-row-reverse"}`}
                  style={{ gap: "var(--grid-gap)" }}
                >
                  <div
                    className="relative w-full sm:w-[66%]"
                    style={{ aspectRatio: "4 / 3", backgroundColor: "var(--paper-soft)" }}
                  >
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover grayscale"
                      style={{ objectPosition: "center 25%" }}
                    />
                  </div>
                  <div className={onRight ? "" : "sm:text-right"}>
                    <h3 className="t-meta">{m.name}</h3>
                    <p className="t-meta" style={{ color: "var(--muted)" }}>
                      {m.role}
                    </p>
                    <p className="t-meta mt-6 max-w-[26ch]" style={{ color: "var(--muted)" }}>
                      {m.bio}
                    </p>
                  </div>
                </div>

                {!onRight && <div className="hidden lg:block" aria-hidden="true" />}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ─────────────────────────── Service ─────────────────────────── */

function ServiceBand() {
  const feature = PROJECTS.find((p) => p.cover);

  return (
    <Section id="service" top="2xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr]" style={{ gap: "var(--space-sm)" }}>
          {/* Industries */}
          <Reveal>
            <h2 className="t-meta" style={{ color: "var(--muted)" }}>
              Industries
            </h2>
            <ul className="mt-8 flex flex-col gap-1">
              {TRUST.industries.map((s) => (
                <li key={s} className="t-meta">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Service list at display scale */}
          <Reveal delay={0.08}>
            <h2 className="t-meta" style={{ color: "var(--muted)" }}>
              Service
            </h2>
            <ul className="mt-8">
              {SERVICES.map((s) => (
                <li key={s.key} className="t-statement">
                  {s.name}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Media + link. The reference plays a showreel here; Equinoux has no
              reel, so this opens the work index instead of implying a film. */}
          <Reveal delay={0.16}>
            {feature?.cover && (
              <Link href="/work" className="group block">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "4 / 3", backgroundColor: "var(--paper-soft)" }}
                >
                  <Image
                    src={feature.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <span className="t-meta mt-3 inline-flex items-center gap-2">
                  <Roll>See the work</Roll>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ─────────────────────────── Approach ─────────────────────────── */

/**
 * A three-column stepper. Scrolling through the band advances the phase; the
 * cover column steps to match, the phase list marks the active row, and the
 * copy on the right swaps. The phase rows are also buttons, so the whole thing
 * is operable without scrolling and from the keyboard.
 */
function ApproachBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false); // set by a click; stops scroll from overriding

  const covers = useMemo(() => PROJECTS.filter((p) => p.cover).map((p) => p.cover as string), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.9"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinned) return;
    const next = Math.min(PROCESS.length - 1, Math.max(0, Math.floor(v * PROCESS.length)));
    setStep(next);
  });

  const phase = PROCESS[step];

  return (
    <Section id="approach" top="2xl">
      <Container>
        <h2 className="t-meta" style={{ color: "var(--muted)" }}>
          Approach
        </h2>

        <div ref={ref} className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr]" style={{ gap: "var(--space-sm)" }}>
          {/* Cover column — a clipped window over a stack that steps by 100%. */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", backgroundColor: "var(--paper-soft)" }}>
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ height: `${covers.length * 100}%` }}
              animate={{ y: `${(-step * 100) / covers.length}%` }}
              transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {covers.map((src, i) => (
                <div key={src} className="relative w-full" style={{ height: `${100 / covers.length}%` }}>
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  <span className="sr-only">{i + 1}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phase list */}
          <ul className="flex flex-col self-start">
            {PROCESS.map((p, i) => (
              <li key={p.n} className="border-b" style={{ borderColor: "var(--line-strong)" }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(i);
                    setPinned(true);
                  }}
                  aria-current={step === i ? "step" : undefined}
                  className="tap t-meta flex w-full items-center justify-between py-3 text-left transition-colors duration-400"
                  style={{ color: step === i ? "var(--ink)" : "rgba(11,11,11,0.35)" }}
                >
                  <Roll>{p.title}</Roll>
                  <span className="tabular-nums">{p.n}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Active phase copy */}
          <div className="self-start">
            <motion.div key={phase.n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.4 }}>
              <p className="t-meta max-w-[34ch]">{phase.body}</p>
              <ul className="mt-10 flex flex-col gap-1">
                {(PHASE_POINTS[phase.n] ?? []).map((k) => (
                  <li key={k} className="t-meta" style={{ color: "var(--muted)" }}>
                    {k}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─────────────────────────── Clients ─────────────────────────── */

function ClientsBand() {
  const clients = PROJECTS.map((p) => p.client);
  const [hover, setHover] = useState(0);
  const withCovers = PROJECTS.filter((p) => p.cover);

  return (
    <Section id="clients" top="2xl">
      <Container>
        <Reveal>
          <h2 className="t-statement max-w-[26ch]">
            We work with brands and teams that treat craft as a competitive
            advantage, from first identity to an established business
            sharpening its direction.
          </h2>
        </Reveal>

        <div className="mt-[var(--space-xl)] grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr]" style={{ gap: "var(--space-sm)" }}>
          <div className="hidden lg:block" aria-hidden="true" />

          <Reveal>
            <ul className="flex flex-col items-start gap-2">
              {clients.map((c, i) => (
                <li key={c}>
                  <Link
                    href={`/work/${PROJECTS[i].slug}`}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    className="tap t-meta inline-block rounded-full px-4 py-2 transition-colors duration-300"
                    style={{
                      backgroundColor: hover === i ? "var(--ink)" : "var(--paper-soft)",
                      color: hover === i ? "var(--paper)" : "var(--ink)",
                    }}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="t-meta mt-8" style={{ color: "var(--muted)" }}>
              {TEAM_SUMMARY.note}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1 / 1", backgroundColor: "var(--paper-soft)" }}>
              {withCovers.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.cover!}
                  alt={`${p.title}: ${p.tag}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition-opacity duration-500"
                  style={{ opacity: hover === i ? 1 : 0 }}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ─────────────────────────── Closing marquee ─────────────────────────── */

/** A full-bleed strip of project imagery, looping. Duplicated for a seamless
 *  wrap; the copy is hidden from assistive tech. */
function ClosingMarquee() {
  const covers = PROJECTS.filter((p) => p.cover);
  const sequence = [...covers, ...covers, ...covers];

  return (
    <Section top="2xl" className="overflow-hidden">
      <style>{`
        @keyframes eqx-strip{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
        .eqx-strip-track{display:flex;width:max-content;animation:eqx-strip 60s linear infinite;will-change:transform}
        @media (hover:hover){.eqx-strip:hover .eqx-strip-track{animation-play-state:paused}}
        @media (prefers-reduced-motion:reduce){.eqx-strip-track{animation:none}.eqx-strip{overflow-x:auto}}
      `}</style>
      <div className="eqx-strip relative">
        <div className="eqx-strip-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {sequence.map((p, i) => (
                <div
                  key={`${copy}-${i}`}
                  className="relative shrink-0"
                  style={{ width: "clamp(200px, 21vw, 400px)", height: "clamp(140px, 14vw, 260px)" }}
                >
                  <Image src={p.cover!} alt="" fill sizes="21vw" className="object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
