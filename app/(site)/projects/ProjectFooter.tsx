"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import FullnameBlock from "../about/FullnameBlock";
import FooterMenuText from "../work/FooterMenuText";
import { scrollParent } from "./scrollParent";
import styles from "../work/work.module.css";

const FOOTER_MENU_ITEMS = ["Work", "About", "Curated Spaces", "Contact"];
const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "WhatsApp", href: "https://wa.me" },
  { label: "TikTok", href: "https://tiktok.com" },
];

// Same footer the work and curated pages use — their styles, not a copy of them.
export default function ProjectFooter() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [wordmarkInView, setWordmarkInView] = useState(false);

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
        <FullnameBlock open={wordmarkInView} animation="letters" paddingBottom={64} />
      </div>
      <footer className={styles.workFooter}>
        <div className={`${styles.workFooterColumn} ${styles.workFooterLeft}`}>
          <span className={styles.workFooterMenuLabel}>(MENU)</span>
          <nav className={styles.workFooterMenu}>
            {FOOTER_MENU_ITEMS.map((item) => (
              <FooterMenuText key={item} text={item} />
            ))}
          </nav>
        </div>
        <div className={`${styles.workFooterColumn} ${styles.workFooterRight}`}>
          <div className={styles.footerInfo}>
            <div className={styles.footerInfoTitleRow}>
              <span className={styles.footerInfoTitle}>GET IN TOUCH</span>
            </div>
            <div className={styles.footerInfoItems}>
              <a className={styles.footerInfoLink} href="mailto:hello@yohanes.alexander">hello@yohanes.alexander</a>
              <a className={styles.footerInfoLink} href="tel:+6283453294234">+62 83453294234</a>
            </div>
            <div className={styles.footerInfoGroup}>
              <div className={styles.footerInfoTitleRow}>
                <span className={styles.footerInfoTitle}>SOCIALS</span>
              </div>
              <div className={styles.footerInfoItems}>
                {SOCIAL_ITEMS.map((item) => (
                  <a className={styles.footerInfoLink} href={item.href} key={item.label}>{item.label}</a>
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
            <a href="/terms" className={`${styles.workRibbonLink} ${styles.workRibbonLinkPadded}`}>Terms of Use</a>
            <a href="/privacy" className={styles.workRibbonLink}>Privacy Policy</a>
          </div>
          <div className={styles.workRibbonRight}>
              <span className={styles.workRibbonDev}>
                Developed by <span className={styles.workRibbonLink}>Retrux</span>
              </span>
              <span className={styles.workRibbonCopyright}>© 2026. Yohanes Alexander</span>
            </div>
        </div>
      </div>
    </>
  );
}
