"use client";

/**
 * Works index — filters and three genuinely different views.
 *
 *   Masonry  columns of unequal-height media, read top-to-bottom per column
 *   Grid     one uniform ratio, read left-to-right in rows
 *   List     no covers at all — a typographic table with a hover preview
 *
 * Each view is its own layout, not the same markup with a class swapped.
 * Switching remounts the container and fades the new layout in; morphing
 * items between the three via shared layout ids was tried and dropped —
 * holding the outgoing tree mounted to measure against stalls the swap.
 *
 * Both controls are lists of real buttons with `aria-pressed`, and the choice
 * is kept in sessionStorage so it survives a case-study visit and back.
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PROJECTS, DISCIPLINES, type Project, type Discipline } from "./projects-data";
import { CoverMedia } from "./cover-media";
import { Container, LabelRow, Roll, Section } from "./layout";

const VIEWS = ["Masonry", "Grid", "List"] as const;
type View = (typeof VIEWS)[number];

const STORAGE_KEY = "eqx:work-view";
const EASE = [0.16, 1, 0.3, 1] as const;

const isView = (v: string | null): v is View => !!v && (VIEWS as readonly string[]).includes(v);

/**
 * sessionStorage read as an external store. Reading it in an effect and
 * calling setState would cost an extra render pass on every mount;
 * useSyncExternalStore lets the server render the default and the client
 * settle on the stored value without a hydration mismatch.
 *
 * Nothing else writes the key, so the subscription is a no-op.
 */
const subscribeToStoredView = () => () => {};
const readStoredView = () => sessionStorage.getItem(STORAGE_KEY);
const readServerView = () => null;

/** Masonry needs unequal heights; this alternates the two card sizes the
 *  reference uses (a taller portrait against a shorter landscape). */
const MASONRY_RATIO = ["3 / 4", "1 / 1"] as const;

