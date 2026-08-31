import fs from "node:fs";
import path from "node:path";

/**
 * Lists the images sitting in a folder under /public, as web paths.
 *
 * Server-only, and called from statically-rendered pages, so the read happens
 * once at build time rather than per request. That is the whole point: dropping
 * a file into the folder is enough to get it on the site, with no code edit and
 * no manifest to keep in sync.
 *
 * Returns them in filename order — number your files to control sequence.
 */

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export function listPublicImages(publicSubpath: string): string[] {
  const dir = path.join(process.cwd(), "public", publicSubpath);

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    // Folder missing entirely — a legitimate state, not an error worth failing
    // the build over. The caller falls back to its default image.
    return [];
  }

  return entries
    .filter((name) => {
      // Skip dotfiles, underscore-prefixed working files, and the README.
      if (name.startsWith(".") || name.startsWith("_")) return false;
      return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase());
    })
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((name) => `/${publicSubpath.replace(/\\/g, "/")}/${name}`);
}
