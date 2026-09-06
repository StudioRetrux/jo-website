import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectContent from "../../projects/ProjectContent";
import { pageMetadata } from "../../../site";
import { getPublishedProjectBySlug, getRelatedWorkItems } from "@/lib/projects/data";
import styles from "../../projects/[slug]/projectDetail.module.css";

export const runtime = "nodejs";

// og:image and twitter:image come from opengraph-image.tsx in this same segment, so
// nothing here sets `images` — doing so would shadow the generated one.
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.subtitle,
    path: `/works/${slug}`,
    type: "article",
    // opengraph-image.tsx sits in this segment and supplies the real one.
    ownImage: true,
  });
}

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

  const related = await getRelatedWorkItems(project.slug, project.category);

  return (
    <main className={styles.page}>
      <ProjectContent project={project} related={related} />
    </main>
  );
}
