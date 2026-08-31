/**
 * Layout primitives — the whole site's geometry lives here.
 *
 * One container: full-bleed up to `--page-max` (1920px) with a `--page-inset`
 * gutter (20px desktop / 10px mobile) and nothing else. There is no secondary
 * content well; sections are meant to reach the edges of the display, and
 * narrower measures are expressed as spans of the 8-column grid instead.
 *
 * Every value resolves to a token in globals.css, so retuning the system is a
 * one-file change rather than a sweep through every section.
 */

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "paper" | "soft" | "ink";

const TONE_BG: Record<Tone, string> = {
  paper: "var(--paper)",
  soft: "var(--paper-soft)",
  ink: "var(--ink)",
};

/** Vertical rhythm steps. Sections are paced, not evenly spaced. */
export type Space = "none" | "sm" | "md" | "lg" | "xl" | "2xl";

const SPACE: Record<Space, string> = {
  none: "0px",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  "2xl": "var(--space-2xl)",
};

/**
 * A full-width band. Paints the tone edge-to-edge and applies the vertical
 * rhythm; horizontal insets come from `Container` so a section can hold both
 * inset content and full-bleed media.
 */
export function Section({
  id,
  as: Tag = "section",
  children,
  className,
  tone = "paper",
  top = "2xl",
  bottom = "none",
  style,
  ...rest
}: {
  id?: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  top?: Space;
  bottom?: Space;
  style?: CSSProperties;
} & Omit<React.HTMLAttributes<HTMLElement>, "style">) {
  return (
    <Tag
      id={id}
      className={cn("relative w-full", className)}
      style={{
        backgroundColor: TONE_BG[tone],
        color: tone === "ink" ? "var(--paper)" : "var(--ink)",
        paddingTop: SPACE[top],
        paddingBottom: SPACE[bottom],
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * The site container: centred, capped at 1920px, inset by the page gutter.
 * `bleed` drops the inset for media that should touch the viewport edges.
 */
export function Container({
  id,
  children,
  className,
  bleed = false,
  as: Tag = "div",
  style,
}: {
  /** Anchor target. Sits on the container rather than the band so an in-page
   *  link lands on the content, not on the band's top padding. */
  id?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
  as?: ElementType;
  style?: CSSProperties;
}) {
  return (
    <Tag
      id={id}
      className={cn("relative mx-auto w-full", className)}
      style={{
        maxWidth: "var(--page-max)",
        paddingLeft: bleed ? 0 : "var(--page-inset)",
        paddingRight: bleed ? 0 : "var(--page-inset)",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * A labelled section head: a small caps eyebrow in the first column with the
 * content beside it. This is the repeated "Service / Digital / Art Direction"
 * pattern from the reference's index pages.
 */
export function LabelRow({
  label,
  children,
  className,
  as: LabelTag = "span",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  /** Render the label as a real heading where it *is* the section's heading,
   *  so the outline stays complete without adding visible display type. */
  as?: "span" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:gap-10", className)}>
      <LabelTag
        className="t-meta shrink-0 font-normal sm:w-[8.5rem]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </LabelTag>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/**
 * The roll-over label. Renders the text twice — the visible copy and a ghost
 * parked one line below — inside a one-line clip box; hovering the nearest
 * link or button slides the pair up. See `.roll` in globals.css.
 */
export function Roll({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn("roll", className)}>
      <span>{children}</span>
      <span data-roll-ghost aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
