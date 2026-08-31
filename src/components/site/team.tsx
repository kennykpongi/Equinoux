"use client";

/**
 * Studio band — the founder, the disciplines, the sectors.
 *
 * A two-column editorial spread: a full-height portrait against a statement
 * and two hairline-ruled lists. No cards, no avatars beyond the one real
 * person; nothing here is invented.
 */

import Image from "next/image";
import Link from "next/link";
import { TEAM, TEAM_SUMMARY, TRUST, BRAND } from "./content";
import { Container, LabelRow, Roll, Section } from "./layout";
import { Reveal, ArrowUpRight } from "./primitives";

const FOUNDER = TEAM[0];

export function Team() {
  return (
    <Section id="team" top="2xl">
      <Container>
        <Reveal>
          <h2 className="t-display">Studio</h2>
        </Reveal>

        <div
          className="mt-[var(--space-lg)] grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: "var(--space-sm)" }}
        >
          {/* Founder */}
          <Reveal>
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5", backgroundColor: "var(--paper-soft)" }}
            >
              <Image
                src={FOUNDER.image}
                alt={FOUNDER.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover grayscale"
                style={{ objectPosition: "center 25%" }}
              />
            </div>
            <div className="mt-[var(--space-xs)]">
              <div className="t-meta">{FOUNDER.name}</div>
              <div className="t-meta" style={{ color: "var(--muted)" }}>
                {FOUNDER.role}
              </div>
            </div>
          </Reveal>

          {/* Statement + lists */}
          <div className="flex flex-col justify-between gap-[var(--space-lg)]">
            <Reveal delay={0.1}>
              <p className="t-statement">
                An independent studio that assembles the right specialists for
                each brief, so the work delivers, not just decorates.
              </p>
              <p className="t-lede mt-8 max-w-[46ch]" style={{ color: "var(--muted)" }}>
                {TEAM_SUMMARY.note} Founder-led since {BRAND.established}, with senior
                attention on every project rather than a hand-off to juniors.
              </p>
            </Reveal>

            <div className="flex flex-col gap-[var(--space-sm)]">
              <Reveal delay={0.15}>
                <LabelRow label="Disciplines">
                  <ul>
                    {TEAM_SUMMARY.disciplines.map((d) => (
                      <li
                        key={d}
                        className="t-meta border-t py-3"
                        style={{ borderColor: "var(--line-strong)" }}
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </LabelRow>
              </Reveal>

              <Reveal delay={0.2}>
                <LabelRow label="Sectors">
                  <ul>
                    {TRUST.industries.map((d) => (
                      <li
                        key={d}
                        className="t-meta border-t py-3"
                        style={{ borderColor: "var(--line-strong)" }}
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </LabelRow>
              </Reveal>

              <Reveal delay={0.25}>
                <Link
                  href="/about"
                  className="tap t-meta inline-flex w-fit items-center gap-2 underline-offset-[6px] hover:underline"
                >
                  <Roll>More about the studio</Roll>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
