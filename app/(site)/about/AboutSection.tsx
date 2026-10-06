"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useVelocity,
} from "motion/react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Header from "../home/Header";
import MegaMenu from "../megamenu/MegaMenu";
import FullnameBlock from "./FullnameBlock";
import FullnameMobile from "../FullnameMobile";
import SplitReveal from "../SplitReveal";
import LogosCarousel from "./LogosCarousel";
import AboutCategoryItem from "./AboutCategoryItem";
import { WORK_CATEGORIES } from "@/lib/projects/types";
import FooterMenuText from "../work/FooterMenuText";
import workStyles from "../work/work.module.css";
import CtaImageTrail from "./CtaImageTrail";
// Shared scroll-position parallax for section and project images.
import ParallaxImage from "../projects/ParallaxImage";
import { useCursor } from "../contexts/CursorContext";
import { usePageNav, SLIDE_DURATION, SLIDE_EASE, type Page } from "../contexts/PageNavContext";
import styles from "./about.module.css";

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
/* the heading is revealed line by line, so the breaks are markup, not wrapping —
   a 262px column on a phone needs its own set */
const INFO_HEADING_LINES = ["We believe spaces should", "feel considered, not forced."];
const INFO_HEADING_LINES_MOBILE = ["We believe spaces", "should feel considered,", "not forced."];
const INFO_BODY =
  "Through restraint and careful observation, each project is designed to support how people move, gather, and live.";

const LOGOS = [
  "Rectangle 119.png",
  "Rectangle 120.png",
  "Rectangle 121.png",
  "Rectangle 122.png",
  "Rectangle 123.png",
];

const SOCIAL_ITEMS = [
  { label: "Instagram", href: "https://www.instagram.com/nuansa.nuraga" },
  { label: "TikTok", href: "https://www.tiktok.com/@nuansanuraga" },
  { label: "WhatsApp", href: "https://wa.me/6287823139800" },
];

