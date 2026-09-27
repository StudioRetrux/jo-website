"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "@studio-freight/lenis";

type Props = {
  wrapperRef?: RefObject<HTMLDivElement | null>;
  contentRef?: RefObject<HTMLDivElement | null>;
};

/** Smooth wheel scrolling for both the detail overlay and direct detail routes. */
export default function ProjectSmoothScroll({ wrapperRef, contentRef }: Props) {
  useEffect(() => {
    // Match the main site sections: touch screens keep native scrolling.
    if (window.matchMedia("(max-width: 480px)").matches) return;

    const wrapper = wrapperRef?.current ?? window;
    const content = contentRef?.current ?? document.documentElement;
    const lenis = new Lenis({ wrapper, content, smoothWheel: true });
    let frame = 0;

    function loop(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    }

    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [wrapperRef, contentRef]);

  return null;
}
