import { SiteNav } from "@/components/site/nav";
import { ContactPage } from "@/components/site/contact-page";
import { listPublicImages } from "@/lib/public-media";
import { PROJECTS } from "@/components/site/projects-data";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbNode } from "@/lib/seo";

export const metadata = {
  title: "Contact | Equinoux Studio, Abuja, Nigeria",
  description:
    "Start a project with Equinoux. Brand strategy, identity, web and design systems, from Abuja, Nigeria, working worldwide.",
  alternates: { canonical: "/contact" },
  /* Google has ignored meta keywords since 2009 and Bing reads them as a spam
     signal, so these move no rankings — they are here because the field is
     published site-wide and a page-specific list is at least honest about what
     the page is. Kept short and true: every term describes content actually on
     this page. Never stuff, and never list a service the studio does not
     offer. What genuinely ranks is the title, description, h1 and body copy. */
  keywords: [
    "contact Equinoux",
    "hire a design studio",
    "brand identity enquiry",
    "design studio Abuja",
    "project brief",
    "web design Nigeria",
  ],
};

export default function Contact() {
  /* The filmstrip reads /public/site/contact, the same drop-a-file convention
     as the About hero. It falls back to the About folder and then to project
     covers so the strip is never empty — see that folder's README.txt. */
  const backdrop = (() => {
    const own = listPublicImages("site/contact");
    if (own.length > 0) return own;
    const about = listPublicImages("site/about");
    if (about.length > 0) return about;
    return PROJECTS.map((p) => p.cover).filter((c): c is string => Boolean(c));
  })();

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <SiteNav onDark />
      <ContactPage backdrop={backdrop} />
    </>
  );
}
