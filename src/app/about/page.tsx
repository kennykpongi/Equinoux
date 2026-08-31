import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { AboutPage } from "@/components/site/about-page";
import { listPublicImages } from "@/lib/public-media";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbNode } from "@/lib/seo";

export const metadata = {
  title: "Studio | About Equinoux",
  description:
    "Equinoux is an independent, founder-led strategic design studio in Abuja, Nigeria, working worldwide. Brand strategy, identity, web and design systems.",
  alternates: { canonical: "/about" },
  /* Google has ignored meta keywords since 2009 and Bing reads them as a spam
     signal, so these move no rankings — they are here because the field is
     published site-wide and a page-specific list is at least honest about what
     the page is. Kept short and true: every term describes content actually on
     this page. Never stuff, and never list a service the studio does not
     offer. What genuinely ranks is the title, description, h1 and body copy. */
  keywords: [
    "about Equinoux",
    "strategic design studio",
    "design studio Abuja",
    "founder-led design studio",
    "brand strategy",
    "identity design",
    "design systems",
  ],
};

export default function About() {
  /* The hero plate's images are whatever is sitting in /public/site/about.
     This is a server component and the page is statically rendered, so the
     folder is read once at build time — adding an image is a file drop plus a
     redeploy, with no code change. See that folder's README.txt. */
  const heroImages = listPublicImages("site/about");

  return (
    <main style={{ backgroundColor: "var(--paper)" }}>
      <JsonLd
        graph={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Studio", path: "/about" },
          ]),
        ]}
      />
      <SmoothScroll />
      <SiteNav />
      <AboutPage heroImages={heroImages} />
      <SiteFooter />
    </main>
  );
}
