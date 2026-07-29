import { notFound } from "next/navigation";
import CuratedContent from "./CuratedContent";
import { getCuratedDetail } from "@/lib/projects/curated";
import styles from "../../projects/[slug]/projectDetail.module.css";

export const runtime = "nodejs";

type PageProps = { params: Promise<{ slug: string }> };

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
