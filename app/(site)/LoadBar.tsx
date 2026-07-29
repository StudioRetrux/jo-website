"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// creep target while waiting on something unmeasurable, and the fill-to-100 speed
const CREEP_TO = 92;
const CREEP_MS = 2400;
const FILL_MS = 300;

type Ctx = {
  /** Unmeasurable wait (a fetch): bar creeps until finish() is called. */
  begin: () => void;
  /** Fill to 100%, hold for holdMs, then clear. */
  finish: (holdMs?: number) => void;
  /** Load image groups in order, bar tracking real progress across all of them. */
  preload: (...groups: string[][]) => Promise<void>;
};

const LoadBarContext = createContext<Ctx>({ begin: () => {}, finish: () => {}, preload: async () => {} });

export const useLoadBar = () => useContext(LoadBarContext);

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    // resolve either way — a missing asset must not stall the bar
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
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

  const preload = useCallback(async (...groups: string[][]) => {
    const total = groups.reduce((sum, group) => sum + group.length, 0);
    if (total === 0) return;

    setMs(0);
    setWidth(0);
    let done = 0;

    // groups run in order — earlier assets are needed first — parallel within a group
    for (const group of groups) {
      await Promise.all(group.map((src) => loadImage(src).then(() => {
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
