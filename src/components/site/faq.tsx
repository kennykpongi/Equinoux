"use client";

/**
 * FAQ — a restrained editorial accordion on the shared hairline system.
 * Same interaction grammar as the Skillset list so the page reads as one
 * language rather than two components that happen to expand.
 */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FAQ } from "./content";
import { Container, LabelRow, Section } from "./layout";
import { Reveal, ArrowUpRight } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <Section id="faq" top="2xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>
          <Reveal>
            <h2 className="t-display">FAQ</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:self-end lg:pb-3">
            <p className="t-statement max-w-[20ch]">Everything worth knowing before we start.</p>
          </Reveal>
        </div>

        <LabelRow label="Questions" className="mt-[var(--space-lg)]">
          <ul>
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-t" style={{ borderColor: "var(--line-strong)" }}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="t-lede font-medium" style={{ opacity: isOpen ? 1 : 0.75 }}>
                        {item.q}
                      </span>
                      <span
                        className="relative block h-3 w-3 shrink-0 transition-transform duration-500"
                        style={{ transform: isOpen ? "rotate(135deg)" : "none", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                        aria-hidden="true"
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ backgroundColor: "currentColor" }} />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ backgroundColor: "currentColor" }} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="t-lede max-w-[62ch] pb-8" style={{ color: "var(--muted)" }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
            <li className="border-t" style={{ borderColor: "var(--line-strong)" }} />
          </ul>

          <a href="#contact" className="tap t-meta mt-[var(--space-sm)] inline-flex items-center gap-2 underline underline-offset-[6px]">
            Still have a question? Ask directly
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </LabelRow>
      </Container>
    </Section>
  );
}
