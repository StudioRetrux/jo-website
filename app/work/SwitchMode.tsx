"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useCursor } from "../contexts/CursorContext";
import styles from "./work.module.css";

export type ImageSnapshot = {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  title: string;
  info: string;
};

type Rect = { x: number; y: number; width: number; height: number };

const TARGET_W = 256;
const TARGET_H = 170.67;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const DURATION = "1000ms";
const DURATION_MS = 1000;
const TEXT_DURATION = "700ms";
const TEXT_DURATION_MS = 700;
const CARD_GAP = 16;
const FOLLOW_EASE = 0.08;
const FOLLOW_BORDER = 60;
const FOLLOW_BOUNCE = 60;
const FOLLOW_BOUNCE_PULL = 0.4;
const FOLLOW_BOUNCE_DECAY = 0.9;
const COVER_DURATION_MS = 700;
const REVEAL_EASE = "cubic-bezier(0.37, 0, 0.13, 1)";
const LIST_ITEM_SELECTOR = "[data-work-list-item]";

type Mode = "idle" | "transition" | "follow";

type Props = {
  snapshot: ImageSnapshot | null;
  target: { x: number; y: number } | null;
  followImage?: string | null;
  followActive?: boolean;
  parkedImage?: string | null;
  followBoundsRef?: { current: HTMLDivElement | null };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function captureSnapshot(
  imageEl: HTMLDivElement | null,
  imageSrc: string | undefined,
  title: string,
  info: string,
): ImageSnapshot | null {
  if (!imageEl || !imageSrc) return null;
  const rect = imageEl.getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height, src: imageSrc, title, info };
}

