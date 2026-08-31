"use client";

/**
 * A project card's cover.
 *
 * Most projects have a still. Where one carries `coverVideo` the card plays it
 * instead, using the same on-screen-only rules as every other clip on the site
 * (see AutoVideo) so a card three screens down never decodes.
 *
 * `cover` is still required alongside a moving cover: it is the poster, it is
 * what renders before the clip is decodable, and it is the only thing the
 * /work list's pointer-following preview ever shows — a 3MB file has no place
 * behind a 200px hover thumbnail.
 */

import Image from "next/image";
import { AutoVideo } from "./auto-video";
import type { Project } from "./projects-data";

export function CoverMedia({
  project,
  sizes,
  priority,
  imageClassName = "object-cover",
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  imageClassName?: string;
}) {
  const alt = `${project.title}: ${project.tag}`;

  if (project.coverVideo) {
    return (
      <AutoVideo
        src={project.coverVideo}
        srcSmall={project.coverVideoSmall}
        poster={project.cover!}
        label={alt}
      />
    );
  }

  return (
    <Image
      src={project.cover!}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={imageClassName}
    />
  );
}
