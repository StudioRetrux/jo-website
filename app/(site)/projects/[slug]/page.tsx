import { notFound } from "next/navigation";
import ProjectContent from "../ProjectContent";
import { getPublishedProjectBySlug } from "@/lib/projects/data";
import styles from "./projectDetail.module.css";

export const runtime = "nodejs";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

// Direct hits, refreshes and no-JS. In-app clicks open the overlay instead, so the
// page behind stays mounted and the slide is ours — see ProjectOverlay.
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <ProjectContent project={project} />
    </main>
  );
}