export default function SwitchMode({ snapshot, target, followImage, followActive, parkedImage, followBoundsRef }: Props) {
  const { posRef } = useCursor();
  const elRef = useRef<HTMLDivElement>(null);
  const lerpPos = useRef({ x: 0, y: 0 });
  const lastTargetY = useRef<number | null>(null);
  const elasticY = useRef(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [rect, setRect] = useState<Rect | null>(null);
  const [animated, setAnimated] = useState(false);
  const [textGone, setTextGone] = useState(false);
  const [textMounted, setTextMounted] = useState(true);
  const [followShown, setFollowShown] = useState(false);
  const [followArmed, setFollowArmed] = useState(false);
  const [baseFollowImage, setBaseFollowImage] = useState<string | null>(null);
  const [incomingFollowImage, setIncomingFollowImage] = useState<string | null>(null);
  const [imgRevealed, setImgRevealed] = useState(false);
  const coverActive = useRef(false);
  const [contentClipPath, setContentClipPath] = useState("inset(0 0 0 0)");
  const [contentClipTransition, setContentClipTransition] = useState(true);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  function revealImage(src: string) {
    setIncomingFollowImage(src);
    setImgRevealed(false);
    let id1: number, id2: number;
    id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setImgRevealed(true));
    });
    const promoteTid = setTimeout(() => {
      setBaseFollowImage(src);
      setIncomingFollowImage(null);
    }, COVER_DURATION_MS);
    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2); clearTimeout(promoteTid); };
  }

  // transition → follow hand-off
  useEffect(() => {
    if (!snapshot || !target) {
      setMode("idle");
      setRect(null);
      setAnimated(false);
      setTextGone(false);
      setTextMounted(true);
      setFollowShown(false);
      setFollowArmed(false);
      setBaseFollowImage(null);
      setIncomingFollowImage(null);
      lastTargetY.current = null;
      elasticY.current = 0;
      coverActive.current = false;
      setContentClipTransition(true);
      setContentClipPath("inset(0 0 0 0)");
      return;
    }

    setMode("transition");
    setRect({ x: snapshot.x, y: snapshot.y, width: snapshot.width, height: snapshot.height });
    setAnimated(false);
    setTextGone(false);
    setTextMounted(true);
    setBaseFollowImage(null);
    setIncomingFollowImage(null);

    let id1: number, id2: number;
    const moveTid = setTimeout(() => {
      id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => {
          setRect({ x: target.x, y: target.y, width: TARGET_W, height: TARGET_H });
          setAnimated(true);
          setTextGone(true);
        });
      });
    }, 50);

    // after transition lands, switch element to follow mode
    const followTid = setTimeout(() => {
      lerpPos.current = { x: target.x, y: target.y };
      lastTargetY.current = target.y;
      elasticY.current = 0;
      coverActive.current = false;
      setBaseFollowImage(snapshot.src);
      setContentClipTransition(true);
      setContentClipPath("inset(0 0 0 0)");
      setFollowShown(true);
      setFollowArmed(false);
      setMode("follow");
    }, 50 + DURATION_MS + 100);

    return () => {
      clearTimeout(moveTid);
      clearTimeout(followTid);
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [snapshot, target, followBoundsRef]);

  // unmount text after animation
  useEffect(() => {
    if (!textGone) return;
    const id = setTimeout(() => setTextMounted(false), TEXT_DURATION_MS);
    return () => clearTimeout(id);
  }, [textGone]);

  useEffect(() => {
    if (mode !== "follow") return;

    if (followActive) {
      if (!followArmed) setFollowArmed(true);
      if (!coverActive.current) return;
      coverActive.current = false;
      setContentClipTransition(false);
      setContentClipPath("inset(0 100% 0 0)");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContentClipTransition(true);
          setContentClipPath("inset(0 0 0 0)");
        });
      });
      return;
    }

    if (!followArmed || coverActive.current) return;
    coverActive.current = true;
    setContentClipTransition(true);
    setContentClipPath("inset(0 100% 0 0)");
  }, [followActive, followArmed, mode]);

  useEffect(() => {
    if (mode !== "follow" || followArmed || !parkedImage || parkedImage === baseFollowImage) return;
    return revealImage(parkedImage);
  }, [baseFollowImage, followArmed, mode, parkedImage]);

  // follow image reveal animation
  useEffect(() => {
    if (mode !== "follow" || !followImage || followImage === baseFollowImage) return;
    return revealImage(followImage);
  }, [baseFollowImage, followImage, mode]);

  // follow mode RAF, clamped to the list rows plus a 60px border and elastic edge.
  useEffect(() => {
    if (mode !== "follow" || !followArmed) return;
    let frame: number;
    function tick() {
      const { x, y } = posRef.current;
      const targetX = x - TARGET_W / 2;
      const rawTargetY = y - TARGET_H / 2;
      let targetY = rawTargetY;
      let minY = -Infinity;
      let maxY = Infinity;
      let minElasticY = -Infinity;
      let maxElasticY = Infinity;
      const boundsEl = followBoundsRef?.current;
      const firstItem = boundsEl?.querySelector<HTMLElement>(LIST_ITEM_SELECTOR);
      const lastItem = boundsEl?.querySelector<HTMLElement>(`${LIST_ITEM_SELECTOR}:last-child`);
      const firstBounds = firstItem?.getBoundingClientRect();
      const lastBounds = lastItem?.getBoundingClientRect();

      if (firstBounds && lastBounds) {
        minY = firstBounds.top - FOLLOW_BORDER;
        maxY = Math.max(minY, lastBounds.bottom + FOLLOW_BORDER - TARGET_H);
        minElasticY = minY - FOLLOW_BOUNCE;
        maxElasticY = maxY + FOLLOW_BOUNCE;
        const previousTargetY = lastTargetY.current ?? rawTargetY;
        const velocityY = rawTargetY - previousTargetY;

        if (rawTargetY < minY) {
          elasticY.current = Math.max(-FOLLOW_BOUNCE, Math.min(elasticY.current, 0) + Math.min(velocityY, 0) * FOLLOW_BOUNCE_PULL);
          elasticY.current *= FOLLOW_BOUNCE_DECAY;
          if (Math.abs(elasticY.current) < 0.1) elasticY.current = 0;
          targetY = minY + elasticY.current;
        } else if (rawTargetY > maxY) {
          elasticY.current = Math.min(FOLLOW_BOUNCE, Math.max(elasticY.current, 0) + Math.max(velocityY, 0) * FOLLOW_BOUNCE_PULL);
          elasticY.current *= FOLLOW_BOUNCE_DECAY;
          if (Math.abs(elasticY.current) < 0.1) elasticY.current = 0;
          targetY = maxY + elasticY.current;
        } else {
          elasticY.current = 0;
          targetY = rawTargetY;
        }
      }
      lastTargetY.current = rawTargetY;

      lerpPos.current.x += (targetX - lerpPos.current.x) * FOLLOW_EASE;
      lerpPos.current.y += (targetY - lerpPos.current.y) * FOLLOW_EASE;
      lerpPos.current.y = clamp(lerpPos.current.y, minElasticY, maxElasticY);
      const el = elRef.current;
      if (el) {
        el.style.transform = `translate3d(${lerpPos.current.x}px, ${lerpPos.current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, followArmed, posRef, followBoundsRef]);

  if (mode === "idle") return null;

  const src = mode === "follow" ? (baseFollowImage ?? snapshot?.src ?? "") : (snapshot?.src ?? "");

  const node = (
    <div
      ref={elRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: mode === "follow" ? TARGET_W : (rect?.width ?? TARGET_W),
        height: mode === "follow" ? TARGET_H : (rect?.height ?? TARGET_H),
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "visible",
        willChange: "transform",
        opacity: mode === "follow" ? (followShown ? 1 : 0) : 1,
        transform: mode === "follow"
          ? `translate3d(${lerpPos.current.x}px, ${lerpPos.current.y}px, 0)`
          : `translate3d(${rect?.x ?? 0}px, ${rect?.y ?? 0}px, 0)`,
        transition: mode === "follow"
          ? "opacity 300ms ease"
          : animated
            ? `transform ${DURATION} ${EASE}, width ${DURATION} ${EASE}, height ${DURATION} ${EASE}`
            : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          overflow: "hidden",
          clipPath: contentClipPath,
          transition: contentClipTransition ? `clip-path ${COVER_DURATION_MS}ms ${REVEAL_EASE}` : "none",
        }}
      >
        {src && <Image src={src} alt="" fill style={{ objectFit: "cover" }} />}
        {incomingFollowImage && (
          <Image
            key={incomingFollowImage}
            src={incomingFollowImage}
            alt=""
            fill
            style={{
              objectFit: "cover",
              clipPath: imgRevealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              scale: imgRevealed ? "1" : "1.08",
              transition: imgRevealed ? `clip-path ${COVER_DURATION_MS}ms ${REVEAL_EASE}, scale ${COVER_DURATION_MS}ms ${REVEAL_EASE}` : "none",
            }}
          />
        )}
      </div>
      </div>

      {textMounted && mode !== "follow" && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            paddingTop: CARD_GAP,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            transform: textGone ? "translateY(-150px)" : "translateY(0)",
            opacity: textGone ? 0 : 1,
            transition: `transform ${TEXT_DURATION} ${EASE}, opacity ${TEXT_DURATION} ${EASE}`,
          }}
        >
          <span className={styles.workCardTitle}>{snapshot?.title}</span>
          <span className={styles.workCardInfo}>{snapshot?.info}</span>
        </div>
      )}
    </div>
  );

  return portalReady ? createPortal(node, document.body) : null;
}
