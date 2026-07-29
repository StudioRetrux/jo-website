"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getImageProps } from "next/image";

// creep target while waiting on something unmeasurable, and the fill-to-100 speed
const CREEP_TO = 92;
const CREEP_MS = 2400;
const FILL_MS = 300;

/**
 * Preloading only helps if we request the byte-identical URL the page will request.
 *
 * - via next/image: pass the `sizes` the real <Image> uses so the browser resolves the
 *   same srcSet candidate. Works for CMS URLs and local paths alike — Next optimizes
 *   both (remote hosts must be in next.config remotePatterns, or it isn't optimized).
 * - via CSS background-image or a plain <img>: pass raw, the URL is used verbatim.
 */
export type Asset = string | { src: string; sizes?: string; raw?: boolean };

type Ctx = {
  /** Unmeasurable wait (a fetch): bar creeps until finish() is called. */
  begin: () => void;
  /** Fill to 100%, hold for holdMs, then clear. */
  finish: (holdMs?: number) => void;
  /** Load asset groups in order, bar tracking real progress across all of them. */
  preload: (...groups: Asset[][]) => Promise<void>;
};

const LoadBarContext = createContext<Ctx>({ begin: () => {}, finish: () => {}, preload: async () => {} });

export const useLoadBar = () => useContext(LoadBarContext);

/**
 * next/image never requests the raw path — it requests /_next/image?url=…&w=…&q=…
 * Warming "/preload2.png" therefore caches a URL the page never asks for, and the bar
 * would report ready while the real fetch hasn't even started. Resolve the same srcSet
 * next/image would emit and let the browser pick the candidate it will actually use.
 */
function loadAsset(asset: Asset) {
  const { src, sizes, raw } = typeof asset === "string"
    ? { src: asset, sizes: "100vw", raw: false }
    : asset;

  let resolved: { src: string; srcSet?: string; sizes?: string };
  if (raw) {
    resolved = { src };
  } else {
    try {
      const { props } = getImageProps({ src, alt: "", fill: true, sizes: sizes ?? "100vw" });
      resolved = { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
    } catch {
      // unconfigured remote host — next/image can't optimize it either, so it ends up
      // served verbatim; warm that rather than stalling the bar
      resolved = { src };
    }
  }

  return new Promise<void>((resolve) => {
    const img = new Image();
    // resolve either way — a missing asset must not hold up the intro
    const done = () => resolve();
    img.onload = () => { img.decode().then(done, done); };
    img.onerror = done;
    if (resolved.sizes) img.sizes = resolved.sizes;
    if (resolved.srcSet) img.srcset = resolved.srcSet;
    img.src = resolved.src;
  });
}

export function LoadBarProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [ms, setMs] = useState(CREEP_MS);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => () => { if (clearTimer.current) clearTimeout(clearTimer.current); }, []);

  const show = useCallback((next: number, duration: number) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setMs(duration);
    setWidth(next);
  }, []);

  const begin = useCallback(() => {
    setMs(0);
    setWidth(0);
    requestAnimationFrame(() => show(CREEP_TO, CREEP_MS));
  }, [show]);

  const finish = useCallback((holdMs = 0) => {
    show(100, FILL_MS);
    clearTimer.current = setTimeout(() => setWidth(null), FILL_MS + holdMs);
  }, [show]);

  const preload = useCallback(async (...groups: Asset[][]) => {
    const total = groups.reduce((sum, group) => sum + group.length, 0);
    if (total === 0) return;

    setMs(0);
    setWidth(0);
    let done = 0;

    // groups run in order — earlier assets are needed first — parallel within a group
    for (const group of groups) {
      await Promise.all(group.map((asset) => loadAsset(asset).then(() => {
        done += 1;
        show((done / total) * 100, 200);
      })));
    }

    finish();
  }, [finish, show]);

  return (
    <LoadBarContext.Provider value={{ begin, finish, preload }}>
      {children}
      {mounted && width !== null && createPortal(
        <div
          className="navProgress"
          aria-hidden
          style={{ width: `${width}%`, transition: ms ? `width ${ms}ms cubic-bezier(0.1, 0.8, 0.2, 1)` : "none" }}
        />,
        document.body,
      )}
    </LoadBarContext.Provider>
  );
}
