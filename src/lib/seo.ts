/**
 * Canonical origin, revision date, and the JSON-LD graph the site publishes.
 *
 * SITE_URL lives here rather than in app/layout.tsx so any route or component
 * can read it without pulling the root layout — and its next/font import —
 * into its own module graph. layout.tsx re-exports it, so the existing
 * `from "./layout"` imports in robots.ts and sitemap.ts keep working.
 */

import { BRAND, SERVICES } from "@/components/site/content";
import type { Project } from "@/components/site/projects-data";

export const SITE_URL = "https://www.equinoux.com";

/**
 * The date the site's content was last meaningfully revised.
 *
 * Deliberately a constant rather than `new Date()`. The sitemap used to stamp
 * every URL with the build timestamp, so all eight pages claimed to have
 * changed on every deploy whether or not a word of them had. Google discounts
 * a lastmod it can tell is automatic, which makes the signal worth less than
 * no signal. Bump this by hand when copy or case studies actually change.
 */
export const CONTENT_REVISED = "2026-08-27";

/* One canonical node id per entity, so every other node can point at the
   studio by reference instead of restating it and risking a drift. */
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

type Node = Record<string, unknown>;

/**
 * The studio itself.
 *
 * Every field is a fact already published elsewhere on the site: the name,
 * founding year, email and phone come from BRAND, the disciplines from
 * SERVICES. Nothing here is asserted that a visitor could not read off the
 * contact page.
 *
 * `sameAs` carries the Instagram profile only. This is the list Google uses to
 * tie the site to the accounts it already knows about, so a wrong entry is
 * worse than a short one. The LinkedIn and Dribbble hrefs in footer.tsx and
 * contact-page.tsx are still bare-domain placeholders — pointing Google at
 * linkedin.com's homepage as the studio's profile would corrupt the mapping.
 * Add them here the moment the real URLs land.
 *
 * No `aggregateRating` either: the testimonials are real and named, but
 * self-serving review markup on your own Organization is exactly what Google's
 * guidelines exclude, and it earns a manual action rather than a rich result.
 */
export function organizationNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND.name,
    url: SITE_URL,
    email: BRAND.email,
    telephone: BRAND.phone,
    foundingDate: BRAND.established,
    description:
      "An independent, founder-led strategic design studio crafting brand systems, identities, and websites for ambitious companies.",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abuja",
      addressCountry: "NG",
    },
    sameAs: [BRAND.instagram],
    areaServed: "Worldwide",
    knowsAbout: SERVICES.map((s) => s.name),
  };
}

/**
 * The site as a publication.
 *
 * No `potentialAction`/SearchAction: there is no site search to point it at,
 * and declaring one that does not exist is a fabricated capability.
 */
export function webSiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: BRAND.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** Where the current page sits, so Search shows a path rather than a raw URL. */
export function breadcrumbNode(trail: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** One case study, attributed to the studio by reference. */
export function caseStudyNode(project: Project): Node {
  const url = `${SITE_URL}/work/${project.slug}`;
  return {
    "@type": "CreativeWork",
    "@id": `${url}/#work`,
    url,
    name: project.title,
    description: project.summary,
    dateCreated: project.year,
    creator: { "@id": ORG_ID },
    ...(project.industry ? { about: project.industry } : {}),
    keywords: project.disciplines.join(", "),
    ...(project.cover ? { image: `${SITE_URL}${project.cover}` } : {}),
  };
}

/** The /work index, as an ordered list of the case studies it links to. */
export function workListNode(projects: Project[]): Node {
  return {
    "@type": "ItemList",
    name: "Selected works",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/work/${p.slug}`,
      name: p.title,
    })),
  };
}
