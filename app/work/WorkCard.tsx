import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./work.module.css";
import { useCursor } from "../contexts/CursorContext";

type Phase = "closed" | "pre-open" | "open";

type Props = {
  width: number;
  height: number;
  title?: string;
  info?: string;
  category?: string;
  year?: number;
  image?: string;
  hoverImage?: string;
  style?: CSSProperties;
  phase?: Phase;
  filtered?: boolean;
  imageRevealDelayMs?: number;
  resetKey?: number;
  onImageEl?: (el: HTMLDivElement | null) => void;
  exitPhase?: "hide" | "fade" | "slide-right";
};

function revealStyle(phase: Phase | undefined): CSSProperties {
  if (!phase) return {};
  return {
    transform: phase === "pre-open" ? "translateY(110%)" : "translateY(0)",
    transition: phase === "open"
      ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 120ms"
      : "none",
  };
}

const CLOSE_MS = 600;
const SLIDE_MS = 600;
const SLIDE_START_MS = 500;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export default function WorkCard({
  width,
  height,
  title = "Project Title",
  info,
  category,
  year,
  image,
  hoverImage,
  style,
  phase,
  filtered = false,
  imageRevealDelayMs = 0,
  resetKey = 0,
  onImageEl,
  exitPhase,
}: Props) {
  const { setMode } = useCursor();
  const resolvedInfo = info ?? ([category, year].filter(Boolean).join(" • ") || "Category • Year");
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onImageEl?.(imageRef.current);
    return () => { onImageEl?.(null); };
  }, [onImageEl]);
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [reEntering, setReEntering] = useState(false);
  const [hoverRevealed, setHoverRevealed] = useState(false);
  const vw = ((width * 0.88) / 1440 * 100).toFixed(2);
  const imagePhase = phase === "open" && !hasEnteredView ? "pre-open" : phase;

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const el = outerRef.current;
    const card = cardRef.current;

    if (filtered) {
      // phase 1: grey close (clip-path via closed var) — 600ms
      // phase 2 at 500ms: slide up + height collapse
      t1 = setTimeout(() => {
        if (card) {
          card.style.transition = `transform ${SLIDE_MS}ms ${EASE}`;
          card.style.transform = "translateY(-110%)";
        }
        if (el) {
          el.style.height = `${el.offsetHeight}px`;
          el.style.overflow = "hidden";
          requestAnimationFrame(() => {
            el.style.transition = `height ${SLIDE_MS}ms ${EASE}`;
            el.style.height = "0px";
          });
        }
      }, SLIDE_START_MS);
    } else {
      if (el && card && el.style.height === "0px") {
        // re-entry: was filtered, animate back in
        setReEntering(true);

        // measure natural height
        el.style.transition = "none";
        el.style.height = "auto";
        const naturalHeight = el.offsetHeight;
        el.style.height = "0px";

        // snap card to slid-up, no transition
        card.style.transition = "none";
        card.style.transform = "translateY(-110%)";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // expand height + slide down simultaneously
            el.style.transition = `height ${SLIDE_MS}ms ${EASE}`;
            el.style.height = `${naturalHeight}px`;
            card.style.transition = `transform ${SLIDE_MS}ms ${EASE}`;
            card.style.transform = "translateY(0)";

            // grey reveal 100ms after slide starts
            t2 = setTimeout(() => setReEntering(false), 100);
          });
        });

        // clean up imperative styles after animation
        t1 = setTimeout(() => {
          el.style.height = "";
          el.style.overflow = "";
          el.style.transition = "";
          card.style.transition = "";
          card.style.transform = "";
        }, SLIDE_MS + 200);
      } else {
        // not previously filtered — just reset
        if (card) {
          card.style.transition = "";
          card.style.transform = "";
        }
      }
    }

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [filtered]);

  useEffect(() => {
    const node = imageRef.current;
    const root = node?.closest(`.${styles.page}`);
    if (!node || !root) { setHasEnteredView(false); return; }
    const nodeRect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    setHasEnteredView(nodeRect.bottom > rootRect.top && nodeRect.top < rootRect.bottom);
  }, [resetKey]);

  useEffect(() => {
    if (phase !== "open") { setHasEnteredView(false); return; }
    const node = imageRef.current;
    if (!node) return;
    const root = node.closest(`.${styles.page}`);
    if (!root) return;

    // already in view — fire immediately, no async observer needed
    const nodeRect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    if (nodeRect.bottom > rootRect.top && nodeRect.top < rootRect.bottom) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasEnteredView(true); },
      { root, threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [phase]);

  const closed = filtered || reEntering || imagePhase === "pre-open";
  const clipPath = closed ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)";
  const imageTransition = filtered
    ? `clip-path ${CLOSE_MS}ms ${EASE}`
    : reEntering
      ? `clip-path ${CLOSE_MS}ms ${EASE}`
      : imagePhase === "open"
        ? `clip-path 800ms ${EASE} ${imageRevealDelayMs}ms, scale 800ms ${EASE} ${imageRevealDelayMs}ms`
        : "none";

  const exitStyle: CSSProperties = exitPhase === "hide"
    ? { opacity: 0, transition: "opacity 0ms linear 50ms" }
    : exitPhase === "fade"
    ? { opacity: 0, transition: `opacity 500ms ${EASE}` }
    : exitPhase === "slide-right"
    ? { transform: "translate(120vw, 20dvh) scale(0.6)", opacity: 0, transition: `transform 1000ms ${EASE} 50ms, opacity 1000ms ${EASE} 50ms` }
    : {};

  return (
    <div ref={outerRef} style={{ ...style, ...exitStyle }}>
      <div style={{ overflow: "hidden", ...revealStyle(phase) }}>
        <div
            ref={cardRef}
            className={styles.workCard}
            onMouseEnter={() => {
              setMode("view");
              setHoverRevealed(true);
            }}
            onMouseLeave={() => {
              setMode("default");
              setHoverRevealed(false);
            }}
          >
          <div
            ref={imageRef}
            className={styles.workCardImg}
            style={{ width: `${vw}vw`, aspectRatio: `${width} / ${height}` }}
          >
            {image && (
              <Image
                src={image}
                alt={title ?? ""}
                fill
                style={{
                  objectFit: "cover",
                  clipPath,
                  scale: imagePhase === "pre-open" ? "1.08" : "1",
                  transition: imageTransition,
                }}
              />
            )}
            {hoverImage && (
              <Image
                src={hoverImage}
                alt=""
                fill
                style={{
                  objectFit: "cover",
                  clipPath: hoverRevealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  scale: hoverRevealed ? "1" : "1.08",
                  transition: `clip-path 700ms cubic-bezier(0.37, 0, 0.13, 1), scale 700ms cubic-bezier(0.37, 0, 0.13, 1)`,
                }}
              />
            )}
          </div>
          <span className={styles.workCardTitle}>{title}</span>
          <span className={styles.workCardInfo}>{resolvedInfo}</span>
        </div>
      </div>
    </div>
  );
}
