"use client";

/**
 * Studio statement — the oversized editorial paragraph that follows the hero.
 *
 * Composition follows the reference: a short lede pinned to the left column
 * with the statement itself set large across the right half, then a hairline
 * row of studio figures. The figures are typographic, not cards.
 */

import { Reveal, CountStat } from "./primitives";
import { Container, Section } from "./layout";
import { BRAND } from "./content";

const STATS = [
  { target: 75, suffix: "+", label: "Projects Delivered" },
  { target: 5, suffix: "", label: "Core Disciplines" },
  { target: 2020, suffix: "", label: "Established", raw: true },
];

export function Intro() {
  return (
    <Section id="studio-statement" top="xl">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[var(--grid-gap)]">
          <Reveal>
            <p className="t-lede max-w-[26rem]" style={{ color: "var(--muted)" }}>
              {BRAND.name} turns positioning into a coherent visual language,
              built to hold up across every surface a brand meets its audience on.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="t-statement">
              {BRAND.name}® is a strategic design studio focused on building
              meaningful brand and online experiences.
            </h2>
          </Reveal>
        </div>

        {/* Studio figures */}
        <div
          className="mt-[var(--space-lg)] grid grid-cols-1 sm:grid-cols-3"
          style={{ gap: "var(--grid-gap)" }}
        >
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="border-t pt-6 md:pt-8"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <div className="t-title tabular-nums">
                {s.raw ? s.target : <CountStat target={s.target} suffix={s.suffix} />}
              </div>
              <div className="t-meta mt-3" style={{ color: "var(--muted)" }}>
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
