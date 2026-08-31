/**
 * Renders a schema.org graph into the page.
 *
 * A single <script> per page holding a @graph, rather than one script per
 * entity: the nodes cross-reference each other by @id, and keeping them in one
 * document is what lets Google resolve those references instead of treating
 * each block as an unrelated island.
 *
 * Server component — this never ships to the client.
 */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  })
    // A literal "</script>" anywhere in the copy would close this element
    // early and drop the rest of the page into the document as markup.
    // Escaping "<" at the JSON level keeps the value byte-identical to a
    // parser while making that impossible.
    .replace(/</g, "\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
