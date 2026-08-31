import { SiteLanding } from "@/components/site/site-landing";
import { JsonLd } from "@/components/site/json-ld";
import { organizationNode, webSiteNode } from "@/lib/seo";

export const metadata = {
  title: "Equinoux | Strategic Design Studio, Brand, Identity & Web",
  description:
    "Equinoux is an independent strategic design studio crafting brand systems, identities, and websites for ambitious companies. Based in Abuja, working worldwide.",
};

// Root route: the agency landing. Case studies live at /work/*.
// The former immersive /studio landing is retired (redirects to /).
export default function Home() {
  return (
    <>
      {/* The studio and the site as entities. Declared once, here, and
          referenced by @id from every other page rather than repeated. */}
      <JsonLd graph={[organizationNode(), webSiteNode()]} />
      <SiteLanding />
    </>
  );
}
