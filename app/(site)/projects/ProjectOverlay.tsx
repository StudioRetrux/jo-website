"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ProjectContent from "./ProjectContent";
import type { Project, WorkItem } from "@/lib/projects/types";
import { SLIDE_DURATION, SLIDE_EASE } from "../contexts/PageNavContext";
import { useLoadBar } from "../LoadBar";
import styles from "./projectOverlay.module.css";

type Payload = { project: Project; related: WorkItem[] };

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
  const [payload, setPayload] = useState<Payload | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // which project the overlay is currently showing, so popstate can tell a reopen
  // from a no-op without waiting on a state update
  const slugRef = useRef<string | null>(null);
  const { begin, finish } = useLoadBar();

  useEffect(() => { setMounted(true); }, []);

  const load = useCallback(async (slug: string, push: boolean) => {
    begin();

    let data: Payload;
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
    // history already moved when this came from popstate — pushing again would
    // bury the entry we just returned to
    if (push) window.history.pushState({}, "", `/projects/${slug}`);
    slugRef.current = slug;
    setPayload(data);
    // two frames: mount closed, then animate, or the transition never runs
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, [begin, finish]);

  const openProject = useCallback((slug: string) => { load(slug, true); }, [load]);

  const close = useCallback(() => {
    slugRef.current = null;
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPayload(null), SLIDE_DURATION);
  }, []);

  // Back/forward (button, gesture or mouse side button). The URL is the truth: land on
  // a project and it shows, land anywhere else and it slides away. Anything narrower
  // strands history entries — /projects/a -> /projects/b -> Back would change the URL
  // and nothing else.
  useEffect(() => {
    const onPopState = () => {
      const slug = /^\/projects\/([^/]+)/.exec(window.location.pathname)?.[1];
      if (!slug) { close(); return; }
      if (slug !== slugRef.current) load(slug, false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [close, load]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <ProjectOverlayContext.Provider value={{ openProject }}>
      {children}
      {mounted && payload && createPortal(
        <div
          className={styles.overlay}
          style={{
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: `transform ${SLIDE_DURATION}ms ${SLIDE_EASE}`,
          }}
        >
          {/* shell is still mounted under us, so nav is state-driven — close, don't reload */}
          <ProjectContent
            project={payload.project}
            related={payload.related}
            homeNavigation="state"
            onLeave={close}
          />
        </div>,
        document.body,
      )}
    </ProjectOverlayContext.Provider>
  );
}
