/**
 * Equinoux site content.
 *
 * ⚠️  ITEMS MARKED "REPLACE" ARE HONEST DEFAULTS, NOT VERIFIED BUSINESS FACTS.
 *     Swap them for your real data before treating the site as final:
 *       - PRICING amounts (currently "Custom / On request" — a real studio
 *         quoting model, so nothing false is shown, but set fixed prices here
 *         if you use them).
 *       - TEAM members (names/roles/photos) — replace the single founder entry
 *         and add real teammates, or keep the solo framing.
 *       - TESTIMONIALS — real, named, client-supplied quotes. Attributed in
 *         full, so treat the wording as the client's own and do not edit it.
 */

export const BRAND = {
  name: "Equinoux",
  established: "2020",
  tagline: "A strategic design studio building brands that notice the details.",
  email: "equinoux.co@gmail.com",
  phone: "+234 814 607 5937",
  phoneHref: "tel:+2348146075937",
  whatsapp: "https://wa.me/2348146075937",
  instagram: "https://www.instagram.com/equinoux.co/",
  location: "Abuja, Nigeria · Remote worldwide",
};

/* The studio counters live in intro.tsx (STATS). A duplicate HERO_STATS array
   used to sit here unused; it was removed rather than left to drift out of sync
   with the real figures. */

/* ── Services (real, from your studio) ── */
export const SERVICES = [
  {
    key: "brand-strategy",
    name: "Brand Strategy",
    headline: "Positioning that earns the first decision.",
    body: "Category framing, narrative, and messaging. The underlying logic, settled before a single pixel is drawn.",
    points: ["Positioning", "Narrative", "Messaging", "Naming"],
    image: "/services/brand-strategy.jpg",
    flip: "/brand/kaysteph.jpg",
  },
  {
    key: "identity-design",
    name: "Identity Design",
    headline: "Marks and systems built to scale.",
    body: "Logo systems, typography, colour, and motion. A visual language coherent from a favicon to a hoarding.",
    points: ["Logo Systems", "Typography", "Colour", "Motion"],
    image: "/services/identity-design.jpg",
    flip: "/brand/camping.jpg",
  },
  {
    key: "web-design",
    name: "Web Design",
    headline: "Editorial sites engineered to convert.",
    body: "High-craft websites and storefronts built for clarity, speed, and the moment a visitor decides to trust you.",
    points: ["Editorial UI", "E-commerce", "Performance", "SEO Foundations"],
    image: "/services/web-design.jpg",
    flip: "/brand/kaya.jpg",
  },
  {
    key: "digital-experience",
    name: "Digital Experience",
    headline: "Interaction that reinforces the brand.",
    body: "Considered motion, transitions, and storytelling layered onto the product so every scroll earns its place.",
    points: ["Motion", "Interaction", "Prototyping", "Art Direction"],
    image: "/services/digital-experience.jpg",
    flip: "/brand/belgore.jpg",
  },
  {
    key: "design-systems",
    name: "Design Systems",
    headline: "Guidelines that keep the brand coherent.",
    body: "Token-driven libraries and rules that make every future asset on-brand by default as the team grows.",
    points: ["Tokens", "Components", "Guidelines", "Handoff"],
    image: "/services/design-systems.jpg",
    flip: "/portfolio/kaysteph-group/deliverable-stationery.jpg",
  },
];

/* ── Process (real, from your studio) ── */
export const PROCESS = [
  { n: "01", title: "Discovery", body: "Focused sessions to map the business, market, and audience. We define what success looks like first." },
  { n: "02", title: "Direction", body: "Strategic positioning and creative direction. The blueprint the rest of the work hangs from." },
  { n: "03", title: "Design", body: "Identity, system, and surfaces built with obsessive attention to typography, rhythm, and motion." },
  { n: "04", title: "Implementation", body: "Launch, hand-off, and ongoing partnership as the brand grows into its new self." },
];

/* ── Team — REPLACE with real people, or keep the founder-led framing. ── */
export const TEAM = [
  {
    name: "Akande Kehinde Kolawole",
    role: "Founder & Principal · Strategy & Design",
    bio: "Founder-led, working with a trusted bench of specialists per project.",
    image: "/founder.jpg",
    contain: false,
  },
];

export const TEAM_SUMMARY = {
  disciplines: ["Brand Strategy", "Identity", "Web & Product", "Design Systems"],
  note: "An independent studio with a specialist bench assembled to fit each engagement.",
};

/* ── Pricing — honest quote-based model. Set fixed amounts if you use them. ── */
/* ── PRICING ──
 *  Two groups — Branding and Website Development — each with three tiers.
 *  `price` is a whole-USD amount. Set `featured` on the plan to highlight it
 *  (subtle fill + "Popular" tag). Each feature is { label, on } — `on:false`
 *  renders a muted ✗ (excluded). `note` shows a small meta line under the
 *  features (e.g. delivery window). Swap figures for your real fees anytime.
 */
