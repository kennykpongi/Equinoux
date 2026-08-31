"use client";

/**
 * The vendored TestimonialMarquee, wired to this site's real testimonials.
 *
 * This stands in for the component's shipped demo, which carries six invented
 * people. Inventing testimonials is the one thing this repo must never do, so
 * the demo data is not copied in — TESTIMONIALS in content.ts is the source,
 * and every quote there came from the client document.
 *
 * Avatars: the component requires one per item and we hold no client
 * headshots. Rather than borrow stock photographs of strangers and attach
 * them to named people — which would be a fabrication, not a placeholder —
 * each avatar is a monogram generated from the person's own initials, drawn
 * in the site's ink and paper. Swap `avatar` for a real portrait per person
 * as they come in; nothing else has to change.
 *
 * Not mounted anywhere yet. `<TestimonialsMarquee />` drops in wherever
 * <Testimonials /> currently sits in site-landing.tsx.
 */

import { TestimonialMarquee, type Testimonial } from "@/components/ui/testimonial-marquee";
import { TESTIMONIALS } from "./content";
import { Container, Section } from "./layout";
import { Reveal } from "./primitives";

/**
 * An initials plate as a data URI. Inline rather than a file per person, so
 * adding a testimonial needs no asset — and next/image has nothing to optimise
 * in a 40px SVG anyway.
 */
function monogram(name: string): string {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">` +
    `<rect width="80" height="80" fill="#0b0b0b"/>` +
    `<text x="50%" y="50%" dy="0.35em" text-anchor="middle" ` +
    `font-family="system-ui,-apple-system,sans-serif" font-size="30" ` +
    `font-weight="600" letter-spacing="-1" fill="#f3f2ef">${initials}</text>` +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** content.ts uses quote/name/role; the component wants text/name/avatar. */
const ITEMS: Testimonial[] = TESTIMONIALS.map((t) => ({
  name: t.name,
  text: t.quote,
  role: t.role,
  avatar: monogram(t.name),
}));

export function TestimonialsMarquee({
  variant = "default",
}: {
  variant?: "default" | "stacked" | "dual" | "flush" | "flush-dual";
}) {
  return (
    <Section id="testimonials" top="2xl" className="overflow-hidden">
      <Container>
        <Reveal>
          <h2 className="t-display text-balance">
            We could tell you
            <br className="hidden sm:inline" /> we&rsquo;re good
            <span style={{ color: "var(--muted)" }}>*</span>
          </h2>
          <p className="t-meta mt-8" style={{ color: "var(--muted)" }}>
            *But they&rsquo;re more convincing
          </p>
        </Reveal>
      </Container>

      {/* Full-bleed: the marquee is meant to run past both page edges. */}
      <div className="mt-[var(--space-lg)]">
        <TestimonialMarquee items={ITEMS} variant={variant} speed={40} />
      </div>
    </Section>
  );
}

export default TestimonialsMarquee;
