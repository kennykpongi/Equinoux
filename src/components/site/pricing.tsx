"use client";

/**
 * Pricing — currently hidden (see site-landing.tsx), kept in the shared visual
 * system so re-enabling it needs no restyle.
 *
 * Typography-led rather than a rack of SaaS cards: two groups on a tab list,
 * then each tier as a hairline-ruled row with the fee set at title scale and
 * the inclusions as a plain list. Comparison happens by reading down the
 * column, which is why the rows share one grid.
 *
 * Figures come verbatim from PRICING in content.ts.
 */

import { useState } from "react";
import { PRICING } from "./content";
import { Container, LabelRow, Roll, Section } from "./layout";
import { Reveal, ArrowUpRight, CheckIcon, CrossIcon } from "./primitives";

export function Pricing() {
  const [active, setActive] = useState(0);
  const group = PRICING.groups[active];

  return (
    <Section id="pricing" tone="ink" top="2xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>
          <Reveal>
            <h2 className="t-display">Pricing</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:self-end lg:pb-3">
            <p className="t-statement max-w-[20ch]">Two ways to work with the studio.</p>
          </Reveal>
        </div>

        <LabelRow label="Package" className="mt-[var(--space-lg)]">
          {/* A tab list rather than a pill switcher: two mutually exclusive
              views of the same table. */}
          <div role="tablist" aria-label="Pricing category" className="flex flex-col gap-1">
            {PRICING.groups.map((g, i) => (
              <button
                key={g.key}
                role="tab"
                id={`pricing-tab-${g.key}`}
                aria-selected={i === active}
                aria-controls={`pricing-panel-${g.key}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className="t-meta block text-left transition-opacity duration-300"
                style={{ opacity: i === active ? 1 : 0.45 }}
              >
                <Roll>{g.label}</Roll>
              </button>
            ))}
          </div>

          <div
            id={`pricing-panel-${group.key}`}
            role="tabpanel"
            aria-labelledby={`pricing-tab-${group.key}`}
            className="mt-[var(--space-md)]"
          >
            {group.tiers.map((t) => (
              <div
                key={t.key}
                className="grid grid-cols-1 gap-6 border-t py-8 md:grid-cols-[1fr_1fr_1fr] md:gap-10"
                style={{ borderColor: "var(--line-inverse)" }}
              >
                <div>
                  <h3 className="t-sub">{t.name}</h3>
                  <p className="t-meta mt-2" style={{ color: "var(--ink-inverse)" }}>
                    {t.size}
                    {t.featured ? " · Most chosen" : ""}
                  </p>
                  <p className="t-title mt-6 tabular-nums">
                    {PRICING.currency}
                    {t.price.toLocaleString("en-US")}
                  </p>
                </div>

                <p className="t-lede max-w-[42ch]" style={{ color: "var(--ink-inverse)" }}>
                  {t.blurb}
                </p>

                <div>
                  <ul className="flex flex-col gap-2">
                    {t.features.map((f) => (
                      <li key={f.label} className="t-meta flex items-start gap-3">
                        {f.on ? (
                          <CheckIcon className="mt-1 h-3 w-3 shrink-0" />
                        ) : (
                          <CrossIcon className="mt-1 h-3 w-3 shrink-0" style={{ opacity: 0.4 }} />
                        )}
                        <span style={{ opacity: f.on ? 1 : 0.4 }}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  {"note" in t && t.note && (
                    <p className="t-meta mt-5" style={{ color: "var(--ink-inverse)" }}>
                      {t.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t" style={{ borderColor: "var(--line-inverse)" }} />

            <a href="#contact" className="t-meta mt-[var(--space-md)] inline-flex items-center gap-2 underline underline-offset-[6px]">
              Discuss a package
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </LabelRow>
      </Container>
    </Section>
  );
}