export function WorkIndex() {
  const reduce = useReducedMotion();
  const all = useMemo(() => PROJECTS.filter((p) => p.cover), []);

  const [filter, setFilter] = useState<Discipline | "All">("All");

  // The session's stored choice is the baseline; picking a view this visit
  // overrides it and writes straight back to storage from the event handler.
  const stored = useSyncExternalStore(subscribeToStoredView, readStoredView, readServerView);
  const [chosen, setChosen] = useState<View | null>(null);
  const view: View = chosen ?? (isView(stored) ? stored : "Masonry");

  const chooseView = (v: View) => {
    setChosen(v);
    sessionStorage.setItem(STORAGE_KEY, v);
  };

  const items = filter === "All" ? all : all.filter((p) => p.disciplines.includes(filter));

  // Only offer a discipline if something is actually filed under it.
  const available = DISCIPLINES.filter((d) => all.some((p) => p.disciplines.includes(d)));

  return (
    <Section top="none">
      <Container style={{ paddingTop: "var(--space-2xl)" }}>
        <h1 className="t-display">Works</h1>

        <div
          className="mt-[var(--space-lg)] grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "var(--space-sm)" }}
        >
          <LabelRow label="Discipline">
            <ul className="flex flex-col gap-1">
              {(["All", ...available] as const).map((d) => (
                <li key={d}>
                  <FilterButton active={filter === d} onClick={() => setFilter(d)} label={d} />
                </li>
              ))}
            </ul>
          </LabelRow>

          <LabelRow label="View">
            <ul className="flex flex-col gap-1">
              {VIEWS.map((v) => (
                <li key={v}>
                  <FilterButton active={view === v} onClick={() => chooseView(v)} label={v} />
                </li>
              ))}
            </ul>
          </LabelRow>
        </div>

        <p className="t-meta mt-[var(--space-md)]" style={{ color: "var(--muted)" }} aria-live="polite">
          {items.length} {items.length === 1 ? "project" : "projects"}
          {filter !== "All" ? ` · ${filter}` : ""}
        </p>
      </Container>

      <Container className="mt-[var(--space-sm)]" style={{ paddingBottom: "var(--space-2xl)" }}>
        {/* Changing the key remounts the view, so the fade-in plays on every
            switch. Deliberately not an AnimatePresence cross-fade: holding the
            outgoing layout mounted while the incoming one measures is what
            makes view switching feel laggy, and the three layouts are
            different enough that morphing between them reads as noise. */}
        <motion.div
          key={`${view}-${filter}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
        >
          {view === "Masonry" && <MasonryView items={items} />}
          {view === "Grid" && <GridView items={items} />}
          {view === "List" && <ListView items={items} />}
        </motion.div>

        {items.length === 0 && (
          <p className="t-lede py-20" style={{ color: "var(--muted)" }}>
            Nothing filed under {filter} yet.
          </p>
        )}
      </Container>
    </Section>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="tap t-meta block text-left transition-opacity duration-300"
      style={{ opacity: active ? 1 : 0.45 }}
    >
      <Roll>{label}</Roll>
    </button>
  );
}

/** Shared card face for the two media views. */
function Card({ project, ratio, priority }: { project: Project; ratio: string; priority?: boolean }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: ratio, backgroundColor: "var(--paper-soft)" }}
      >
        <CoverMedia
          project={project}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          imageClassName="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-[var(--space-2xs)]">
        <div className="t-meta">
          <Roll>{project.title}</Roll>
        </div>
        <div className="t-meta" style={{ color: "var(--muted)" }}>
          {project.industry ?? project.tag}
        </div>
      </div>
    </Link>
  );
}

/** Columns of unequal-height cards — the classic masonry read. */
function MasonryView({ items }: { items: Project[] }) {
  const columns = 4;
  const cols: Project[][] = Array.from({ length: columns }, () => []);
  items.forEach((p, i) => cols[i % columns].push(p));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "var(--space-sm)" }}>
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col" style={{ gap: "var(--space-sm)" }}>
          {col.map((p, i) => (
            <Card key={p.slug} project={p} ratio={MASONRY_RATIO[(ci + i) % 2]} priority={ci < 2 && i === 0} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** One ratio, read in rows. */
function GridView({ items }: { items: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "var(--space-sm)" }}>
      {items.map((p, i) => (
        <Card key={p.slug} project={p} ratio="4 / 3" priority={i < 3} />
      ))}
    </div>
  );
}

/**
 * A typographic table. The cover only appears as a pointer-following preview,
 * so every column of information stays readable without hovering anything.
 */
function ListView({ items }: { items: Project[] }) {
  const reduce = useReducedMotion();
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    const { clientX: x, clientY: y } = e;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (thumbRef.current) thumbRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }

  return (
    <div onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
      <div
        className="t-meta hidden grid-cols-[1.6fr_1.6fr_1.2fr_auto] gap-6 border-b pb-3 md:grid"
        style={{ borderColor: "var(--line-strong)", color: "var(--muted)" }}
      >
        <span>Project</span>
        <span>Discipline</span>
        <span>Sector</span>
        <span className="text-right">Year</span>
      </div>

      {items.map((p, i) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          className="group block border-b transition-opacity duration-300"
          style={{ borderColor: "var(--line)", opacity: active === null || active === i ? 1 : 0.4 }}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
        >
          <div className="grid grid-cols-[1fr_auto] items-baseline gap-3 py-5 md:grid-cols-[1.6fr_1.6fr_1.2fr_auto] md:gap-6">
            <span className="t-sub">
              <Roll>{p.title}</Roll>
            </span>
            <span className="t-meta hidden md:block" style={{ color: "var(--muted)" }}>
              {p.disciplines.join(", ")}
            </span>
            <span className="t-meta hidden md:block" style={{ color: "var(--muted)" }}>
              {p.industry ?? "—"}
            </span>
            <span className="t-meta tabular-nums md:text-right" style={{ color: "var(--muted)" }}>
              {p.year}
            </span>
            {/* Everything the desktop columns carry, folded into one line. */}
            <span className="t-meta col-span-2 md:hidden" style={{ color: "var(--muted)" }}>
              {p.industry ?? p.disciplines[0]}
            </span>
          </div>
        </Link>
      ))}

      {/* Pointer preview — decorative, hidden from assistive tech and disabled
          entirely under reduced motion. */}
      <div
        ref={thumbRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{ transform: "translate3d(-400px,-400px,0)" }}
      >
        <div
          className="relative overflow-hidden transition-opacity duration-300"
          style={{
            width: 300,
            height: 200,
            marginLeft: 28,
            marginTop: -100,
            opacity: active !== null && !reduce ? 1 : 0,
          }}
        >
          {items.map((p, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={p.slug}
              src={p.cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
