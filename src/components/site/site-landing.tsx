"use client";

import { Loader } from "./loader";
import { SiteNav } from "./nav";
import { Hero } from "./hero";
import { Manifesto } from "./manifesto";
import { Intro } from "./intro";
import { Projects } from "./projects";
import { Services } from "./services";
import { Team } from "./team";
// Pricing is hidden for now. The section and its PRICING data are intact —
// re-render <Pricing /> below and restore the nav/footer links to bring it
// back (see nav.tsx LINKS and footer.tsx COLS).
// import { Pricing } from "./pricing";
import { Testimonials } from "./testimonials";
import { Faq } from "./faq";
import { Contact } from "./contact";
import { SiteFooter } from "./footer";
import { SmoothScroll } from "./smooth-scroll";

export function SiteLanding() {
  return (
    <main style={{ backgroundColor: "var(--paper)" }}>
      <SmoothScroll />
      <Loader />
      <SiteNav overHero />
      <Hero />
      <Manifesto />
      <Intro />
      <Projects />
      <Services />
      <Team />
      {/* <Pricing /> — hidden */}
      <Testimonials />
      <Faq />
      <Contact />
      <SiteFooter />
    </main>
  );
}
