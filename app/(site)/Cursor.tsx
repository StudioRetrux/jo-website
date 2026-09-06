"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCursor } from "./contexts/CursorContext";

type OverlayKind = "view" | "arrow" | "drag";

const SIZE = 12;
const EASE = 0.08;

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  // the dot only earns its opacity once the pointer has told us where it is
  const movedRef = useRef(false);
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
  const [overlayKind, setOverlayKind] = useState<OverlayKind>("view");

  // the three .cursor variants share the follower — glyph and skin differ
  const isOverlay = mode === "view" || mode === "arrow" || mode === "drag";

  // The dot and the 104px follower are two separate elements. Leaving the dot on under
  // an overlay reads as a doubled cursor, so the overlay takes the dot's place outright.
  const syncDot = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const m = modeRef.current;
    const visible = movedRef.current && m === "default";
    cursor.style.opacity = visible ? "1" : "0";
  }, []);

  useEffect(() => { syncDot(); }, [mode, syncDot]);

  useEffect(() => {
    if (isOverlay) {
      setOverlayMounted(true);
      setOverlayKind(mode as OverlayKind);
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
      movedRef.current = true;
      syncDot();
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
  }, [pointerFine, posRef, syncDot]);

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
              width: 112,
              height: 112,
              borderRadius: "50%",
              // figma .cursor: CTA is solid, the arrow variants sit on a translucent
              // wash with a hairline so the image beneath still reads through
              background: overlayKind === "view" ? "#361e00" : "rgba(54, 30, 0, 0.6)",
              border: overlayKind === "view" ? "none" : "2px solid rgba(247, 246, 245, 0.3)",
              boxSizing: "border-box",
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
              {overlayKind === "view" ? "VIEW" : <CursorArrows kind={overlayKind} />}
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
          // matches the overlay's own 150ms in/out, so the handover reads as one cursor
          transition: "opacity 150ms linear",
          zIndex: 9997,
          willChange: "transform",
          marginLeft: -SIZE / 2,
          marginTop: -SIZE / 2,
        }}
      />
    </>
  );
}

// paths lifted verbatim from figma Icon 1:1 / Icon 1:1 - Big/Drag
function CursorArrows({ kind }: { kind: "arrow" | "drag" }) {
  if (kind === "drag") {
    return (
      <svg width="65.5" height="64" viewBox="0 0 65.5 64" fill="none" aria-hidden="true">
        <path
          d="M40.75 31.5H64.75M53.2213 42L64.75 31.5L53.2213 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.75 31.5H0.75M12.2787 42L0.75 31.5L12.2787 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M2 19.832H38.6667M22.1667 36.332L38.6667 19.832L22.1667 3.33203"
        stroke="currentColor"
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
