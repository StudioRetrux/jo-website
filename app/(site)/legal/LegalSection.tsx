"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Header from "../home/Header";
import MegaMenu from "../megamenu/MegaMenu";
import FullnameBlock from "../about/FullnameBlock";
import FullnameMobile from "../FullnameMobile";
import FooterMenuText from "../work/FooterMenuText";
import { usePageNav, SLIDE_DURATION, SLIDE_EASE, type Page } from "../contexts/PageNavContext";
import { LEGAL_PAGES, type LegalKind } from "./legal-content";
import workStyles from "../work/work.module.css";
import styles from "./legal.module.css";

const FOOTER_MENU_ITEMS = ["Work", "About", "Curated Spaces", "Contact"];
const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://www.instagram.com/nuansa.nuraga" },
  { label: "TikTok", href: "https://www.tiktok.com/@nuansanuraga" },
  { label: "WhatsApp", href: "https://wa.me/6287823139800" },
];

type Props = {
  kind: LegalKind;
  open: boolean;
  slidePage?: boolean;
  homeNavigation?: "state" | "route";
  zIndex?: number;
};

/** Terms and Privacy are the same page with different copy — one component, two entries. */
export default function LegalSection({ kind, open, slidePage = true, homeNavigation = "state", zIndex }: Props) {
  const { navigateTo } = usePageNav();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerWordmarkInView, setFooterWordmarkInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerWordmarkRef = useRef<HTMLDivElement>(null);
  const page = LEGAL_PAGES[kind];

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
      if (item === "Curated Spaces") { window.location.assign("/curratedspaces"); return; }
      if (item === "Contact") { window.location.assign("/contact"); return; }
      if (item === "Terms of Use") { window.location.assign("/terms"); return; }
      if (item === "Privacy Policy") { window.location.assign("/privacy"); return; }
      setMenuOpen(false);
      return;
    }
    const pageMap: Record<string, Page> = { Home: "home", Work: "work", About: "about", "Curated Spaces": "curratedspaces", Contact: "contact", "Terms of Use": "terms", "Privacy Policy": "privacy" };
    const target = pageMap[item];
    if (target) {
      // menu stays put and gets covered by the page sliding up over it (INCOMING_Z),
      // then drops with no animation of its own once it's hidden
      navigateTo(target);
      setTimeout(() => setMenuOpen(false), SLIDE_DURATION);
    } else {
      setMenuOpen(false);
    }
  }

  /** Plain left-click slides; the href stays for middle-click, ctrl-click and crawlers. */
  function ribbonClick(item: string) {
    return (event: React.MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      handleNavigate(item);
    };
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
        style={{ transition: "none" }}
        navLabel={page.navLabel}
        homeNavigation={homeNavigation}
      />
      <div ref={contentRef}>
        <section className={styles.hero} aria-label={page.title}>
          <h1 className={styles.title}>{page.title}</h1>
          <div className={styles.prose}>
            {page.paragraphs.map((text) => (
              <p key={text.slice(0, 40)}>{text}</p>
            ))}
          </div>
        </section>
        <div ref={footerWordmarkRef} style={{ "--wordmark-color": "#59534c" } as React.CSSProperties}>
          <FullnameMobile open={footerWordmarkInView} />
          <FullnameBlock open={footerWordmarkInView} animation="letters" paddingBottom={64} />
        </div>
        <footer className={workStyles.workFooter}>
          <div className={`${workStyles.workFooterColumn} ${workStyles.workFooterLeft}`}>
            <span className={workStyles.workFooterMenuLabel}>(MENU)</span>
            <nav className={workStyles.workFooterMenu}>
              {FOOTER_MENU_ITEMS.map((item) => (
                <FooterMenuText key={item} text={item} onNavigate={handleNavigate} />
              ))}
            </nav>
          </div>
          <div className={`${workStyles.workFooterColumn} ${workStyles.workFooterRight}`}>
            <div className={workStyles.footerInfo}>
              <div className={workStyles.footerInfoTitleRow}>
                <span className={workStyles.footerInfoTitle}>GET IN TOUCH</span>
              </div>
              <div className={workStyles.footerInfoItems}>
                <a className={workStyles.footerInfoLink} href="mailto:yohanes.ptan@gmail.com" target="_blank" rel="noreferrer noopener">yohanes.ptan@gmail.com</a>
                <a className={workStyles.footerInfoLink} href="tel:+6287823139800">+62 878 2313 9800</a>
              </div>
              <div className={workStyles.footerInfoGroup}>
                <div className={workStyles.footerInfoTitleRow}>
                  <span className={workStyles.footerInfoTitle}>SOCIALS</span>
                </div>
                <div className={workStyles.footerInfoItems}>
                  {SOCIAL_ITEMS.map((item) => (
                    <a className={workStyles.footerInfoLink} href={item.href} key={item.label} target="_blank" rel="noreferrer noopener">{item.label}</a>
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
              <a
                href="/terms"
                className={`${workStyles.workRibbonLink} ${workStyles.workRibbonLinkPadded}`}
                onClick={ribbonClick("Terms of Use")}
              >
                Terms of Use
              </a>
              <a
                href="/privacy"
                className={workStyles.workRibbonLink}
                onClick={ribbonClick("Privacy Policy")}
              >
                Privacy Policy
              </a>
            </div>
            <div className={workStyles.workRibbonRight}>
              <span className={workStyles.workRibbonDev}>
                Developed by <a href="https://instagram.com/retruxstd" target="_blank" rel="noreferrer noopener" className={workStyles.workRibbonLink}>Retrux</a>
              </span>
              <span className={workStyles.workRibbonCopyright}>© 2026. Yohanes Alexander</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
