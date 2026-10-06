"use client";

import ProjectText from "./ProjectText";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import FullnameBlock from "../about/FullnameBlock";
import FullnameMobile from "../FullnameMobile";
import FooterMenuText from "../work/FooterMenuText";
import { scrollParent } from "./scrollParent";
import { usePageNav, type Page } from "../contexts/PageNavContext";
import styles from "../work/work.module.css";

const FOOTER_MENU_ITEMS = ["Work", "About", "Curated Spaces", "Contact"];
const PAGE_BY_ITEM: Record<string, Page> = {
  Home: "home",
  Work: "work",
  About: "about",
  "Curated Spaces": "curratedspaces",
  Contact: "contact",
};
const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://www.instagram.com/nuansa.nuraga" },
  { label: "TikTok", href: "https://www.tiktok.com/@nuansanuraga" },
  { label: "WhatsApp", href: "https://wa.me/6287823139800" },
];

// Same footer the work and curated pages use — their styles, not a copy of them.
export default function ProjectFooter({
  homeNavigation = "route",
  onLeave,
}: {
  homeNavigation?: "state" | "route";
  onLeave?: () => void;
} = {}) {
  const { navigateTo } = usePageNav();
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [wordmarkInView, setWordmarkInView] = useState(false);

  // In the overlay the shell is still mounted underneath, so the menu slides sections;
  // on a direct route hit there's nothing behind it and the anchor's href does the work.
  const handleNavigate =
    homeNavigation === "state"
      ? (item: string) => {
          const page = PAGE_BY_ITEM[item];
          if (!page) return;
          onLeave?.();
          navigateTo(page);
        }
      : undefined;

  useEffect(() => {
    const node = wordmarkRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWordmarkInView(true); },
      { root: scrollParent(node), threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={wordmarkRef} style={{ "--wordmark-color": "#59534c" } as CSSProperties}>
        <FullnameMobile open={wordmarkInView} />
        <FullnameBlock open={wordmarkInView} animation="letters" paddingBottom={64} />
      </div>
      <footer className={styles.workFooter}>
        <div className={`${styles.workFooterColumn} ${styles.workFooterLeft}`}>
          <ProjectText as="span" className={styles.workFooterMenuLabel}>(MENU)</ProjectText>
          <nav className={styles.workFooterMenu}>
            {FOOTER_MENU_ITEMS.map((item) => (
              <FooterMenuText key={item} text={item} onNavigate={handleNavigate} revealPlay />
            ))}
          </nav>
        </div>
        <div className={`${styles.workFooterColumn} ${styles.workFooterRight}`}>
          <div className={styles.footerInfo}>
            <div className={styles.footerInfoTitleRow}>
              <ProjectText as="span" className={styles.footerInfoTitle}>GET IN TOUCH</ProjectText>
            </div>
            <div className={styles.footerInfoItems}>
              <a className={styles.footerInfoLink} href="mailto:yohanes.ptan@gmail.com" target="_blank" rel="noreferrer noopener"><ProjectText as="span">yohanes.ptan@gmail.com</ProjectText></a>
              <a className={styles.footerInfoLink} href="tel:+6287823139800"><ProjectText as="span">+62 878 2313 9800</ProjectText></a>
            </div>
            <div className={styles.footerInfoGroup}>
              <div className={styles.footerInfoTitleRow}>
                <ProjectText as="span" className={styles.footerInfoTitle}>SOCIALS</ProjectText>
              </div>
              <div className={styles.footerInfoItems}>
                {SOCIAL_ITEMS.map((item) => (
                  <a className={styles.footerInfoLink} href={item.href} key={item.label} target="_blank" rel="noreferrer noopener"><ProjectText as="span">{item.label}</ProjectText></a>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.footerInfo}>
            <div className={styles.footerInfoTitleRow}>
              <ProjectText as="span" className={styles.footerInfoTitle}>OFFICE</ProjectText>
            </div>
            <div className={styles.footerInfoItems}>
              <ProjectText as="p" className={styles.footerOfficeText}>
                Menara Palma, Jl.<br />
                Sudirman no 12 , 123567
              </ProjectText>
            </div>
          </div>
        </div>
      </footer>
      <div className={styles.workRibbon}>
        <div className={styles.workRibbonInner}>
          <div className={styles.workRibbonLeft}>
            <a href="/terms" className={`${styles.workRibbonLink} ${styles.workRibbonLinkPadded}`}><ProjectText as="span">Terms of Use</ProjectText></a>
            <a href="/privacy" className={styles.workRibbonLink}><ProjectText as="span">Privacy Policy</ProjectText></a>
          </div>
          <div className={styles.workRibbonRight}>
              <span className={styles.workRibbonDev}>
                <ProjectText as="span">Developed by</ProjectText>{" "}<a href="https://instagram.com/retruxstd" target="_blank" rel="noreferrer noopener" className={styles.workRibbonLink}><ProjectText as="span">Retrux</ProjectText></a>
              </span>
              <ProjectText as="span" className={styles.workRibbonCopyright}>© 2026. Yohanes Alexander</ProjectText>
            </div>
        </div>
      </div>
    </>
  );
}
