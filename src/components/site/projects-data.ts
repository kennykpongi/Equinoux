/**
 * The studio's core disciplines, used verbatim as the /work filter set.
 * Keep this list in step with SERVICES in components/site/content.ts.
 */
export const DISCIPLINES = [
  "Brand Strategy",
  "Identity Design",
  "Web & Digital",
  "Design Systems",
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

/**
 * One delivered asset.
 *
 * Every file in the project's /public/portfolio folder is listed as one of
 * these, so a case study shows the whole engagement rather than a four-image
 * sample of it. `caption` names what the asset is — read off the work itself,
 * never inferred.
 */
export type Media = {
  src: string;
  caption: string;
  /** The frame's aspect ratio. Photography is cropped to it; artwork is not. */
  ratio: string;
  /**
   * Artwork on a transparent ground is contained on a plate rather than
   * cropped — a logo with its edges cut off is not a logo.
   */
  contain?: boolean;
  /** Plate ground. Reversed artwork needs a dark one to be visible at all. */
  ground?: string;
  /** Spans every column of its chapter's grid. */
  full?: boolean;
  /** A video. `src` is then its poster frame. */
  video?: string;
  /** A smaller cut of `video`, served below 768px. */
  videoSmall?: string;
};

/** A labelled band of delivered work: identity, pages, merchandise, and so on. */
export type Chapter = {
  id: string;
  label: string;
  cols: 1 | 2 | 3;
  media: Media[];
};

export type Project = {
  slug: string;
  tag: string;
  title: string;
  year: string;
  client: string;
  /** Industry classification shown in the case-study metadata bar. */
  industry?: string;
  /**
   * Which of the studio's core disciplines this engagement actually covered.
   * Drives the /work filters — classification of real scope, nothing invented.
   */
  disciplines: Discipline[];
  role: string[];
  summary: string;
  brief: string;
  challenge: string;
  approach: string;
  outcome: string;
  gradient: string;
  accent: string;
  /** Optional homepage card cover image (used in the Work section). */
  cover?: string;
  /**
   * An optional moving cover. `cover` stays required alongside it: it is the
   * poster, and the only thing small surfaces (the /work list hover preview)
   * ever render.
   */
  coverVideo?: string;
  coverVideoSmall?: string;
  hero: { kind: "gradient" | "image"; src?: string };
  chapters: Chapter[];
  metrics?: { label: string; value: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "belgore",
    industry: "Legal Services",
    tag: "Web Design & Identity",
    title: "Belgore, Olufadi & Co.",
    year: "2025",
    client: "Belgore, Olufadi & Co.",
    disciplines: ["Brand Strategy", "Identity Design", "Web & Digital"],
    role: ["Brand Strategy", "Website Design & Development", "Identity & Smart Access"],
    summary:
      "Repositioning a legacy Nigerian law firm for the modern legal market: a premium, conversion-focused digital experience backed by a full identity and smart-access system.",
    brief:
      "Belgore, Olufadi & Co. is an established Nigerian law firm with decades of legal experience, serving individuals, businesses, financial institutions and government organizations across Nigeria. Despite its reputation, expertise and client portfolio, its digital presence failed to communicate its true market position. For a firm trusted with high-value legal matters, first impressions mattered.",
    challenge:
      "The firm's website failed to reflect over 20 years of legal excellence. It lacked premium positioning, strong storytelling, modern UX, trust-building elements, conversion pathways, SEO optimization and a cohesive brand experience.",
    approach:
      "Equinoux Studio led the project end to end, running discovery workshops, stakeholder meetings, competitor research, brand positioning, UX strategy, UI design, custom development, SEO implementation, content structuring and performance optimization. Every screen was engineered to communicate authority, make expertise easy to navigate, and guide prospective clients toward a consultation. Physical security was folded into the brand through professionally branded ID cards with integrated smart door-lock access.",
    outcome:
      "A complete digital transformation: a premium online presence aligned with the firm's reputation, an SEO-ready foundation, a modern responsive experience, stronger credibility, clearer differentiation from local and international competitors, and a platform built to support future growth.",
    gradient: "from-blue-950 via-slate-950 to-slate-950",
    accent: "#2f5fe6",
    cover: "/brand/belgore-wide.jpg",
    hero: { kind: "image", src: "/portfolio/belgore/hero.jpg" },
    chapters: [
      {
        id: "homepage",
        label: "Homepage",
        cols: 1,
        media: [
          {
            src: "/portfolio/belgore/homepage-poster.jpg",
            video: "/portfolio/belgore/homepage.mp4",
            caption: "Homepage in motion",
            ratio: "16 / 9",
          },
        ],
      },
      {
        id: "pages",
        label: "Pages",
        cols: 2,
        media: [
          { src: "/portfolio/belgore/hero-desktop.jpg", caption: "Homepage hero", ratio: "3 / 2" },
          { src: "/portfolio/belgore/header.jpg", caption: "The site in place", ratio: "3 / 2" },
          { src: "/portfolio/belgore/about.jpg", caption: "About the firm", ratio: "3 / 2" },
          { src: "/portfolio/belgore/practices.jpg", caption: "Practice areas", ratio: "3 / 2" },
          { src: "/portfolio/belgore/practice-featured.jpg", caption: "Practice in focus", ratio: "3 / 2" },
          { src: "/portfolio/belgore/leadership.jpg", caption: "Leadership", ratio: "3 / 2" },
          { src: "/portfolio/belgore/clients.jpg", caption: "Representative clients", ratio: "3 / 2" },
          { src: "/portfolio/belgore/book.jpg", caption: "Book a consultation", ratio: "3 / 2" },
          { src: "/portfolio/belgore/contact.jpg", caption: "Contact routes", ratio: "3 / 2" },
          { src: "/portfolio/belgore/contact-form.jpg", caption: "Enquiry form", ratio: "3 / 2" },
        ],
      },
      {
        id: "people",
        label: "People",
        cols: 3,
        media: [
          { src: "/portfolio/belgore/attorney-ahmad.jpg", caption: "Ahmad Belgore, Managing Partner", ratio: "3 / 2" },
          { src: "/portfolio/belgore/attorney-blessing.jpg", caption: "Blessing Ogwuche, Lead Associate", ratio: "3 / 2" },
          { src: "/portfolio/belgore/attorney-chinonso.jpg", caption: "Chinonso Blessing Opara, Associate", ratio: "3 / 2" },
        ],
      },
      {
        id: "responsive",
        label: "Responsive",
        cols: 3,
        media: [
          { src: "/portfolio/belgore/hero-mobile.jpg", caption: "Homepage on mobile", ratio: "1 / 2" },
          { src: "/portfolio/belgore/about-mobile.jpg", caption: "About page on mobile", ratio: "1 / 2" },
          { src: "/portfolio/belgore/contact-mobile.jpg", caption: "Contact page on mobile", ratio: "1 / 2" },
        ],
      },
      {
        id: "access",
        label: "Identity & access",
        cols: 2,
        media: [
          { src: "/portfolio/belgore/id-front.jpg", caption: "Staff ID front", ratio: "4 / 3" },
          { src: "/portfolio/belgore/id-photo.jpg", caption: "Staff ID reverse", ratio: "4 / 3" },
          { src: "/portfolio/belgore/id-pair.jpg", caption: "Staff ID detail", ratio: "4 / 3" },
          { src: "/portfolio/belgore/id-duo.jpg", caption: "Staff ID on a lanyard", ratio: "4 / 3" },
          { src: "/portfolio/belgore/smart-access.jpg", caption: "Smart door access in the office", ratio: "3 / 2", full: true },
        ],
      },
    ],
    metrics: [
      { label: "Years of practice", value: "20+" },
      { label: "Offices", value: "3" },
      { label: "Partner response", value: "24h" },
    ],
  },
  {
    slug: "kaya",
    industry: "Decluttering & Organization",
    tag: "Brand Identity",
    title: "Kaya Express",
    year: "2025",
    client: "Kaya Express Nigeria Ltd",
    disciplines: ["Brand Strategy", "Identity Design", "Design Systems"],
    role: ["Brand Strategy", "Identity System", "Brand Applications"],
    summary:
      "A modern, scalable brand identity for a professional decluttering and organization company, built to communicate clarity, ease, and visible transformation.",
    brief:
      "Kaya Express helps individuals and businesses transform chaotic spaces into calm, efficient environments. They needed a brand that could carry that same sense of order and discretion across every touchpoint, from a business card to the side of a Sprinter van.",
    challenge:
      "The brand lacked a strong visual identity that communicated its core values of order, efficiency, and calmness. Without consistency, every touchpoint risked feeling improvised, undermining trust in a category that lives or dies on credibility.",
    approach:
      "A clean, geometric identity system anchored on a custom 'K' symbol derived from the brand name. The mark is built on precise curves and structured negative space, visually arguing for transformation from chaos to clarity. A repeating K-motif pattern, midnight-blue palette, and Google Sans / Avenir typography stack tie the system together.",
    outcome:
      "Kaya Express is now positioned as a modern, structured, and professional brand. Recognition is sharper, trust is stronger, and the identity is built to scale across every future touchpoint without losing coherence.",
    gradient: "from-indigo-950 via-blue-950 to-slate-950",
    accent: "#1e1b6e",
    cover: "/brand/kaya-wide.jpg",
    hero: { kind: "image", src: "/portfolio/kaya/hero-van.jpg" },
    chapters: [
      {
        /* Placed first so it lands directly under the opening paragraph: the
           whole system in one pass before the page starts taking it apart. */
        id: "in-use",
        label: "In use",
        cols: 1,
        media: [
          {
            src: "/portfolio/kaysteph-group/merch-slide-poster.jpg",
            video: "/portfolio/kaysteph-group/merch-slide.mp4",
            videoSmall: "/portfolio/kaysteph-group/merch-slide-sm.mp4",
            caption: "The identity across the delivered collection",
            ratio: "1280 / 544",
            full: true,
          },
        ],
      },
      {
        id: "identity",
        label: "Identity",
        cols: 2,
        media: [
          { src: "/portfolio/kaya/symbol-blue.png", caption: "Symbol", ratio: "3 / 2", contain: true },
          { src: "/portfolio/kaya/symbol-white.png", caption: "Symbol reversed", ratio: "3 / 2", contain: true, ground: "#1e1b6e" },
          { src: "/portfolio/kaya/logo-on-white.png", caption: "Primary lockup", ratio: "3 / 2", contain: true },
          { src: "/portfolio/kaya/logo-white.png", caption: "Lockup reversed", ratio: "3 / 2", contain: true, ground: "#1e1b6e" },
        ],
      },
      {
        id: "pattern",
        label: "Pattern",
        cols: 2,
        media: [
          { src: "/portfolio/kaya/pattern-blue.png", caption: "K-motif pattern", ratio: "5 / 2", contain: true },
          { src: "/portfolio/kaya/pattern-white.png", caption: "Pattern reversed", ratio: "5 / 2", contain: true, ground: "#1e1b6e" },
        ],
      },
      {
        id: "stationery",
        label: "Stationery",
        cols: 1,
        media: [{ src: "/portfolio/kaya/mockup-business-card.jpg", caption: "Business card", ratio: "16 / 9" }],
      },
      {
        id: "apparel",
        label: "Apparel",
        cols: 2,
        media: [
          { src: "/portfolio/kaya/mockup-tshirt.jpg", caption: "T-shirt", ratio: "3 / 4" },
          { src: "/portfolio/kaya/mockup-tote.jpg", caption: "Tote bag", ratio: "3 / 4" },
        ],
      },
    ],
    metrics: [
      { label: "Touchpoints unified", value: "12+" },
      { label: "Identity assets", value: "30+" },
      { label: "New positioning", value: "Premium" },
    ],
  },
  {
    slug: "kaysteph-group",
    industry: "Real Estate",
    tag: "Real Estate · Identity",
    title: "Kaysteph Group",
    year: "2025",
    client: "Kaysteph Group",
    disciplines: ["Brand Strategy", "Identity Design", "Design Systems"],
    role: ["Brand Strategy", "Identity System", "Brand Collateral"],
    summary:
      "A premium identity transformation for a real estate and property development company built for trust at scale.",
    brief:
      "Kaysteph Group came to us with strong delivery but an identity that didn't reflect their ambition. Their work spoke premium. Their brand did not yet match it.",
    challenge:
      "Real estate is a category where credibility is everything and visual cliché is everywhere. The brief was to build a system that signalled trust, modernity, and ambition without leaning on the tired conventions of the industry.",
    approach:
      "A bold abstract mark anchored in a blue-and-gold palette: blue for trust and stability, gold for craft and value. A full system covers stationery, company profiles, billboards, signage, and merchandise, all governed by a tight typographic and grid foundation that scales from a business card to a 30-foot hoarding.",
    outcome:
      "The rebrand elevated Kaysteph Group into a premium, credible brand with stronger recognition, consistency, and market positioning ready to support the next phase of growth.",
    gradient: "from-blue-950 via-slate-900 to-amber-900/40",
    accent: "#d4af37",
    cover: "/portfolio/kaysteph-group/cover-poster.jpg",
    coverVideo: "/portfolio/kaysteph-group/cover.mp4",
    coverVideoSmall: "/portfolio/kaysteph-group/cover-sm.mp4",
    hero: { kind: "image", src: "/portfolio/kaysteph-group/hero.jpg" },
    chapters: [
      {
        /* Placed first so it lands directly under the opening paragraph: the
           whole system in one pass before the page starts taking it apart. */
        id: "in-use",
        label: "In use",
        cols: 2,
        media: [
          {
            src: "/portfolio/kaysteph-group/merch-slide-poster.jpg",
            video: "/portfolio/kaysteph-group/merch-slide.mp4",
            videoSmall: "/portfolio/kaysteph-group/merch-slide-sm.mp4",
            caption: "The identity across the delivered collection",
            ratio: "1280 / 544",
            full: true,
          },
          {
            src: "/portfolio/kaysteph-group/system-reel-poster.jpg",
            video: "/portfolio/kaysteph-group/system-reel.mp4",
            videoSmall: "/portfolio/kaysteph-group/system-reel-sm.mp4",
            caption: "One pass through the system: flask, profile, card, banner, site kit",
            ratio: "4 / 5",
          },
        ],
      },
      {
        id: "identity",
        label: "Identity",
        cols: 2,
        /* logo-context.png is logo-new.png on a wider canvas (83,254 vs 83,229
           opaque pixels), and logo-treatment-2.png is logo-treatment-1.png
           recoloured white, i.e. a reversed lockup that was being shown on a
           light plate with its symbol invisible. logo-mark.png is that same
           reversed lockup, larger. All three are still in the folder; showing
           them alongside the originals only repeated the mark and printed one
           plate that read as blank. */
        media: [
          { src: "/portfolio/kaysteph-group/logo-new.png", caption: "Symbol", ratio: "3 / 2", contain: true },
          { src: "/portfolio/kaysteph-group/logo-treatment-1.png", caption: "Primary lockup", ratio: "3 / 2", contain: true },
          { src: "/portfolio/kaysteph-group/application-popo.png", caption: "Primary lockup reversed", ratio: "3 / 1", contain: true, ground: "var(--ink)", full: true },
        ],
      },
      {
        id: "pattern",
        label: "Pattern",
        cols: 1,
        media: [
          { src: "/portfolio/kaysteph-group/application-pp.png", caption: "Chevron pattern", ratio: "8 / 1", contain: true },
        ],
      },
      {
        id: "collateral",
        label: "Collateral",
        cols: 2,
        media: [
          { src: "/portfolio/kaysteph-group/deliverable-profile.jpg", caption: "Presentation folder", ratio: "4 / 3" },
          { src: "/portfolio/kaysteph-group/deliverable-misc.jpg", caption: "Business card", ratio: "4 / 3" },
          { src: "/portfolio/kaysteph-group/deliverable-stationery.jpg", caption: "Flags", ratio: "4 / 3" },
          { src: "/portfolio/kaysteph-group/about.jpg", caption: "Company profile", ratio: "4 / 3" },
          { src: "/portfolio/kaysteph-group/deliverable-letterhead.jpg", caption: "Letterhead", ratio: "16 / 9", contain: true, full: true },
        ],
      },
      {
        id: "environment",
        label: "In place",
        cols: 2,
        media: [
          /* The billboard keeps the full width it had when this chapter was a
             single column; the reel sits beneath it as one column, because a
             9:16 frame run full-bleed is taller than the viewport. */
          { src: "/portfolio/kaysteph-group/deliverable-billboard.jpg", caption: "Site billboard", ratio: "3 / 2", full: true },
          {
            src: "/portfolio/kaysteph-group/signage-reel-poster.jpg",
            video: "/portfolio/kaysteph-group/signage-reel.mp4",
            videoSmall: "/portfolio/kaysteph-group/signage-reel-sm.mp4",
            caption: "Transit shelter advertising and forecourt signage",
            ratio: "9 / 16",
          },
        ],
      },
      {
        id: "merchandise",
        label: "Merchandise",
        cols: 2,
        media: [
          { src: "/portfolio/kaysteph-group/merch-flask-1.jpg", caption: "Flask", ratio: "5 / 4" },
          { src: "/portfolio/kaysteph-group/merch-flask-2.jpg", caption: "Flask colourways", ratio: "5 / 4" },
          { src: "/portfolio/kaysteph-group/merch-hat.jpg", caption: "Site helmet", ratio: "5 / 4" },
          { src: "/portfolio/kaysteph-group/merch-tshirt.jpg", caption: "T-shirt", ratio: "5 / 4" },
          {
            src: "/portfolio/kaysteph-group/people-reel-poster.jpg",
            video: "/portfolio/kaysteph-group/people-reel.mp4",
            videoSmall: "/portfolio/kaysteph-group/people-reel-sm.mp4",
            caption: "The range worn on site and in the office",
            ratio: "4 / 5",
          },
          { src: "/portfolio/kaysteph-group/closing.jpg", caption: "Mug", ratio: "3 / 2", full: true },
          {
            src: "/portfolio/kaysteph-group/merch-cube-poster.jpg",
            video: "/portfolio/kaysteph-group/merch-cube.mp4",
            videoSmall: "/portfolio/kaysteph-group/merch-cube-sm.mp4",
            caption: "Logo applications across the merchandise range",
            ratio: "1 / 1",
            full: true,
          },
        ],
      },
    ],
    metrics: [
      { label: "Brand assets delivered", value: "40+" },
      { label: "Touchpoints unified", value: "12" },
      { label: "New positioning", value: "Premium" },
    ],
  },
  {
    slug: "camping",
    industry: "Outdoor & Lifestyle",
    tag: "Brand Identity",
    title: "Camping Nigeria",
    year: "2024",
    client: "Camping Nigeria",
    disciplines: ["Brand Strategy", "Identity Design", "Web & Digital"],
    role: ["Brand Strategy", "Identity System", "Digital & Merch Applications"],
    summary:
      "A modern, recognizable identity for an outdoor lifestyle brand promoting camping, nature exploration, and curated adventures across Nigeria.",
    brief:
      "Camping Nigeria connects individuals and communities to curated outdoor experiences, encouraging deeper connection with nature, wellness, and local tourism. They needed a brand language that could feel as wild as the terrain and as warm as the community around the campfire.",
    challenge:
      "Outdoor branding tends to drift toward heritage Americana clichés or extreme-sports neon. Camping Nigeria needed something more rooted: confidently African, modern, and designed to scale across digital, apparel, and field touchpoints without losing warmth.",
    approach:
      "A geometric symbol fusing mountain, tent, and sun, anchored on a forest-green and warm-gold palette. The system extends across an app icon, lanyards, apparel, and stationery, with photography that earns its place in the system rather than decorates it.",
    outcome:
      "The new identity positions Camping Nigeria as a modern, scalable outdoor lifestyle brand, ready to anchor digital products, retail merchandise, and a growing community of adventurers across the country.",
    gradient: "from-emerald-950 via-green-950 to-stone-950",
    accent: "#c89a2a",
    cover: "/brand/camping-wide.jpg",
    hero: { kind: "image", src: "/portfolio/camping/hero.jpg" },
    chapters: [
      {
        /* Placed first so it lands directly under the opening paragraph: the
           whole system in one pass before the page starts taking it apart. */
        id: "in-use",
        label: "In use",
        cols: 1,
        media: [
          {
            src: "/portfolio/kaysteph-group/merch-slide-poster.jpg",
            video: "/portfolio/kaysteph-group/merch-slide.mp4",
            videoSmall: "/portfolio/kaysteph-group/merch-slide-sm.mp4",
            caption: "The identity across the delivered collection",
            ratio: "1280 / 544",
            full: true,
          },
        ],
      },
      {
        id: "identity",
        label: "Identity",
        cols: 2,
        media: [
          { src: "/portfolio/camping/symbol-gold.png", caption: "Symbol", ratio: "3 / 2", contain: true },
          { src: "/portfolio/camping/symbol-cream.png", caption: "Symbol reversed", ratio: "3 / 2", contain: true, ground: "var(--ink)" },
          { src: "/portfolio/camping/logo-green.png", caption: "Primary lockup", ratio: "3 / 2", contain: true },
          { src: "/portfolio/camping/logo-cream.png", caption: "Lockup reversed", ratio: "3 / 2", contain: true, ground: "var(--ink)" },
          { src: "/portfolio/camping/wordmark-green.png", caption: "Wordmark", ratio: "8 / 1", contain: true, full: true },
        ],
      },
      {
        id: "applications",
        label: "Applications",
        cols: 3,
        media: [
          { src: "/portfolio/camping/mockup-app.jpg", caption: "App icon", ratio: "3 / 2" },
          { src: "/portfolio/camping/mockup-tag.jpg", caption: "Lanyard and badge", ratio: "3 / 2" },
          { src: "/portfolio/camping/mockup-card.jpg", caption: "Business card", ratio: "3 / 2" },
        ],
      },
      {
        id: "apparel",
        label: "Apparel",
        cols: 2,
        media: [
          { src: "/portfolio/camping/mockup-cap.jpg", caption: "Cap", ratio: "3 / 4" },
          { src: "/portfolio/camping/mockup-tshirt.jpg", caption: "T-shirt", ratio: "3 / 4" },
        ],
      },
    ],
    metrics: [
      { label: "Touchpoints unified", value: "10+" },
      { label: "Identity assets", value: "25+" },
      { label: "New positioning", value: "Modern Outdoor" },
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1) return PROJECTS[0];
  return PROJECTS[(i + 1) % PROJECTS.length];
}