export const PRICING = {
  currency: "$",
  groups: [
    {
      key: "branding",
      label: "Branding",
      tiers: [
        {
          key: "brand-starter",
          name: "Starter",
          size: "Small Package",
          price: 500,
          blurb: "The essential mark and identity kit to launch a new brand with a clear, confident first impression.",
          features: [
            { label: "Positioning & Messaging", on: true },
            { label: "Primary Logo + Variations", on: true },
            { label: "Core Colour + Typography System", on: true },
          ],
          featured: false,
        },
        {
          key: "brand-growth",
          name: "Growth",
          size: "Medium Package",
          price: 1000,
          blurb: "A complete, ready-to-use brand system with the templates and collateral to start showing up everywhere, consistently.",
          features: [
            { label: "Everything in Starter", on: true },
            { label: "Full Brand Identity System", on: true },
            { label: "10 Ready-to-Use Canva Templates", on: true },
            { label: "Brand Applications & Collateral", on: true },
            { label: "Company Profile Document", on: true },
          ],
          featured: true,
        },
        {
          key: "brand-performance",
          name: "Performance",
          size: "Big Package",
          price: 1500,
          blurb: "The full strategic build, covering strategy, guidelines and motion, for brands that need a system designed to scale.",
          features: [
            { label: "Everything in Growth", on: true },
            { label: "Brand Strategy", on: true },
            { label: "Brand Guidelines Doc", on: true },
            { label: "Design System Direction", on: true },
            { label: "Motion Graphic Presentations", on: true },
          ],
          featured: false,
        },
      ],
    },
    {
      key: "web",
      label: "Website Development",
      tiers: [
        {
          key: "web-basic",
          name: "Basic",
          size: "Small Package",
          price: 400,
          blurb: "A clean, responsive site that gets a small business online quickly with everything visitors need to make contact.",
          features: [
            { label: "Up to 5 Pages", on: true },
            { label: "Responsive Design", on: true },
            { label: "Basic SEO Optimisation", on: true },
            { label: "Contact Form Integration", on: true },
          ],
          note: "Delivery: 1 to 2 weeks",
          featured: false,
        },
        {
          key: "web-business",
          name: "Business",
          size: "Medium Package",
          price: 800,
          blurb: "A larger, custom-designed site with a CMS so your team can grow and manage content without a developer.",
          features: [
            { label: "Up to 15 Pages", on: true },
            { label: "Custom Design & Branding", on: true },
            { label: "Advanced SEO Optimisation", on: true },
            { label: "CMS Integration", on: true },
          ],
          note: "Delivery: 2 to 4 weeks",
          featured: false,
        },
        {
          key: "web-ecommerce",
          name: "E-Commerce",
          size: "Big Package",
          price: 1500,
          blurb: "A complete online store with products, payments, inventory and orders, ready to sell from day one.",
          features: [
            { label: "Unlimited Products", on: true },
            { label: "Payment Gateway Integration", on: true },
            { label: "Inventory Management", on: true },
            { label: "Order Tracking", on: true },
          ],
          note: "Delivery: 4 to 6 weeks",
          featured: false,
        },
      ],
    },
  ],
};

/* ── Testimonials — real, named, client-supplied quotes. Verbatim from the
      client document; only obvious typing slips (a missing space after a
      comma) are corrected, and the emoji is dropped because the marquee cards
      are typographic. Do not paraphrase these. ── */
export const TESTIMONIALS = [
  {
    quote:
      "The logo and brand identity system is fire — everyone on the team loves it.",
    name: "Chukwubunna Aniekwenna",
    role: "CEO · Kaya Express Ltd",
  },
  {
    quote:
      "Working with Kola at Kaysteph Group was a wonderful experience. His designs were consistently creative, professional, and aligned with our brand. What stood out most was that he went beyond just delivering graphics and designs — he also brought fresh ideas and valuable input on our social media and video content. He's creative, proactive, and genuinely committed to delivering quality.",
    name: "Eboshogwe Acha",
    role: "Head of Human Resources · Kaysteph Group",
  },
  {
    quote:
      "We really love the site. It makes us look like what we actually portray ourselves to be.",
    name: "Rifkatu Mustapha",
    role: "Associate Lawyer · Belgore, Olufadi & Co.",
  },
  {
    quote: "I'm short of words! Thank you so much, Equinoux.",
    name: "Adetola Charles",
    role: "CFO · CROWEE",
  },
];

/* ── Trust band ── */
export const TRUST = {
  rating: 4.9,
  ratingOutOf: 5,
  industries: ["Real Estate", "Retail & E-commerce", "Lifestyle", "Outdoor", "Education"],
};

/* ── FAQ — written from your real offer, no invented facts. ── */
export const FAQ = [
  {
    q: "How long does a project take?",
    a: "A focused Brand Sprint typically runs 2 to 3 weeks. A full identity with web sits around 5 to 8 weeks depending on scope. We give you a firm timeline after Discovery, before any design begins.",
  },
  {
    q: "Which industries do you work with?",
    a: "We've shipped work across real estate, retail and e-commerce, outdoor lifestyle, and education. The through-line is ambitious teams who treat craft as a competitive advantage rather than a category.",
  },
  {
    q: "How does pricing work?",
    a: "Every engagement is scoped to the brief, so we quote per project rather than list fixed prices. Tell us what you're building and we'll come back with a precise figure and timeline, with no obligation.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. Beyond hand-off we offer an ongoing partner retainer for brands that want a design team on call for new surfaces, campaigns, and keeping the system coherent as you grow.",
  },
  {
    q: "Are you a solo studio or a team?",
    a: "Equinoux is founder-led and independent, working with a trusted bench of specialists assembled to fit each engagement. You get senior attention on every project, not a hand-off to juniors.",
  },
];
