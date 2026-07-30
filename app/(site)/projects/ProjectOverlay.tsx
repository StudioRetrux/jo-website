"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ProjectContent from "./ProjectContent";
import CuratedContent from "../curratedspaces/[slug]/CuratedContent";
import type { OtherItem } from "./ProjectOther";
import type { CuratedSpaceItem } from "@/lib/projects/curated-shared";
import type { Project } from "@/lib/projects/types";
import { SLIDE_DURATION, SLIDE_EASE } from "../contexts/PageNavContext";
import { useLoadBar } from "../LoadBar";
import styles from "./projectOverlay.module.css";

export type DetailKind = "project" | "curated";

/** One place deciding the URL for a kind — the link, the pushState and the popstate
 *  matcher all read from it, so they can't disagree. */
export const detailPath = (kind: DetailKind, slug: string) =>
  kind === "curated" ? `/curratedspaces/${slug}` : `/works/${slug}`;

const PATH_PATTERN = /^\/(works|curratedspaces)\/([^/]+)/;

type Detail =
  | { kind: "project"; slug: string; project: Project; related: OtherItem[] }
  | { kind: "curated"; slug: string; item: CuratedSpaceItem; related: OtherItem[] };

type Ctx = { openDetail: (kind: DetailKind, slug: string) => void };

const ProjectOverlayContext = createContext<Ctx>({ openDetail: () => {} });

export const useProjectOverlay = () => useContext(ProjectOverlayContext);

/**
 * Detail pages open as an overlay in the current document instead of a route
 * navigation: the page you came from stays mounted underneath, so the slide is ours
 * to control and browser Back needs no view-transition plumbing.
 *
 * The real routes still exist for direct hits, refreshes and no-JS.
 */
export function ProjectOverlayProvider({ children }: { children: React.ReactNode }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // what the overlay is currently showing, so popstate can tell a reopen from a no-op
  // without waiting on a state update
  const slugRef = useRef<string | null>(null);
  const { begin, finish } = useLoadBar();

  useEffect(() => { setMounted(true); }, []);

  const load = useCallback(async (kind: DetailKind, slug: string, push: boolean) => {
    begin();

    const endpoint = kind === "curated" ? `/api/curated/${slug}` : `/api/projects/${slug}`;
    let data: Detail;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(String(res.status));
      data = { kind, slug, ...(await res.json()) } as Detail;
    } catch {
      // let the real route render its own 404
      window.location.assign(detailPath(kind, slug));
      return;
    }

    // fill the bar rather than yanking it away, and let it ride the slide out
    finish(SLIDE_DURATION);

    if (closeTimer.current) clearTimeout(closeTimer.current);
    // history already moved when this came from popstate — pushing again would bury
    // the entry we just returned to
    if (push) window.history.pushState({}, "", detailPath(kind, slug));
    slugRef.current = slug;
    setDetail(data);
    // two frames: mount closed, then animate, or the transition never runs
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, [begin, finish]);

  const openDetail = useCallback((kind: DetailKind, slug: string) => {
    load(kind, slug, true);
  }, [load]);

  const close = useCallback(() => {
    slugRef.current = null;
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDetail(null), SLIDE_DURATION);
  }, []);

  // Back/forward (button, gesture or mouse side button). The URL is the truth: land on
  // a detail and it shows, land anywhere else and it slides away. Anything narrower
  // strands history entries — a -> b -> Back would change the URL and nothing else.
  useEffect(() => {
    const onPopState = () => {
      const match = PATH_PATTERN.exec(window.location.pathname);
      if (!match) { close(); return; }
      const kind: DetailKind = match[1] === "curratedspaces" ? "curated" : "project";
      if (match[2] !== slugRef.current) load(kind, match[2], false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [close, load]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <ProjectOverlayContext.Provider value={{ openDetail }}>
      {children}
      {mounted && detail && createPortal(
        <div
          className={styles.overlay}
          style={{
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: `transform ${SLIDE_DURATION}ms ${SLIDE_EASE}`,
          }}
        >
          {/* shell is still mounted under us, so nav is state-driven — close, don't reload */}
          {detail.kind === "curated" ? (
            <CuratedContent
              item={detail.item}
              related={detail.related}
              homeNavigation="state"
              onLeave={close}
            />
          ) : (
            <ProjectContent
              project={detail.project}
              related={detail.related}
              homeNavigation="state"
              onLeave={close}
            />
          )}
        </div>,
        document.body,
      )}
    </ProjectOverlayContext.Provider>
  );
}