export default function AboutSection({ open, slidePage = true, homeNavigation = "state", zIndex }: Props) {
  const { navigateTo } = usePageNav();
  const { setMode } = useCursor();
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [ctaTrailActive, setCtaTrailActive] = useState(false);
  // desktop scrolls the testimonials with a CSS keyframe; a phone needs to be able to
  // drag, so embla takes the same markup over — ref is only attached under 480px
  const [testimonialsEmblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    // stopOnInteraction false = resume after a swipe, not just after touch end
    [AutoScroll({ speed: 1, stopOnInteraction: false })],
  );
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
    if (!open || !wrapperRef.current || !contentRef.current) return;
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
  }, [open]);

  function handleNavigate(item: string) {
    if (homeNavigation === "route") {
      if (item === "Home") { window.location.assign("/"); return; }
      if (item === "Work") { window.location.assign("/works"); return; }
      if (item === "Curated Spaces") { window.location.assign("/curratedspaces"); return; }
      if (item === "Contact") { window.location.assign("/contact"); return; }
      if (item === "Terms of Use") { window.location.assign("/terms"); return; }
      if (item === "Privacy Policy") { window.location.assign("/privacy"); return; }
      setMenuOpen(false);
      return;
    }
    const pageMap: Record<string, Page> = { Home: "home", Work: "work", About: "about", "Curated Spaces": "curratedspaces", Contact: "contact", "Terms of Use": "terms", "Privacy Policy": "privacy" };
    const page = pageMap[item];
    if (page) {
      // menu stays put and gets covered by the page sliding up over it (INCOMING_Z),
      // then drops with no animation of its own once it's hidden
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
        style={{ transition: "none" }}
        navLabel="home / about"
        homeNavigation={homeNavigation}
      />
      <div ref={contentRef}>
        <div ref={heroRef} className={styles.hero}>
          <motion.div className={styles.heroImage} style={{ y: heroEntryY, scale: 1.06 }} />
          <FullnameBlock open={open} animation="reveal" paddingTop={0} paddingBottom={0} />
          <div className={styles.heroDescriptionRow}>
            <SplitReveal as="p" className={styles.heroDescription} play={open} delay={0.2}>
              Interior Designer specializing in dental, healthcare, hospitality,{" "}<br />
              and commercial spaces.
            </SplitReveal>
          </div>
        </div>
        <section ref={infoSectionRef} className={styles.infoSection} aria-label="About information">
          <div className={styles.infoColumn}>
            <div className={styles.infoTextBlock}>
              {/* the h2 stays put for the observer; the split inside re-mounts with the breaks */}
              <h2 ref={infoHeadingRef} className={styles.infoHeading}>
                <SplitReveal
                  key={mobile ? "mobile" : "desktop"}
                  as="span"
                  style={{ display: "block" }}
                  play={infoHeadingEnteredView}
                >
                  {(mobile ? INFO_HEADING_LINES_MOBILE : INFO_HEADING_LINES).map((line, index) => (
                    <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>
                  ))}
                </SplitReveal>
              </h2>
              <SplitReveal
                key={mobile ? "mobile" : "desktop"}
                as="p"
                className={styles.infoBody}
                play={infoHeadingEnteredView}
              >
                {mobile ? (
                  INFO_BODY
                ) : (
                  <>
                    Through restraint and careful observation, each<br />
                    project is designed to support how people move,<br />
                    gather, and live.
                  </>
                )}
              </SplitReveal>
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
                  src="/infoimage.webp"
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
            <ParallaxImage
              src="/Resort Room 1.webp"
              alt="Resort room interior"
              sizes="(max-width: 480px) 100vw, 50vw"
              className={styles.imagesPanelImage}
            />
          </div>
          <div className={styles.imagesPanel}>
            <ParallaxImage
              src="/Resort Room 2.webp"
              alt="Resort room lounge"
              sizes="(max-width: 480px) 100vw, 50vw"
              className={styles.imagesPanelImage}
            />
          </div>
        </section>
        <section ref={profileSectionRef} className={styles.profileSection} aria-label="Profile">
          <div className={styles.profileLeft}>
            <SplitReveal as="span" className={styles.profileTag} play={open} scroll>(ABOUT)</SplitReveal>
            <div className={styles.profileContent}>
              <SplitReveal as="h2" className={styles.profileName} play={open} scroll>
                <span className={styles.profileNameLine}>Yohanes</span>
                <span className={styles.profileNameLine}>Alexander</span>
              </SplitReveal>
              <div className={styles.profileBioWrap}>
                <SplitReveal as="p" className={styles.profileBio} play={open} scroll>
                  Yohanes Alexander is an interior designer with a strong focus on dental
                  environments, complemented by experience across healthcare, hospitality,
                  and commercial projects. His approach combines structured thinking with a
                  sensitivity to human experience—creating spaces that feel both clear and
                  comfortable.
                </SplitReveal>
              </div>
              <div className={styles.profileServicesBlock}>
                <SplitReveal as="span" className={styles.profileServicesLabel} play={open} scroll>services</SplitReveal>
                <SplitReveal as="p" className={styles.profileServices} play={open} scroll>
                  Interior Designer / Space Planning / Concept Development / Design Consultation / Project Supervision
                </SplitReveal>
              </div>
            </div>
          </div>
          <div className={styles.profileRight}>
            <div className={styles.profileRightInner}>
              <Image
                src="/45.webp"
                alt="Yohanes Alexander"
                fill
                sizes="(max-width: 480px) 100vw, 50vw"
                className={styles.profileRightImage}
              />
            </div>
          </div>
        </section>
        <section className={styles.logosSection} aria-label="Logos">
          <div className={styles.logosTrustedBlock}>
            <SplitReveal as="p" className={styles.logosTrustedHeading} play={open} scroll>Trusted by</SplitReveal>
            <SplitReveal as="p" className={styles.logosTrustedBody} play={open} scroll>Create thoughtful,{" "}<br />well-crafted spaces.</SplitReveal>
          </div>
          <LogosCarousel logos={LOGOS} />
        </section>
        <section className={styles.darkSection}>
          <div className={styles.darkSectionInner}>
            <div className={styles.darkSectionA}>
              <img src="/healthcare.webp" alt="" className={styles.darkSectionImage} />
            </div>
            <div className={styles.darkSectionB}>
              <SplitReveal as="p" className={styles.darkSectionBody} play={open} scroll>
                The practice works across a range of project types,{" "}<br />
                approaching each with the same level of care, clarity, and consideration.
              </SplitReveal>
              <div className={styles.aboutCatList}>
                {WORK_CATEGORIES.map((item) => (
                  <AboutCategoryItem
                    key={item}
                    text={item}
                    // real link (route mode and modifier-clicks just follow it); a plain
                    // click slides the work page in with this category picked
                    href={`/works?category=${encodeURIComponent(item)}`}
                    onClick={homeNavigation === "route" ? undefined : (event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                      event.preventDefault();
                      navigateTo("work", `?category=${encodeURIComponent(item)}`);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className={styles.bgSection} aria-label="Background">
          <div className={styles.bgSectionBgClip}>
            <ParallaxImage src="/BG.webp" alt="" sizes="100vw" className={styles.bgSectionBg} />
          </div>
          <div className={styles.bgSectionImageWrap}>
            <img src="/452.webp" alt="" className={styles.bgSectionImage} />
            <div className={styles.bgSectionOverlay}>
              <SplitReveal as="p" className={styles.bgSectionText} play={open} scroll>
                Most of my ideas come from <em>observing</em> how{" "}<br />
                <em>people</em> move and spend time in a space.{" "}<br />
                Design <em>starts</em> there.
              </SplitReveal>
              <a href="https://wa.me/6287823139800" className={styles.bgSectionCta} target="_blank" rel="noreferrer noopener"><SplitReveal as="span" play={open} scroll>Get in touch</SplitReveal></a>
            </div>
          </div>
        </section>
        <section className={styles.testimonialsSection}>
          <SplitReveal as="h2" className={styles.testimonialsHeading} play={open} scroll>What They Say</SplitReveal>
          <div className={styles.testimonialsCarouselWrap} ref={mobile ? testimonialsEmblaRef : undefined}>
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
          onMouseEnter={() => setCtaTrailActive(true)}
          onMouseLeave={() => { setCtaTrailActive(false); setMode("default"); }}
        >
          <CtaImageTrail active={ctaTrailActive} />
          <div className={styles.ctaSectionInner}>
            <img src="/Icon 1_1.webp" alt="" className={styles.ctaSectionIcon} />
            <SplitReveal as="p" className={styles.ctaSectionText} play={open} scroll>
              Let&apos;s create spaces that{" "}<br />feel just as thoughtful.
            </SplitReveal>
            <a href="https://wa.me/6287823139800" className={styles.ctaSectionCta} target="_blank" rel="noreferrer noopener"><SplitReveal as="span" play={open} scroll>Consult</SplitReveal></a>
          </div>
        </section>
        <div ref={footerWordmarkRef} style={{ "--wordmark-color": "#59534c" } as React.CSSProperties}>
          <FullnameMobile open={footerWordmarkInView} />
          <FullnameBlock open={footerWordmarkInView} animation="letters" paddingBottom={64} />
        </div>
        <footer className={workStyles.workFooter}>
          <div className={`${workStyles.workFooterColumn} ${workStyles.workFooterLeft}`}>
            <SplitReveal as="span" className={workStyles.workFooterMenuLabel} play={open} scroll>(MENU)</SplitReveal>
            <nav className={workStyles.workFooterMenu}>
              {FOOTER_MENU_ITEMS.map((item) => (
                <FooterMenuText key={item} text={item} onNavigate={handleNavigate} revealPlay={open} />
              ))}
            </nav>
          </div>
          <div className={`${workStyles.workFooterColumn} ${workStyles.workFooterRight}`}>
            <div className={workStyles.footerInfo}>
              <div className={workStyles.footerInfoTitleRow}>
                <SplitReveal as="span" className={workStyles.footerInfoTitle} play={open} scroll>GET IN TOUCH</SplitReveal>
              </div>
              <div className={workStyles.footerInfoItems}>
                <a className={workStyles.footerInfoLink} href="mailto:yohanes.ptan@gmail.com" target="_blank" rel="noreferrer noopener"><SplitReveal as="span" play={open} scroll>yohanes.ptan@gmail.com</SplitReveal></a>
                <a className={workStyles.footerInfoLink} href="tel:+6287823139800"><SplitReveal as="span" play={open} scroll>+62 878 2313 9800</SplitReveal></a>
              </div>
              <div className={workStyles.footerInfoGroup}>
                <div className={workStyles.footerInfoTitleRow}>
                  <SplitReveal as="span" className={workStyles.footerInfoTitle} play={open} scroll>SOCIALS</SplitReveal>
                </div>
                <div className={workStyles.footerInfoItems}>
                  {SOCIAL_ITEMS.map((item) => (
                    <a className={workStyles.footerInfoLink} href={item.href} key={item.label} target="_blank" rel="noreferrer noopener"><SplitReveal as="span" play={open} scroll>{item.label}</SplitReveal></a>
                  ))}
                </div>
              </div>
            </div>
            <div className={workStyles.footerInfo}>
              <div className={workStyles.footerInfoTitleRow}>
                <SplitReveal as="span" className={workStyles.footerInfoTitle} play={open} scroll>OFFICE</SplitReveal>
              </div>
              <div className={workStyles.footerInfoItems}>
                <SplitReveal as="p" className={workStyles.footerOfficeText} play={open} scroll>
                  Menara Palma, Jl.<br />
                  Sudirman no 12 , 123567
                </SplitReveal>
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
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                  event.preventDefault();
                  handleNavigate("Terms of Use");
                }}
              >
                <SplitReveal as="span" play={open} scroll>Terms of Use</SplitReveal>
              </a>
              <a
                href="/privacy"
                className={workStyles.workRibbonLink}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                  event.preventDefault();
                  handleNavigate("Privacy Policy");
                }}
              >
                <SplitReveal as="span" play={open} scroll>Privacy Policy</SplitReveal>
              </a>
            </div>
            <div className={workStyles.workRibbonRight}>
              <span className={workStyles.workRibbonDev}>
                <SplitReveal as="span" play={open} scroll>Developed by</SplitReveal>{" "}<a href="https://instagram.com/retruxstd" target="_blank" rel="noreferrer noopener" className={workStyles.workRibbonLink}><SplitReveal as="span" play={open} scroll>Retrux</SplitReveal></a>
              </span>
              <SplitReveal as="span" className={workStyles.workRibbonCopyright} play={open} scroll>© 2026. Yohanes Alexander</SplitReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
