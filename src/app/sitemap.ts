import type { MetadataRoute } from "next";
import { PROJECTS } from "@/components/site/projects-data";
import { SITE_URL, CONTENT_REVISED } from "@/lib/seo";

/**
 * lastModified is a fixed revision date, not `new Date()`.
 *
 * Stamping the build time meant all eight URLs claimed to change on every
 * deploy — a favicon swap re-dated the whole site. Google treats a lastmod
 * that moves in lockstep with deploys as noise and stops trusting it, so the
 * page that genuinely did change loses its signal along with the rest. See
 * CONTENT_REVISED in lib/seo.ts: bump it when the copy actually changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = CONTENT_REVISED;

  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    ...PROJECTS.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
