"use client";

/**
 * Footer — an ink band that closes the page with the wordmark at display scale.
 *
 * Three registers: the directory (nav groups + contact), the oversized
 * repeated wordmark, and a legal bar. Rendered on every route, so section
 * links resolve against the homepage with a leading slash.
 */

import Link from "next/link";
import { BRAND } from "./content";
import { Container, Roll, Section } from "./layout";
import { ArrowUpRight, InstagramIcon, LinkedInIcon, DribbbleIcon } from "./primitives";

const COLS = [
  {
    heading: "Studio",
    links: [
      { label: "Works", href: "/work" },
      { label: "Studio", href: "/about" },
      { label: "Services", href: "/#services" },
      // { label: "Pricing", href: "/#pricing" },  — hidden with the Pricing section
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Belgore, Olufadi & Co.", href: "/work/belgore" },
      { label: "Kaya Express", href: "/work/kaya" },
      { label: "Kaysteph Group", href: "/work/kaysteph-group" },
      { label: "Camping Nigeria", href: "/work/camping" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Email", href: `mailto:${BRAND.email}` },
      { label: "Phone", href: BRAND.phoneHref },
      { label: "WhatsApp", href: BRAND.whatsapp, ext: true },
      { label: "Instagram", href: BRAND.instagram, ext: true },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: BRAND.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedInIcon },
  { label: "Dribbble", href: "https://dribbble.com/", Icon: DribbbleIcon },
];

/** "Abuja, Nigeria · Remote worldwide" → its two display lines. */
const [CITY, ...REMOTE] = BRAND.location.split(" · ");

export function SiteFooter() {
  return (
    <Section as="footer" tone="ink" top="md" bottom="sm">
      <Container>
        {/* ── Directory ── */}
        <div className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-[var(--space-md)] md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="t-lede max-w-[28ch]">{BRAND.tagline}</p>
            <address className="t-meta mt-8 not-italic" style={{ color: "var(--ink-inverse)" }}>
              <a href={`mailto:${BRAND.email}`} className="tap block hover:opacity-70">
                {BRAND.email}
              </a>
              <a href={BRAND.phoneHref} className="tap block hover:opacity-70">
                {BRAND.phone}
              </a>
              <span className="mt-3 block">
                {CITY}
                {REMOTE.length > 0 && (
                  <>
                    <br />
                    {REMOTE.join(" · ")}
                  </>
                )}
              </span>
            </address>
            <div className="mt-8 flex items-center gap-5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="tap tap-icon transition-opacity hover:opacity-60"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="t-meta" style={{ color: "var(--ink-inverse)" }}>
                {col.heading}
              </h2>
              <ul className="mt-6 flex flex-col gap-2.5">
                {col.links.map((l) => {
                  const ext = "ext" in l && l.ext;
                  const isHash = l.href.startsWith("/") && !l.href.startsWith("//");
                  const Cmp = ext || !isHash ? "a" : Link;
                  return (
                    <li key={l.label}>
                      <Cmp
                        href={l.href}
                        target={ext ? "_blank" : undefined}
                        rel={ext ? "noopener noreferrer" : undefined}
                        className="tap t-meta inline-block"
                      >
                        <Roll>{l.label}</Roll>
                      </Cmp>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── CTA + repeated wordmark ── */}
        <div className="mt-[var(--space-xl)]">
          <Link href="/contact" className="tap t-meta inline-flex items-center gap-2 underline-offset-[6px] hover:underline">
            <Roll>Start a project</Roll>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {/* The wordmark is decorative here — the accessible name lives in the
              nav and the legal line below. */}
          <div
            className="t-display mt-8 w-full select-none"
            aria-hidden="true"
            style={{ fontSize: "clamp(3.5rem, 15.5vw, 19rem)", lineHeight: 0.78 }}
          >
            {BRAND.name}®
          </div>
        </div>

        {/* ── Legal ── */}
        <div
          className="mt-[var(--space-md)] flex flex-col items-start justify-between gap-3 border-t pt-6 md:flex-row md:items-center"
          style={{ borderColor: "var(--line-inverse)" }}
        >
          <span className="t-meta" style={{ color: "var(--ink-inverse)" }}>
            © {new Date().getFullYear()} {BRAND.name} Studio. All rights reserved.
          </span>
          <span className="t-meta" style={{ color: "var(--ink-inverse)" }}>
            Strategic Design · Est. {BRAND.established}
          </span>
        </div>
      </Container>
    </Section>
  );
}
