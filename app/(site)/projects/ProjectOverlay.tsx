"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ProjectContent from "./ProjectContent";
import type { Project } from "@/lib/projects/types";
import { SLIDE_DURATION, SLIDE_EASE } from "../contexts/PageNavContext";
import { useLoadBar } from "../LoadBar";
import styles from "./projectOverlay.module.css";

type Ctx = { openProject: (slug: string) => void };

const ProjectOverlayContext = createContext<Ctx>({ openProject: () => {} });

export const useProjectOverlay = () => useContext(ProjectOverlayContext);

/**
 * Project details open as an overlay in the current document instead of a route
 * navigation: the page you came from stays mounted underneath, so the slide is ours
 * to control and browser Back needs no view-transition plumbing.
 *
 * /projects/[slug] still exists as a real route for direct hits, refreshes and no-JS.
 */
export function ProjectOverlayProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { begin, finish } = useLoadBar();

  useEffect(() => { setMounted(true); }, []);

  const openProject = useCallback(async (slug: string) => {
    begin();

    let data: Project;
    try {
      const res = await fetch(`/api/projects/${slug}`);
      if (!res.ok) throw new Error(String(res.status));
      data = await res.json();
    } catch {
      // let the real route render its own 404
      window.location.assign(`/projects/${slug}`);
      return;
    }

    // fill the bar rather than yanking it away, and let it ride the slide out
    finish(SLIDE_DURATION);

    if (closeTimer.current) clearTimeout(closeTimer.current);
    window.history.pushState({}, "", `/projects/${slug}`);
    setProject(data);
    // two frames: mount closed, then animate, or the transition never runs
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, [begin, finish]);

  // Back (button, gesture or mouse side button) pops our pushed entry — slide out.
  useEffect(() => {
    const onPopState = () => {
      if (window.location.pathname.startsWith("/projects/")) return;
      setOpen(false);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setProject(null), SLIDE_DURATION);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <ProjectOverlayContext.Provider value={{ openProject }}>
      {children}
      {mounted && project && createPortal(
        <div
          className={styles.overlay}
          style={{
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: `transform ${SLIDE_DURATION}ms ${SLIDE_EASE}`,
          }}
        >
          <ProjectContent project={project} onClose={() => window.history.back()} />
        </div>,
        document.body,
      )}
    </ProjectOverlayContext.Provider>
  );
}
