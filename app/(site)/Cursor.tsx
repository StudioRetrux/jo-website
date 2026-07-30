"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "./contexts/CursorContext";

const SIZE = 12;
const EASE = 0.08;

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const { mode, posRef } = useCursor();
  const modeRef = useRef(mode);
  const [overlayMounted, setOverlayMounted] = useState(false);
  // A follower needs something to follow. Touch input has no hover position, so it
  // would sit wherever the last tap landed. Starts false so SSR and hydration agree.
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPointerFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  // held past the exit so the glyph doesn't swap mid fade-out
  const [overlayKind, setOverlayKind] = useState<"view" | "arrow">("view");

  // "view" and "arrow" share the follower — only the glyph inside it differs
  const isOverlay = mode === "view" || mode === "arrow";

  useEffect(() => {
    if (isOverlay) {
      setOverlayMounted(true);
      setOverlayKind(mode === "arrow" ? "arrow" : "view");
      return;
    }
    const t = setTimeout(() => setOverlayMounted(false), 150);
    return () => clearTimeout(t);
  }, [mode, isOverlay]);

  modeRef.current = mode;
  const entering = overlayMounted && isOverlay;

  useEffect(() => {
    // pointerFine starts false, so nothing is rendered on the first pass — this has to
    // re-run once it flips or there'd be no listener on the element that just mounted
    if (!pointerFine) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let frame = 0;
    let visible = false;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    currentPos.current = { ...current };

    function move(event: PointerEvent) {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!visible) {
        visible = true;
        current.x = target.x;
        current.y = target.y;
      }
      cursor!.style.opacity = modeRef.current === "hidden" ? "0" : "1";
    }

    function tick() {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      currentPos.current = { x: current.x, y: current.y };
      posRef.current = { x: current.x, y: current.y };
      const t = `translate3d(${current.x}px, ${current.y}px, 0)`;
      cursor!.style.transform = t;
      const view = viewRef.current;
      if (view) view.style.transform = t;
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", move);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [pointerFine, posRef]);

  const { x, y } = currentPos.current;

  if (!pointerFine) return null;

  return (
    <>
      {overlayMounted && (
        <div
          ref={viewRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 9998,
            willChange: "transform",
            transform: `translate3d(${x}px, ${y}px, 0)`,
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: "50%",
              background: "#361e00",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: `${entering ? "cursor-view-in" : "cursor-view-out"} 150ms linear forwards`,
            }}
          >
            <span
              style={{
                color: "var(--Text-Light-Body-Copy, #F7F6F5)",
                textAlign: "center",
                fontFamily: '"Albert Sans"',
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
                letterSpacing: "0.7px",
                userSelect: "none",
                whiteSpace: "nowrap",
                display: "flex",
                animation: `${entering ? "cursor-fade-in" : "cursor-fade-out"} 150ms linear forwards`,
              }}
            >
              {overlayKind === "arrow" ? (
                <svg width="40" height="16" viewBox="0 0 40 16" fill="none" aria-hidden="true">
                  <path d="M0 8h37M30 1l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                "VIEW"
              )}
            </span>
          </div>
        </div>
      )}

      {/* Original dot — difference blend on same element as willChange so compositing works */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background: "#d9d9d9",
          mixBlendMode: "difference",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 9997,
          willChange: "transform",
          marginLeft: -SIZE / 2,
          marginTop: -SIZE / 2,
        }}
      />
    </>
  );
}
