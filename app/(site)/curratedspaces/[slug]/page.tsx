import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CuratedContent from "./CuratedContent";
import { pageMetadata } from "../../../site";
import { getCuratedDetail } from "@/lib/projects/curated";
import styles from "../../projects/[slug]/projectDetail.module.css";

export const runtime = "nodejs";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getCuratedDetail(slug);

  if (!detail) return {};

  const { title, category, year } = detail.item;

  return pageMetadata({
    title,
    description: `${title} — ${category}, ${year}. A curated space observed by Yohanes Alexander.`,
    path: `/curratedspaces/${slug}`,
    type: "article",
  });
}

// Direct hits, refreshes and no-JS. In-app clicks open the overlay instead, so the
// page behind stays mounted and the slide is ours — see ProjectOverlay.
export default async function CuratedSpacePage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getCuratedDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <CuratedContent item={detail.item} related={detail.related} />
    </main>
  );
}
