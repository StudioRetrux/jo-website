import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPublishedProjectBySlug } from "@/lib/projects/data";
import { SITE } from "../../../site";

/**
 * Per-project Open Graph image, same composition as the site-wide og-image.jpg:
 * project hero full-bleed, title in Instrument Serif at the top, off-white on the photo.
 * Next serves it at /works/<slug>/opengraph-image and wires og:image + twitter:image
 * for that route — the page's generateMetadata must not set `images` itself.
 */
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — project`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  const font = await readFile(path.join(process.cwd(), "public/fonts/InstrumentSerif-Regular.ttf"));

  // Satori can't read a relative path — thumbnails are stored as /foo.jpg, so resolve
  // them against the site origin. Remote URLs pass through unchanged.
  const hero = project ? new URL(project.thumbnail.url, SITE.url).toString() : null;
  const title = (project?.title ?? SITE.name).toUpperCase();
  // Optical fit: Instrument Serif caps average ≈0.58 em wide. Shrink long titles so
  // they stay on one line inside 1120 px.
  const fontSize = Math.min(144.732, Math.floor(1120 / (title.length * 0.58)));
  const meta = [project?.category, project?.year].filter(Boolean).join("  •  ");

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative", background: SITE.ink, overflow: "hidden" }}>
        {hero && (
          <img src={hero} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 240, background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%)" }} />
        <div
          style={{
            position: "absolute", left: 40, right: 40, top: 40, display: "flex", justifyContent: "center",
            fontFamily: "Instrument Serif", fontSize, lineHeight: 1.2, color: SITE.paper, textTransform: "uppercase", whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        {meta && (
          <div style={{ position: "absolute", left: 40, bottom: 36, display: "flex", fontFamily: "Instrument Serif", fontSize: 28, color: SITE.paper, opacity: 0.9, letterSpacing: 1 }}>
            {meta}
          </div>
        )}
      </div>
    ),
    { ...size, fonts: [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }] },
  );
}
