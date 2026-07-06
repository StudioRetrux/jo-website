"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Header from "../home/Header";
import MegaMenu from "../megamenu/MegaMenu";
import { usePageNav, SLIDE_DURATION, SLIDE_EASE, type Page } from "../contexts/PageNavContext";
import FooterMenuText from "./FooterMenuText";
import TitleArea from "./TitleArea";
import WorkCard from "./WorkCard";
import WorkListItem from "./WorkListItem";
import WorkSpacer from "./WorkSpacer";
import SwitchMode, { captureSnapshot, type ImageSnapshot } from "./SwitchMode";
import styles from "./work.module.css";
import type { WorkItem } from "@/lib/projects/types";

// Repeating 7-slot collage template. Work N uses slot N % 7; every full group
// of 7 stacks below the previous one as a new "section".
type GridSlot = {
  width: number;
  height: number;
  row?: boolean;
  marginLeft?: string;
  marginTop?: string;
  imageRevealDelayMs?: number;
};

const GRID_SLOTS: GridSlot[] = [
  { width: 646, height: 440, row: true, imageRevealDelayMs: 500 },
  { width: 352, height: 241, row: true, imageRevealDelayMs: 500 },
  { width: 410, height: 280, marginLeft: "36%", marginTop: "256px" },
  { width: 624, height: 426, marginLeft: "4%", marginTop: "256px" },
  { width: 352, height: 241, marginLeft: "auto", marginTop: "72px" },
  { width: 410, height: 280, marginLeft: "8%", marginTop: "120px" },
  { width: 626, height: 427, marginLeft: "auto", marginTop: "240px" },
];
const SECTION_GAP = "256px";

const FULL_NAME = "Yohanes Alexander";
const FOOTER_MENU_ITEMS = ["Work", "About", "Curated Spaces", "Contact"];
const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "WhatsApp", href: "https://wa.me" },
  { label: "TikTok", href: "https://tiktok.com" },
];

type Phase = "closed" | "pre-open" | "open";
type Props = {
  works: WorkItem[];
  open: boolean;
  slidePage?: boolean;
  homeNavigation?: "state" | "route";
  zIndex?: number;
};

