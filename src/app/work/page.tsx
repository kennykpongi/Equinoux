import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { WorkIndex } from "@/components/site/work-index";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { JsonLd } from "@/components/site/json-ld";
import { PROJECTS } from "@/components/site/projects-data";
import { breadcrumbNode, workListNode } from "@/lib/seo";

export const metadata = {
  title: "Selected Works | Equinoux",
  description:
    "Selected work from Equinoux: brand systems, identities, and digital products for ambitious companies. Case studies in strategy, design, and web.",
  alternates: { canonical: "/work" },
  /* Google has ignored meta keywords since 2009 and Bing reads them as a spam
     signal, so these move no rankings — they are here because the field is
     published site-wide and a page-specific list is at least honest about what
     the page is. Kept short and true: every term describes content actually on
     this page. Never stuff, and never list a service the studio does not
     offer. What genuinely ranks is the title, description, h1 and body copy. */
  keywords: [
    "design portfolio",
    "brand identity case studies",
    "web design case studies",
    "brand systems",
    "identity design",
    "design studio Nigeria",
    "Equinoux work",
  ],
};

export default function WorkPage() {
  return (
    <main style={{ backgroundColor: "var(--paper)" }}>
      <JsonLd
        graph={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Works", path: "/work" },
          ]),
          workListNode(PROJECTS),
        ]}
      />
      <SmoothScroll />
      <SiteNav />
      <WorkIndex />
      <SiteFooter />
    </main>
  );
}
