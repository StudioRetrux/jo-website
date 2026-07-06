"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import MegaMenuText from "./MegaMenuText";
import styles from "./megamenu.module.css";
import headerStyles from "../home/home.module.css";
type Props = { open: boolean; onClose: () => void; onNavigate?: (item: string) => void };

const EASE = "700ms cubic-bezier(0.9, 0, 0.5, 1)";
const FADE_UP_OPEN = "opacity 900ms cubic-bezier(0.4, 0, 0.2, 1) 450ms, transform 900ms cubic-bezier(0.4, 0, 0.2, 1) 450ms";
const MENU_ITEMS = ["Home", "Work", "About", "Curated Spaces", "Contact"];
const DEFAULT_MENU_IMAGE = "/preload4ld.png";
const MENU_IMAGES = ["/preload4ld.png", "/preload1.webp", "/profilepic.png", "/preload3.png", "/preload4.png"];
const THUMB_TRANSITION_MS = 600;
const THUMB_SWITCH_CLOSE_MS = 320;

export default function MegaMenu({ open, onClose, onNavigate }: Props) {
  const [phase, setPhase] = useState<"closed" | "pre-open" | "open">("closed");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [thumbOpening, setThumbOpening] = useState(false);
  const [thumbClosing, setThumbClosing] = useState(false);
  const [thumbTransitionMs, setThumbTransitionMs] = useState(THUMB_TRANSITION_MS);
  const activeIndexRef = useRef(-1);
  const thumbClosingRef = useRef(false);
  const pendingIndexRef = useRef<number | null>(null);
  const thumbCloseTimer = useRef<number | null>(null);
  const thumbOpenFrame = useRef(0);

  useEffect(() => {
    if (open) {
      setPhase("pre-open");
      if (thumbCloseTimer.current) window.clearTimeout(thumbCloseTimer.current);
      cancelAnimationFrame(thumbOpenFrame.current);
      activeIndexRef.current = -1;
      thumbClosingRef.current = false;
      pendingIndexRef.current = null;
      setActiveIndex(-1);
      setHoveredIndex(-1);
      setThumbOpening(false);
      setThumbClosing(false);
      setThumbTransitionMs(THUMB_TRANSITION_MS);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setPhase("open"))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setPhase("closed");
    }
  }, [open]);

  function openThumb(index: number) {
    if (thumbCloseTimer.current) window.clearTimeout(thumbCloseTimer.current);
    cancelAnimationFrame(thumbOpenFrame.current);
    activeIndexRef.current = index;
    thumbClosingRef.current = false;
    setThumbOpening(true);
    setThumbClosing(false);
    setThumbTransitionMs(THUMB_TRANSITION_MS);
    setActiveIndex(index);
    thumbOpenFrame.current = requestAnimationFrame(() => {
      thumbOpenFrame.current = requestAnimationFrame(() => setThumbOpening(false));
    });
  }

  function closeThumb(duration = THUMB_TRANSITION_MS) {
    if (activeIndexRef.current === -1 || thumbClosingRef.current) return;

    if (thumbCloseTimer.current) window.clearTimeout(thumbCloseTimer.current);
    cancelAnimationFrame(thumbOpenFrame.current);
    thumbClosingRef.current = true;
    setThumbTransitionMs(duration);
    setThumbOpening(false);
    setThumbClosing(true);
    thumbCloseTimer.current = window.setTimeout(completeThumbClose, duration + 100);
  }

  function completeThumbClose() {
    if (!thumbClosingRef.current) return;

    if (thumbCloseTimer.current) window.clearTimeout(thumbCloseTimer.current);

    const nextIndex = pendingIndexRef.current;

    pendingIndexRef.current = null;
    thumbClosingRef.current = false;
    setThumbClosing(false);

    if (nextIndex === null) {
      activeIndexRef.current = -1;
      setActiveIndex(-1);
    } else {
      openThumb(nextIndex);
    }

    thumbCloseTimer.current = null;
  }

  function showThumb(index: number) {
    if (activeIndexRef.current === -1 && !thumbClosingRef.current) {
      openThumb(index);
      return;
    }

    if (activeIndexRef.current === index && !thumbClosingRef.current) {
      pendingIndexRef.current = null;
      return;
    }

    pendingIndexRef.current = index;
    closeThumb(THUMB_SWITCH_CLOSE_MS);
  }

  function hideThumb() {
    pendingIndexRef.current = null;
    closeThumb();
  }

  const fadeUp =
    phase === "open"
      ? { opacity: 1, transform: "translateY(0)", transition: FADE_UP_OPEN }
      : { opacity: phase === "pre-open" ? 0 : 1, transform: phase === "pre-open" ? "translateY(100px)" : "translateY(0)", transition: "none" };

  const navReveal = (index: number): React.CSSProperties => ({
    display: "block",
    transform: phase === "pre-open" ? "translateY(110%)" : "translateY(0)",
    transition: phase === "open"
      ? `transform 700ms cubic-bezier(0.4, 0, 0.2, 1) ${450 + index * 60}ms`
      : "none",
  });

  return (
    <div
      className={styles.megaMenu}
      style={{
        clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 700ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className={styles.megaMenuHeader}>
        <div className={headerStyles.headerLeft}>
          <button type="button" className={headerStyles.hamburger} aria-label="Close menu" onClick={onClose}>
            <span style={{ transform: "translateY(4.5px) rotate(45deg)", transition: `transform ${EASE}` }} />
            <span style={{ transform: "translateY(-4.5px) rotate(-45deg)", transition: `transform ${EASE}` }} />
          </button>
          <span className={headerStyles.headerLogo}>Yohanes Alexander</span>
        </div>
        <div className={headerStyles.headerRight}>
          <span className={headerStyles.headerLocation}>Jakarta, Indonesia</span>
          <a href="mailto:hello@yohanes.alexander" className={headerStyles.headerEmail}>
            hello@yohanes.alexander
          </a>
        </div>
      </div>
      <div className={styles.megaMenuBody}>
        <div className={styles.megaMenuLeft}>
          <nav className={styles.megaMenuNav}>
            {MENU_ITEMS.map((item, i) => (
              <div
                key={item}
                className={styles.megaMenuNavItemWrap}
                style={{
                  opacity: hoveredIndex === -1 || hoveredIndex === i ? 1 : 0.6,
                  transition: "opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <MegaMenuText
                  text={item}
                  style={navReveal(i)}
                  onMouseEnter={() => { showThumb(i); setHoveredIndex(i); }}
                  onMouseLeave={() => { hideThumb(); setHoveredIndex(-1); }}
                  onClick={() => onNavigate?.(item)}
                  active={false}
                />
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.megaMenuRight} style={fadeUp}>
          <div className={styles.megaMenuThumb}>
            <Image className={styles.megaMenuThumbImage} src={DEFAULT_MENU_IMAGE} alt="" fill sizes="50vw" />
            {activeIndex >= 0 && (
              <Image
                key={MENU_IMAGES[activeIndex]}
                className={styles.megaMenuThumbImageReveal}
                src={MENU_IMAGES[activeIndex]}
                alt=""
                fill
                sizes="50vw"
                style={{
                  clipPath: `inset(0 ${thumbOpening || thumbClosing ? "100%" : "0%"} 0 0)`,
                  scale: thumbOpening || thumbClosing ? "1.08" : "1",
                  transition: `clip-path ${thumbTransitionMs}ms cubic-bezier(0.37, 0, 0.63, 1), scale ${thumbTransitionMs}ms cubic-bezier(0.37, 0, 0.63, 1)`,
                } as React.CSSProperties}
                onTransitionEnd={(event) => {
                  if (event.propertyName === "clip-path") completeThumbClose();
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.megaMenuFooter} style={fadeUp}>
        <div className={headerStyles.headerLeft}>
          <a href="https://instagram.com" className={styles.megaMenuLink}>Instagram</a>
          <a href="https://linkedin.com" className={styles.megaMenuLink}>LinkedIn</a>
          <a href="https://wa.me" className={styles.megaMenuLink}>WhatsApp</a>
          <a href="https://tiktok.com" className={styles.megaMenuLink}>TikTok</a>
        </div>
        <div className={headerStyles.headerRight}>
          <div className={styles.megaMenuFooterPolicies}>
            <a href="/terms" className={styles.megaMenuLink}>Terms of Use</a>
            <a href="/privacy" className={styles.megaMenuLink}>Privacy Policy</a>
          </div>
          <span className={headerStyles.headerLocation}>© 2026. Yohanes Alexander</span>
        </div>
      </div>
    </div>
  );
}