export default function WorkSection({ works, open, slidePage = true, homeNavigation = "state", zIndex }: Props) {
  const { navigateTo } = usePageNav();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("closed");
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [switchSnapshot, setSwitchSnapshot] = useState<ImageSnapshot | null>(null);
  const [switchTarget, setSwitchTarget] = useState<{ x: number; y: number } | null>(null);
  const [gridExiting, setGridExiting] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const cardImageEls = useRef(new Map<string, HTMLDivElement>());
  const handleCardImageEl = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardImageEls.current.set(id, el);
      return;
    }
    cardImageEls.current.delete(id);
  }, []);
  const workContentRef = useRef<HTMLDivElement | null>(null);
  const firstVisibleCard = useCallback(
    () => works.find((c) => activeFilter === "All" || c.category === activeFilter),
    [works, activeFilter],
  );

  function handleNavigate(item: string) {
    if (homeNavigation === "route") {
      if (item === "Home") { window.location.assign("/"); return; }
      if (item === "About") { window.location.assign("/about"); return; }
      if (item === "Curated Spaces") { window.location.assign("/curratedspaces"); return; }
      setMenuOpen(false);
      return;
    }
    const pageMap: Record<string, Page> = { Home: "home", Work: "work", About: "about", "Curated Spaces": "curratedspaces" };
    const page = pageMap[item];
    if (page) {
      navigateTo(page);
      setTimeout(() => setMenuOpen(false), SLIDE_DURATION);
    } else {
      setMenuOpen(false);
    }
  }

  function handleFilterChange(filter: string) {
    setActiveFilter(filter);
  }

  function handleViewModeChange(mode: "grid" | "list") {
    if (mode === "list" && viewMode === "grid") {
      const topCard = firstVisibleCard();
      const title = topCard?.title ?? "";
      const info = [topCard?.category, topCard?.year].filter(Boolean).join(" • ");
      const snapshot = captureSnapshot(topCard ? cardImageEls.current.get(topCard.id) ?? null : null, topCard?.image, title, info);
      if (snapshot) {
        setSwitchSnapshot(snapshot);
        const contentRect = workContentRef.current?.getBoundingClientRect();
        const listItemCenterY = contentRect ? contentRect.top + 24 + 46 : snapshot.y;
        setSwitchTarget({
          x: window.innerWidth / 2 - 105 + window.innerWidth * 0.08,
          y: listItemCenterY - 70,
        });
      }
      setGridExiting(true);
      setTimeout(() => { setViewMode("list"); setGridExiting(false); }, 500);
    }
    if (mode === "grid" && viewMode === "list") {
      setTimeout(() => setSwitchSnapshot(null), 1000);
      setViewMode("grid");
    }
  }
  const [fullnameEnteredView, setFullnameEnteredView] = useState(false);
  const [scrollResetKey, setScrollResetKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fullnameRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const hasScrolledAwayFromTop = useRef(false);

  useEffect(() => { setMounted(true); }, []);


  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const container = fullnameRef.current;
    if (!wordmark || !container) return;

    const fit = () => {
      const available = wordmark.clientWidth;
      wordmark.style.fontSize = "100px";
      wordmark.style.width = "max-content";
      const textWidth = wordmark.offsetWidth;
      wordmark.style.width = "";
      wordmark.style.fontSize = `${(available / textWidth) * 100 * 0.98}px`;
    };

    const observer = new ResizeObserver(fit);
    observer.observe(container);
    document.fonts.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      setPhase("pre-open");
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setPhase("open"))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setPhase("closed");
      setFullnameEnteredView(false);
    }
  }, [open]);

  useEffect(() => {
    setFullnameEnteredView(false);
  }, [scrollResetKey]);

  useEffect(() => {
    if (phase !== "open") {
      setFullnameEnteredView(false);
      return;
    }

    const node = fullnameRef.current;
    const root = wrapperRef.current;
    if (!node || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFullnameEnteredView(true);
        }
      },
      { root, threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    const wrapper = wrapperRef.current;
    const lenis = new Lenis({
      wrapper,
      content: contentRef.current,
      smoothWheel: true,
    });
    function handleScroll() {
      if (wrapper.scrollTop <= 0) {
        if (hasScrolledAwayFromTop.current) {
          hasScrolledAwayFromTop.current = false;
          setScrollResetKey((value) => value + 1);
        }
        return;
      }

      hasScrolledAwayFromTop.current = true;
    }

    let raf: number;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.page}
      style={{
        zIndex: zIndex,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: mounted && slidePage ? `transform ${SLIDE_DURATION}ms ${SLIDE_EASE}` : "none",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} />
      <Header
        isHome={true}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        style={{ "--header-fg": "#59534c", transition: "none" } as React.CSSProperties}
        navLabel="home / work"
        homeNavigation={homeNavigation}
      />
      <div ref={contentRef}>
        <TitleArea phase={phase} categories={[...new Set(works.map((w) => w.category))].sort()} activeFilter={activeFilter} onFilterChange={handleFilterChange} viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        <div className={styles.workContent} ref={workContentRef}>
          {viewMode === "list" && (
            <div
              className={styles.workListTopBorder}
              aria-hidden="true"
              style={{
                animation: `listItemEnter 500ms cubic-bezier(0.37, 0, 0.63, 1) ${Math.max(works.findIndex((card) => activeFilter === "All" || card.category === activeFilter), 0) * 40}ms both`,
              }}
            />
          )}
          {viewMode === "list" ? (
            (() => {
              return works.map((card, index) => (
                <WorkListItem
                  key={card.id}
                  title={card.title}
                  category={card.category}
                  year={card.year}
                  filtered={activeFilter !== "All" && card.category !== activeFilter}
                  dimmed={hoveredItemId !== null && hoveredItemId !== card.id}

                  enterDelay={index * 40}
                  onHoverIn={() => setHoveredItemId(card.id)}
                  onHoverOut={() => setHoveredItemId(null)}
                />
              ));
            })()
          ) : (
            (() => {
              const switchCardId = firstVisibleCard()?.id;
              const isFiltered = (card: WorkItem) =>
                activeFilter !== "All" && card.category !== activeFilter;
              const exitFor = (card: WorkItem) =>
                gridExiting ? (card.id === switchCardId ? "hide" : "slide-right") : undefined;

              const chunks: WorkItem[][] = [];
              for (let i = 0; i < works.length; i += GRID_SLOTS.length) {
                chunks.push(works.slice(i, i + GRID_SLOTS.length));
              }

              return chunks.map((chunk, chunkIndex) => {
                const paired = chunk.map((card, index) => ({
                  card,
                  slot: GRID_SLOTS[index],
                }));
                const rowPairs = paired.filter(({ slot }) => slot.row);
                const nonRowPairs = paired.filter(({ slot }) => !slot.row);
                const rowFiltered =
                  rowPairs.length > 0 && rowPairs.every(({ card }) => isFiltered(card));

                return (
                  <React.Fragment key={chunk[0].id}>
                    {chunkIndex > 0 && (
                      <WorkSpacer
                        height={SECTION_GAP}
                        collapsed={chunk.every((card) => isFiltered(card))}
                      />
                    )}
                    {rowPairs.length > 0 && (
                      <div className={styles.workRow}>
                        {rowPairs.map(({ card, slot }) => (
                          <WorkCard
                            key={card.id}
                            width={slot.width}
                            height={slot.height}
                            title={card.title}
                            category={card.category}
                            year={card.year}
                            image={card.image}
                            hoverImage={card.hoverImage}
                            imageRevealDelayMs={slot.imageRevealDelayMs}
                            phase={phase}
                            filtered={isFiltered(card)}
                            resetKey={scrollResetKey}
                            onImageEl={(el) => handleCardImageEl(card.id, el)}
                            exitPhase={exitFor(card)}
                          />
                        ))}
                      </div>
                    )}
                    {nonRowPairs[0]?.slot.marginTop && (
                      <WorkSpacer height={nonRowPairs[0].slot.marginTop} collapsed={rowFiltered} />
                    )}
                    {nonRowPairs.map(({ card, slot }, index) => {
                      const cardFiltered = isFiltered(card);
                      const nextPair = nonRowPairs[index + 1];
                      return (
                        <React.Fragment key={card.id}>
                          <WorkCard
                            width={slot.width}
                            height={slot.height}
                            title={card.title}
                            category={card.category}
                            year={card.year}
                            image={card.image}
                            hoverImage={card.hoverImage}
                            style={{ marginLeft: slot.marginLeft }}
                            phase={phase}
                            filtered={cardFiltered}
                            resetKey={scrollResetKey}
                            onImageEl={(el) => handleCardImageEl(card.id, el)}
                            exitPhase={exitFor(card)}
                          />
                          {nextPair?.slot.marginTop && (
                            <WorkSpacer height={nextPair.slot.marginTop} collapsed={cardFiltered} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              });
            })()
          )}
        </div>
        <div ref={fullnameRef} className={styles.fullname}>
          <div ref={wordmarkRef} className={styles.workWordmark} aria-label={FULL_NAME}>
            {FULL_NAME.split("").map((letter, index) => (
              <span
                aria-hidden="true"
                className={styles.workWordmarkLetter}
                key={`${letter}-${index}`}
                style={{
                  transform: fullnameEnteredView ? "translateY(0)" : "translateY(115%)",
                  transition: fullnameEnteredView
                    ? `transform 800ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 20}ms`
                    : "none",
                }}
              >
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </div>
        </div>
        <footer className={styles.workFooter}>
          <div className={`${styles.workFooterColumn} ${styles.workFooterLeft}`}>
            <span className={styles.workFooterMenuLabel}>(MENU)</span>
            <nav className={styles.workFooterMenu}>
              {FOOTER_MENU_ITEMS.map((item) => (
                <FooterMenuText
                  key={item}
                  text={item}
                />
              ))}
            </nav>
          </div>
          <div className={`${styles.workFooterColumn} ${styles.workFooterRight}`}>
            <div className={styles.footerInfo}>
              <div className={styles.footerInfoTitleRow}>
                <span className={styles.footerInfoTitle}>GET IN TOUCH</span>
              </div>
              <div className={styles.footerInfoItems}>
                <a className={styles.footerInfoLink} href="mailto:hello@yohanes.alexander">
                  hello@yohanes.alexander
                </a>
                <a className={styles.footerInfoLink} href="tel:+6283453294234">
                  +62 83453294234
                </a>
              </div>
              <div className={styles.footerInfoGroup}>
                <div className={styles.footerInfoTitleRow}>
                  <span className={styles.footerInfoTitle}>SOCIALS</span>
                </div>
                <div className={styles.footerInfoItems}>
                  {SOCIAL_ITEMS.map((item) => (
                    <a className={styles.footerInfoLink} href={item.href} key={item.label}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.footerInfo}>
              <div className={styles.footerInfoTitleRow}>
                <span className={styles.footerInfoTitle}>OFFICE</span>
              </div>
              <div className={styles.footerInfoItems}>
                <p className={styles.footerOfficeText}>
                  Menara Palma, Jl.<br />
                  Sudirman no 12 , 123567
                </p>
              </div>
            </div>
          </div>
        </footer>
        <div className={styles.workRibbon}>
          <div className={styles.workRibbonInner}>
            <div className={styles.workRibbonLeft}>
              <a href="/terms" className={`${styles.workRibbonLink} ${styles.workRibbonLinkPadded}`}>
                Terms of Use
              </a>
              <a href="/privacy" className={styles.workRibbonLink}>Privacy Policy</a>
            </div>
            <span className={styles.workRibbonCopyright}>© 2026. Yohanes Alexander</span>
          </div>
        </div>
      </div>
      <SwitchMode
        snapshot={switchSnapshot}
        target={switchTarget}
        followImage={works.find(c => c.id === hoveredItemId)?.image}
        followActive={hoveredItemId !== null}
        parkedImage={viewMode === "list" && hoveredItemId === null ? firstVisibleCard()?.image : null}
        followBoundsRef={workContentRef}
      />
    </div>
  );
}
