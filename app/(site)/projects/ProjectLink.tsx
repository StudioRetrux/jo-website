"use client";

import type { CSSProperties, ReactNode } from "react";
import { useProjectOverlay } from "./ProjectOverlay";

// Real anchor — middle-click, ctrl-click and crawlers get the actual route; a plain
// left-click opens the overlay instead so the page behind stays put.
export default function ProjectLink({
  slug,
  className,
  style,
  children,
}: {
  slug: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { openProject } = useProjectOverlay();

  return (
    <a
      href={`/projects/${slug}`}
      className={className}
      style={style}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        openProject(slug);
      }}
    >
      {children}
    </a>
  );
}
