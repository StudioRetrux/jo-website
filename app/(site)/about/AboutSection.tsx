"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import Image from "next/image";
import Header from "../home/Header";
import MegaMenu from "../megamenu/MegaMenu";
import FullnameBlock from "./FullnameBlock";
import AboutCategoryItem from "./AboutCategoryItem";
import FooterMenuText from "../work/FooterMenuText";
import workStyles from "../work/work.module.css";
import CtaImageTrail from "./CtaImageTrail";
import { useCursor } from "../contexts/CursorContext";
import { usePageNav, SLIDE_DURATION, SLIDE_EASE, type Page } from "../contexts/PageNavContext";
import styles from "./about.module.css";

const IMAGES_MOMENTUM_LIMIT = 20;
const IMAGES_MOMENTUM_FACTOR = -0.02;
const HERO_ENTRY_MOMENTUM_LIMIT = 36;
const HERO_ENTRY_MOMENTUM_FACTOR = 0.035;
const HERO_ENTRY_LEAD_OFFSET = -16;

type Props = {
  open: boolean;
  slidePage?: boolean;
  homeNavigation?: "state" | "route";
  zIndex?: number;
};

const FOOTER_MENU_ITEMS = ["Work", "About", "Curated Spaces", "Contact"];
const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "WhatsApp", href: "https://wa.me" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export default function AboutSection({ open, slidePage = true, homeNavigation = "state", zIndex }: Props) {
  const { navigateTo } = usePageNav();
  const { setMode } = useCursor();
  const [mounted, setMounted] = useState(false);
  const [ctaTrailActive, setCtaTrailActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroDescEnteredView, setHeroDescEnteredView] = useState(false);
  const [infoHeadingEnteredView, setInfoHeadingEnteredView] = useState(false);
  const [infoImageEnteredView, setInfoImageEnteredView] = useState(false);
  const [profileEnteredView, setProfileEnteredView] = useState(false);
  const [footerWordmarkInView, setFooterWordmarkInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLElement>(null);
  const imagesSectionRef = useRef<HTMLElement>(null);
  const profileSectionRef = useRef<HTMLElement>(null);
  const infoHeadingRef = useRef<HTMLHeadingElement>(null);
  const infoImageRef = useRef<HTMLDivElement>(null);
  const footerWordmarkRef = useRef<HTMLDivElement>(null);
  const pageTop = useMotionValue(0);
  const pageVelocity = useVelocity(pageTop);
  const heroEntryTargetY = useMotionValue(0);
  const heroEntryY = useSpring(heroEntryTargetY, {
    stiffness: 26,
    damping: 32,
    mass: 2.4,
  });
  const { scrollY } = useScroll({ container: wrapperRef });
  const scrollVelocity = useVelocity(scrollY);
  const imagesMomentumTarget = useTransform(scrollVelocity, (velocity) =>
    Math.max(
      -IMAGES_MOMENTUM_LIMIT,
      Math.min(IMAGES_MOMENTUM_LIMIT, velocity * IMAGES_MOMENTUM_FACTOR),
    )
  );
  const imagesMomentumY = useSpring(imagesMomentumTarget, {
    stiffness: 48,
    damping: 20,
    mass: 1.15,
  });

  useEffect(() => { setMounted(true); }, []);

  useAnimationFrame(() => {
    if (!wrapperRef.current) return;
    pageTop.set(wrapperRef.current.getBoundingClientRect().top);

    const carriedY = Math.max(-HERO_ENTRY_MOMENTUM_LIMIT, pageVelocity.get() * HERO_ENTRY_MOMENTUM_FACTOR);
    if (carriedY < heroEntryTargetY.get()) heroEntryTargetY.set(carriedY);
  });

  useEffect(() => {
    if (open) {
      heroEntryTargetY.set(HERO_ENTRY_LEAD_OFFSET);
      return;
    }

    heroEntryTargetY.set(0);
    heroEntryY.set(0);
  }, [heroEntryTargetY, heroEntryY, open]);

  useEffect(() => {
    if (!open) { setHeroDescEnteredView(false); return; }
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setHeroDescEnteredView(true))
    );
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) { setInfoImageEnteredView(false); return; }

    const node = infoImageRef.current;
    const root = wrapperRef.current;
    if (!node || !root) return;

    const nodeRect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    if (nodeRect.bottom > rootRect.top && nodeRect.top < rootRect.bottom) {
      setInfoImageEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInfoImageEnteredView(true); },
      { root, threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) { setInfoHeadingEnteredView(false); return; }

    const node = infoHeadingRef.current;
    const root = wrapperRef.current;
    if (!node || !root) return;

    const nodeRect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    if (nodeRect.bottom > rootRect.top && nodeRect.top < rootRect.bottom) {
      setInfoHeadingEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInfoHeadingEnteredView(true); },
      { root, threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) { setProfileEnteredView(false); return; }

    const node = profileSectionRef.current;
    const root = wrapperRef.current;
    if (!node || !root) return;

    const nodeRect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    if (nodeRect.bottom > rootRect.top && nodeRect.top < rootRect.bottom) {
      setProfileEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setProfileEnteredView(true); },
      { root, threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) { setFooterWordmarkInView(false); return; }
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
    const lenis = new Lenis({
      wrapper,
      content: contentRef.current,
      smoothWheel: true,
    });

    let raf: number;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  function handleNavigate(item: string) {
    if (homeNavigation === "route") {
      if (item === "Home") { window.location.assign("/"); return; }
      if (item === "Work") { window.location.assign("/works"); return; }
      if (item === "Curated Spaces") { window.location.assign("/curratedspaces"); return; }
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
        isHome={true}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        style={{ "--header-fg": "#f7f6f5", transition: "none" } as React.CSSProperties}
        navLabel="home / about"
        homeNavigation={homeNavigation}
      />
      <div ref={contentRef}>
        <div ref={heroRef} className={styles.hero}>
          <motion.div className={styles.heroImage} style={{ y: heroEntryY, scale: 1.06 }} />
          <FullnameBlock open={open} animation="reveal" paddingTop={0} paddingBottom={0} />
          <div className={styles.heroDescriptionRow}>
            <p
              className={styles.heroDescription}
              style={{
                opacity: heroDescEnteredView ? 1 : 0,
                transform: heroDescEnteredView ? "translateY(0)" : "translateY(16px)",
                transition: heroDescEnteredView
                  ? "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 1200ms cubic-bezier(0.4, 0, 0.2, 1) 200ms"
                  : "none",
              }}
            >
              Interior Designer specializing in dental, healthcare, hospitality,<br />
              and commercial spaces.
            </p>
          </div>
        </div>
        <section ref={infoSectionRef} className={styles.infoSection} aria-label="About information">
          <div className={styles.infoColumn}>
            <div className={styles.infoTextBlock}>
              <h2 ref={infoHeadingRef} className={styles.infoHeading}>
                {["We believe spaces should", "feel considered, not forced."].map((line, index) => (
                  <span className={styles.infoHeadingLineClip} key={line}>
                    <span
                      className={styles.infoHeadingLineTrack}
                      style={{
                        transform: infoHeadingEnteredView ? "translateY(0)" : "translateY(115%)",
                        transition: infoHeadingEnteredView
                          ? `transform 700ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`
                          : "none",
                      }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h2>
              <p
                className={styles.infoBody}
                style={{
                  opacity: infoHeadingEnteredView ? 1 : 0,
                  transform: infoHeadingEnteredView ? "translateY(0)" : "translateY(16px)",
                  transition: infoHeadingEnteredView
                    ? "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)"
                    : "none",
                }}
              >
                <span>Through restraint and careful observation, each</span>
                <span>project is designed to support how people move,</span>
                <span>gather, and live.</span>
              </p>
            </div>
          </div>
          <div className={styles.infoColumn}>
            <div ref={infoImageRef} className={styles.infoImageFrame}>
              <div
                className={styles.infoImageLayer}
                style={{
                  clipPath: infoImageEnteredView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  opacity: infoImageEnteredView ? 1 : 0,
                  transition: infoImageEnteredView
                    ? "clip-path 800ms cubic-bezier(0.65, 0, 0.35, 1), opacity 800ms cubic-bezier(0.65, 0, 0.35, 1)"
                    : "none",
                }}
              >
                <Image
                  src="/infoimage.png"
                  alt="Warm wood interior wall with layered lighting and table lamps"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={styles.infoImage}
                />
              </div>
            </div>
          </div>
        </section>
        <section ref={imagesSectionRef} className={styles.imagesSection} aria-label="Images">
          <div className={styles.imagesPanel}>
            <motion.div
              className={styles.imagesPanelLayer}
              style={{ y: imagesMomentumY, scale: 1.08 }}
            >
              <Image
                src="/Resort Room 1.jpg"
                alt="Resort room interior"
                fill
                sizes="50vw"
                className={styles.imagesPanelImage}
              />
            </motion.div>
          </div>
          <div className={styles.imagesPanel}>
            <motion.div
              className={styles.imagesPanelLayer}
              style={{ y: imagesMomentumY, scale: 1.08 }}
            >
              <Image
                src="/Resort Room 2.jpg"
                alt="Resort room lounge"
                fill
                sizes="50vw"
                className={styles.imagesPanelImage}
              />
            </motion.div>
          </div>
        </section>
        <section ref={profileSectionRef} className={styles.profileSection} aria-label="Profile">
          <div className={styles.profileLeft}>
            <span className={styles.profileTag}>{"{ABOUT}"}</span>
            <div className={styles.profileContent}>
              <h2 className={styles.profileName}>
                <span className={styles.profileNameLine}>Yohanes</span>
                <span className={styles.profileNameLine}>Alexander</span>
              </h2>
              <div className={styles.profileBioWrap}>
                <p className={styles.profileBio}>
                  Yohanes Alexander is an interior designer with a strong focus on dental
                  environments, complemented by experience across healthcare, hospitality,
                  and commercial projects. His approach combines structured thinking with a
                  sensitivity to human experience—creating spaces that feel both clear and
                  comfortable.
                </p>
              </div>
              <div className={styles.profileServicesBlock}>
                <span className={styles.profileServicesLabel}>services</span>
                <p className={styles.profileServices}>
                  Interior Designer / Space Planning / Concept Development / Design Consultation / Project Supervision
                </p>
              </div>
            </div>
          </div>
          <div className={styles.profileRight}>
            <div className={styles.profileRightInner}>
              <motion.div className={styles.profileRightLayer} style={{ y: imagesMomentumY }}>
                <Image
                  src="/45.png"
                  alt="Yohanes Alexander"
                  fill
                  sizes="50vw"
                  className={styles.profileRightImage}
                />
              </motion.div>
            </div>
          </div>
        </section>
        <section className={styles.logosSection} aria-label="Logos">
          <div className={styles.logosTrustedBlock}>
            <p className={styles.logosTrustedHeading}>Trusted by</p>
            <p className={styles.logosTrustedBody}>Create thoughtful,<br />well-crafted spaces.</p>
          </div>
          {["Rectangle 119.png", "Rectangle 120.png", "Rectangle 121.png", "Rectangle 122.png", "Rectangle 123.png"].map((logo) => (
            <img key={logo} src={`/${logo}`} alt="" className={styles.logoItem} />
          ))}
        </section>
        <section className={styles.darkSection}>
          <div className={styles.darkSectionInner}>
            <div className={styles.darkSectionA}>
              <img src="/healthcare.png" alt="" className={styles.darkSectionImage} />
            </div>
            <div className={styles.darkSectionB}>
              <p className={styles.darkSectionBody}>
                The practice works across a range of project types,<br />
                approaching each with the same level of care, clarity, and consideration.
              </p>
              <div className={styles.aboutCatList}>
                {["Healthcare", "Hospitality", "Residential"].map((item) => (
                  <AboutCategoryItem key={item} text={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className={styles.bgSection} aria-label="Background">
          <div className={styles.bgSectionImageWrap}>
            <img src="/452.png" alt="" className={styles.bgSectionImage} />
            <div className={styles.bgSectionOverlay}>
              <p className={styles.bgSectionText}>
                Most of my ideas come from <em>observing</em> how<br />
                <em>people</em> move and spend time in a space.<br />
                Design <em>starts</em> there.
              </p>
              <a href="mailto:retruxstudio@gmail.com" className={styles.bgSectionCta}>Get in touch</a>
            </div>
          </div>
        </section>
        <section className={styles.testimonialsSection}>
          <h2 className={styles.testimonialsHeading}>What They Say</h2>
          <div className={styles.testimonialsCarouselWrap}>
            <div className={styles.testimonialsCarouselTrack}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.testimonialsCard}>
                  <p className={styles.testimonialsCardQuote}>Working with Yohanes was a dream! Their attention to detail and innovative ideas made my small apartment feel spacious and stylish.</p>
                  <div className={styles.testimonialsCardAuthor}>
                    <p className={styles.testimonialsCardName}>Maria Gonzales</p>
                    <p className={styles.testimonialsCardMeta}>Apartment 2023</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          className={styles.ctaSection}
          onMouseEnter={() => { setCtaTrailActive(true); setMode("hidden"); }}
          onMouseLeave={() => { setCtaTrailActive(false); setMode("default"); }}
        >
          <CtaImageTrail active={ctaTrailActive} />
          <div className={styles.ctaSectionInner}>
            <img src="/Icon 1_1.png" alt="" className={styles.ctaSectionIcon} />
            <p className={styles.ctaSectionText}>
              Let&apos;s create spaces that<br />feel just as thoughtful.
            </p>
            <a href="mailto:retruxstudio@gmail.com" className={styles.ctaSectionCta}>Consult</a>
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
