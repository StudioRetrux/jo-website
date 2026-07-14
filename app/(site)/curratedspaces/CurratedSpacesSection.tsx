"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Image from "next/image";
import Header from "../home/Header";
import MegaMenu from "../megamenu/MegaMenu";
import FullnameBlock from "../about/FullnameBlock";
import FooterMenuText from "../work/FooterMenuText";
import { usePageNav, SLIDE_DURATION, SLIDE_EASE, type Page } from "../contexts/PageNavContext";
import { DEFAULT_CURATED_SPACE_ITEMS, type CuratedSpaceItem } from "@/lib/projects/curated-shared";
import workStyles from "../work/work.module.css";
import styles from "./curratedspaces.module.css";

const FOOTER_MENU_ITEMS = ["Work", "About", "Curated Spaces", "Contact"];
const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "WhatsApp", href: "https://wa.me" },
  { label: "TikTok", href: "https://tiktok.com" },
];

type Props = {
  open: boolean;
  slidePage?: boolean;
  homeNavigation?: "state" | "route";
  zIndex?: number;
  items?: CuratedSpaceItem[];
};

export default function CurratedSpacesSection({ open, slidePage = true, homeNavigation = "state", zIndex, items = DEFAULT_CURATED_SPACE_ITEMS }: Props) {
  const { navigateTo } = usePageNav();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerWordmarkInView, setFooterWordmarkInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerWordmarkRef = useRef<HTMLDivElement>(null);
  const [emblaRef] = useEmblaCarousel(
    // align start: default "center" translates the track on init (mount blink)
    { loop: true, dragFree: true, align: "start" },
    [WheelGesturesPlugin()],
  );

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) {
      setFooterWordmarkInView(false);
      return;
    }
    const node = footerWordmarkRef.current;
    const root = wrapperRef.current;
    if (!node || !root) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFooterWordmarkInView(true); },
      { root, threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    const wrapper = wrapperRef.current;
    const lenis = new Lenis({ wrapper, content: contentRef.current, smoothWheel: true });
    let raf: number;
    function loop(time: number) { lenis.raf(time); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  function handleNavigate(item: string) {
    if (homeNavigation === "route") {
      if (item === "Home") { window.location.assign("/"); return; }
      if (item === "Work") { window.location.assign("/works"); return; }
      if (item === "About") { window.location.assign("/about"); return; }
      if (item === "Contact") { window.location.assign("/contact"); return; }
      setMenuOpen(false);
      return;
    }
    const pageMap: Record<string, Page> = { Home: "home", Work: "work", About: "about", "Curated Spaces": "curratedspaces", Contact: "contact" };
    const page = pageMap[item];
    if (page) {
      navigateTo(page);
      setTimeout(() => setMenuOpen(false), SLIDE_DURATION);
    } else {
      setMenuOpen(false);
    }
  }

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
        isHome={open}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        style={{ "--header-fg": "#59534c", transition: "none" } as React.CSSProperties}
        navLabel="Home / Curated Spaces"
        homeNavigation={homeNavigation}
      />
      <div ref={contentRef}>
        <section className={styles.hero} aria-label="Curated spaces">
          <h1 className={styles.title}>Curated Spaces</h1>
          <div
            ref={emblaRef}
            className={styles.carousel}
            aria-label="Curated spaces projects"
            data-lenis-prevent
          >
            <div className={styles.carouselTrack}>
              {/* ponytail: items doubled so embla loop always has content wider than viewport */}
              {[...items, ...items].map((item, i) => (
                <article
                  className={styles.carouselCard}
                  key={`${item.src}-${i}`}
                  style={{
                    "--image-width": `${item.width}px`,
                    "--image-width-2k": `${item.width * 1.2}px`,
                    "--image-height": `${item.height}px`,
                  } as React.CSSProperties}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    className={styles.carouselImage}
                    draggable={false}
                  />
                  <div className={styles.carouselCaption}>
                    <h2 className={styles.carouselTitle}>{item.title}</h2>
                    <p className={styles.carouselMeta}>
                      {item.category}
                      <span aria-hidden="true">{" \u2022 "}</span>
                      {item.year}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <div ref={footerWordmarkRef} style={{ "--wordmark-color": "#59534c" } as React.CSSProperties}>
          <FullnameBlock open={footerWordmarkInView} animation="letters" paddingBottom={64} />
        </div>
        <footer className={workStyles.workFooter}>
          <div className={`${workStyles.workFooterColumn} ${workStyles.workFooterLeft}`}>
            <span className={workStyles.workFooterMenuLabel}>(MENU)</span>
            <nav className={workStyles.workFooterMenu}>
              {FOOTER_MENU_ITEMS.map((item) => (
                <FooterMenuText key={item} text={item} />
              ))}
            </nav>
          </div>
          <div className={`${workStyles.workFooterColumn} ${workStyles.workFooterRight}`}>
            <div className={workStyles.footerInfo}>
              <div className={workStyles.footerInfoTitleRow}>
                <span className={workStyles.footerInfoTitle}>GET IN TOUCH</span>
              </div>
              <div className={workStyles.footerInfoItems}>
                <a className={workStyles.footerInfoLink} href="mailto:hello@yohanes.alexander">hello@yohanes.alexander</a>
                <a className={workStyles.footerInfoLink} href="tel:+6283453294234">+62 83453294234</a>
              </div>
              <div className={workStyles.footerInfoGroup}>
                <div className={workStyles.footerInfoTitleRow}>
                  <span className={workStyles.footerInfoTitle}>SOCIALS</span>
                </div>
                <div className={workStyles.footerInfoItems}>
                  {SOCIAL_ITEMS.map((item) => (
                    <a className={workStyles.footerInfoLink} href={item.href} key={item.label}>{item.label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className={workStyles.footerInfo}>
              <div className={workStyles.footerInfoTitleRow}>
                <span className={workStyles.footerInfoTitle}>OFFICE</span>
              </div>
              <div className={workStyles.footerInfoItems}>
                <p className={workStyles.footerOfficeText}>
                  Menara Palma, Jl.<br />
                  Sudirman no 12 , 123567
                </p>
              </div>
            </div>
          </div>
        </footer>
        <div className={workStyles.workRibbon}>
          <div className={workStyles.workRibbonInner}>
            <div className={workStyles.workRibbonLeft}>
              <a href="/terms" className={`${workStyles.workRibbonLink} ${workStyles.workRibbonLinkPadded}`}>Terms of Use</a>
              <a href="/privacy" className={workStyles.workRibbonLink}>Privacy Policy</a>
            </div>
            <span className={workStyles.workRibbonCopyright}>© 2026. Yohanes Alexander</span>
          </div>
        </div>
      </div>
    </div>
  );
}
