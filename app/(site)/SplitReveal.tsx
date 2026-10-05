"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

/*
 * kononenkogroup.com's text reveal, 1:1 — their v-splittext + v-linereveal directives.
 * GSAP SplitText cuts the text into masked lines/words/chars; each piece rises from
 * yPercent 101 inside its mask. Timing is their golden-ratio scale (0.1 * φ^(step-1)):
 * duration step 6 = 1.109s, stagger step 1 = 0.1s, chars step 2 minus step 1 = 0.062s.
 * Mask styles live in globals.css (.ln-mask / .ch-mask / .e-lh).
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, CustomEase);
  CustomEase.create("reveal", "0.17, 0.84, 0.44, 1");
}

const DURATION = 1.109;
const STAGGER = { lines: 0.1, words: 0.1, chars: 0.062 };
// chars mask themselves: a line split would be cut before a parent fits its font-size
// (the wordmarks), and the letters all share a baseline, so it reads the same
const SPLIT = {
  lines: { type: "lines", mask: "lines" },
  words: { type: "lines,words", mask: "lines" },
  chars: { type: "words,chars", mask: "chars" },
} as const;

type Props = {
  children: ReactNode;
  /** false hides instantly (panel closed), true plays the reveal */
  play: boolean;
  type?: keyof typeof SPLIT;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** seconds */
  delay?: number;
  /** their `dynamic` option: shrink the stagger as the char count grows */
  dynamic?: boolean;
};

/** line-height as a multiple of font-size, null when "normal" — their YU() */
function lineHeightRatio(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const fontSize = parseFloat(cs.fontSize);
  const lh = parseFloat(cs.lineHeight);
  if (cs.lineHeight === "normal" || !fontSize || !lh) return null;
  return cs.lineHeight.endsWith("px") ? lh / fontSize : lh;
}

/**
 * SplitText takes over the DOM inside `as` — React can't update that text afterwards.
 * When the children change, change the `key` so it re-mounts and re-splits.
 */
export default function SplitReveal({
  children, play, type = "lines", as: Tag = "div", className, style, delay = 0, dynamic,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const playRef = useRef(play);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let split: SplitText | null = null;
    let cancelled = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // fonts first, or the line breaks are measured against the fallback face; then a
    // frame, so anything else waiting on fonts (the wordmarks' font-size fit) lands first
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      if (cancelled) return;
      split = SplitText.create(el, {
        ...SPLIT[type],
        tag: "span",
        linesClass: "ln",
        wordsClass: "wd",
        charsClass: "ch",
        smartWrap: true,
        autoSplit: true,
        onSplit(self) {
          const ratio = lineHeightRatio(el);
          el.classList.toggle("e-lh", ratio !== null && ratio < 1);
          const stagger = dynamic
            ? STAGGER.chars / Math.log2(self.chars.length + 2)
            : STAGGER[type];
          const tween = gsap.from(self[type], {
            yPercent: 101,
            duration: reduced ? 0 : DURATION,
            stagger: reduced ? 0 : stagger,
            ease: "reveal",
            delay,
            paused: !playRef.current,
          });
          tweenRef.current = tween;
          // returned so a resize re-split carries the tween's progress across
          return tween;
        },
      });
    }));

    return () => {
      cancelled = true;
      split?.revert();
      tweenRef.current = null;
    };
  }, [type, delay, dynamic]);

  useEffect(() => {
    playRef.current = play;
    const tween = tweenRef.current;
    if (!tween) return; // not split yet — onSplit reads playRef
    if (play) tween.play();
    else tween.pause(0);
  }, [play]);

  return <Tag ref={ref} className={className} style={style}>{children}</Tag>;
}
