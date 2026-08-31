/**
 * Journal — data model only, deliberately empty.
 *
 * The reference site carries a News section. Equinoux has no published
 * articles, and inventing some would put fabricated writing under the studio's
 * name, so nothing is exposed in production: there is no /journal route, no
 * nav entry, and no sitemap entry. This file exists so adding the section
 * later is a content task rather than a build.
 *
 * To turn it on, once there are real posts:
 *   1. Add entries to POSTS below.
 *   2. Create app/journal/page.tsx and app/journal/[slug]/page.tsx, using the
 *      same Section/Container/LabelRow primitives as app/work.
 *   3. Add the route to app/sitemap.ts and the LINKS array in site/nav.tsx.
 *
 * `hasJournal` is the single switch the UI should branch on, so the nav and
 * footer never link to an empty index.
 */

export type JournalPost = {
  slug: string;
  title: string;
  /** One-line standfirst shown on the index. */
  excerpt: string;
  /** ISO date — used for ordering and the <time> element. */
  date: string;
  /** Short label, e.g. "Studio note", "Process". */
  category: string;
  /** Optional cover image under /public. */
  cover?: string;
  /** Body as an ordered list of blocks, kept presentation-agnostic. */
  body: ({ kind: "p"; text: string } | { kind: "h"; text: string } | { kind: "image"; src: string; alt: string })[];
};

export const POSTS: JournalPost[] = [];

export const hasJournal = POSTS.length > 0;

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
