"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HomeCarousel from "./HomeCarousel";
import Header from "./Header";
import MegaMenu from "../megamenu/MegaMenu";
import RightPanel, { CarouselPhase, UNLOCK_MS, MAX_EXIT_MS } from "./RightPanel";
import type { ResolvedHomeSlide } from "@/lib/projects/home-shared";
import type { WorkItem } from "@/lib/projects/types";
import AboutSection from "../about/AboutSection";
import WorkSection from "../work/WorkSection";
import CurratedSpacesSection from "../curratedspaces/CurratedSpacesSection";
import ContactSection from "../contact/ContactSection";
import { usePageNav, SLIDE_DURATION, SLIDE_EASE, type Page } from "../contexts/PageNavContext";

const REVEAL_MS = 700;
const REVEAL_EASE = "cubic-bezier(0.4, 0, 0.5, 1)";
const REVEAL_TRANSITION = `clip-path ${REVEAL_MS}ms ${REVEAL_EASE}, scale ${REVEAL_MS}ms ${REVEAL_EASE}`;

type Props = {
  slides: ResolvedHomeSlide[];
  works: WorkItem[];
  carouselReady: boolean;
  preloading?: boolean;
};

export default function HomeSection({ slides, works, carouselReady, preloading = false }: Props) {
  const { activePage, incomingPage, navigateTo } = usePageNav();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [carouselCurrent, setCarouselCurrent] = useState(0);
  const [carouselIncoming, setCarouselIncoming] = useState<number | null>(null);
  const [carouselRevealing, setCarouselRevealing] = useState(false);
  const [carouselPhase, setCarouselPhase] = useState<CarouselPhase>("idle");
  const [carouselDirection, setCarouselDirection] = useState<"down" | "up">("down");
  const carouselLocked = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const carouselAdvance = useCallback((dir: "down" | "up") => {
    if (carouselLocked.current) return;
    const next = dir === "down"
      ? Math.min(carouselCurrent + 1, slides.length - 1)
      : Math.max(carouselCurrent - 1, 0);
    if (next === carouselCurrent) return;
    carouselLocked.current = true;
    setCarouselDirection(dir);
    setCarouselIncoming(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCarouselRevealing(true);
        setCarouselPhase("exiting");
        setTimeout(() => setCarouselPhase("entering"), MAX_EXIT_MS);
        setTimeout(() => {
          setCarouselCurrent(next);
          setCarouselIncoming(null);
          setCarouselRevealing(false);
          setCarouselPhase("idle");
          carouselLocked.current = false;
        }, UNLOCK_MS);
      });
    });
  }, [carouselCurrent, slides.length]);

  function handleNavigate(item: string) {
    const pageMap: Record<string, Page> = { Home: "home", Work: "work", About: "about", "Curated Spaces": "curratedspaces", Contact: "contact" };
    const page = pageMap[item];
    if (page) {
      navigateTo(page);
      setTimeout(() => setMenuOpen(false), SLIDE_DURATION);
    } else {
      setMenuOpen(false);
    }
  }

  const homeOpen = activePage === "home" || incomingPage === "home";
  const homeIncoming = incomingPage === "home";

  return (
    <>
      <WorkSection
        works={works}
        open={activePage === "work" || incomingPage === "work"}
        slidePage={incomingPage === "work"}
        zIndex={incomingPage === "work" ? 13 : undefined}
      />
      <AboutSection
        open={activePage === "about" || incomingPage === "about"}
        slidePage={incomingPage === "about"}
        zIndex={incomingPage === "about" ? 13 : undefined}
      />
      <CurratedSpacesSection
        open={activePage === "curratedspaces" || incomingPage === "curratedspaces"}
        slidePage={incomingPage === "curratedspaces"}
        zIndex={incomingPage === "curratedspaces" ? 13 : undefined}
      />
      <ContactSection
        open={activePage === "contact" || incomingPage === "contact"}
        slidePage={incomingPage === "contact"}
        zIndex={incomingPage === "contact" ? 13 : undefined}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: preloading ? "transparent" : "#f7f6f5",
          zIndex: preloading ? 21 : (homeIncoming ? 13 : 12),
          transform: homeOpen ? "translateY(0)" : "translateY(100%)",
          transition: visible && homeIncoming ? `transform ${SLIDE_DURATION}ms ${SLIDE_EASE}` : "none",
        }}
      >
        <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} />
        <Header isHome={visible} onMenuToggle={() => setMenuOpen((v) => !v)} />
        {carouselReady && (
          <HomeCarousel
            slides={slides.map((slide) => slide.background)}
            current={carouselCurrent}
            incoming={carouselIncoming}
            revealing={carouselRevealing}
            revealTransition={REVEAL_TRANSITION}
            direction={carouselDirection}
            onAdvance={carouselAdvance}
          />
        )}
        <RightPanel
          slides={slides}
          isHome={visible}
          carouselCurrent={carouselCurrent}
          carouselIncoming={carouselIncoming}
          carouselPhase={carouselPhase}
          carouselDirection={carouselDirection}
          carouselRevealing={carouselRevealing}
          revealTransition={REVEAL_TRANSITION}
        />
      </div>
    </>
  );
}
