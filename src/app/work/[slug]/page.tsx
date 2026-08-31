import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { CaseStudy } from "@/components/site/case-study";
import { PROJECTS, getProject } from "@/components/site/projects-data";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbNode, caseStudyNode } from "@/lib/seo";

// Every project now renders through the one editorial template, so this route
// pre-renders all of them — there are no bespoke per-slug pages left to skip.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  const title = `${project.title}, ${project.tag} | Equinoux`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    /* Built from the project's own record rather than a hand-kept list, so a
       case study can never drift out of step with the work it describes.
       Deduped because several projects carry the same string as title and
       client. See the note in work/page.tsx on what meta keywords are worth. */
    keywords: [
      ...new Set([
        project.title,
        project.client,
        ...project.disciplines,
        ...(project.industry ? [project.industry] : []),
        "case study",
        "Equinoux",
      ]),
    ],
    openGraph: {
      title,
      description: project.summary,
      type: "article",
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main style={{ backgroundColor: "var(--paper)" }}>
      <JsonLd
        graph={[
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Works", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
          caseStudyNode(project),
        ]}
      />
      <SmoothScroll />
      <SiteNav />
      <CaseStudy project={project} />
      <SiteFooter />
    </main>
  );
}
