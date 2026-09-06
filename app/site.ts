import type { Metadata, Viewport } from "next";

/** Single source of truth for identity strings. Change here, everything follows. */
export const SITE = {
  name: "Yohanes Alexander",
  shortName: "Yohanes A.",
  title: "Yohanes Alexander — Interior Designer",
  description:
    "Interior designer specializing in dental, healthcare, hospitality and commercial spaces. Designed around how people move, gather and live.",
  url: "https://yohanespnjtn.studio",
  locale: "en_US",
  paper: "#F7F6F5",
  ink: "#0A0A0A",
} as const;

const SHARE_ALT =
  "Yohanes Alexander — a family seated on a sofa in a warm, contemporary living room";

/**
 * Next merges metadata *shallowly*: a segment that declares `openGraph` replaces the
 * parent's whole object, images included. The docs' own remedy is to share the images
 * through a variable, which is what this is — every route that sets openGraph spreads
 * it back in. Routes with their own opengraph-image file (works/[slug]) skip it.
 *
 * These live in public/ under fixed names rather than as app/ file conventions so the
 * URL is stable and quotable. Swapping the key visual means a NEW filename — social
 * platforms cache an OG URL hard and will not re-scrape the same one.
 */
export const shareImages = {
  openGraph: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SHARE_ALT }],
  twitter: [{ url: "/twitter-card.jpg", width: 1200, height: 600, alt: SHARE_ALT }],
} as const;

/**
 * Spread into app/layout.tsx:
 *   export const metadata = baseMetadata;
 *   export const viewport = baseViewport;
 * Icons, OG image and Twitter image come from the file conventions next to this file
 * (favicon.ico, icon.svg, apple-icon.png, opengraph-image.jpg, twitter-image.jpg) — do not list them here.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  appleWebApp: { title: SITE.name, statusBarStyle: "default" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: "/",
    title: SITE.title,
    description: SITE.description,
    images: [...shareImages.openGraph],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [...shareImages.twitter],
  },
  robots: { index: true, follow: true },
};

/**
 * Metadata for a single route.
 *
 * Next replaces the `openGraph` and `twitter` objects wholesale rather than merging
 * them field by field, so a page that sets only `openGraph.title` silently drops
 * og:type, og:site_name and og:locale. Everything a route needs is built here instead.
 *
 * `title` is the short label — the layout's template appends the site name for the
 * document title, and the share cards get the long form.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  ownImage = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** Set for a segment carrying its own opengraph-image file, so it isn't overridden. */
  ownImage?: boolean;
}): Metadata {
  const shareTitle = `${title} — ${SITE.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE.name,
      locale: SITE.locale,
      url: path,
      title: shareTitle,
      description,
      ...(ownImage ? {} : { images: [...shareImages.openGraph] }),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      ...(ownImage ? {} : { images: [...shareImages.twitter] }),
    },
  };
}

export const baseViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE.paper },
    { media: "(prefers-color-scheme: dark)", color: SITE.ink },
  ],
};
