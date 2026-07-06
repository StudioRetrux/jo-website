import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getPublishedProjectBySlug } from "@/lib/projects/data";
import styles from "./projectDetail.module.css";

export const runtime = "nodejs";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Johannes Alexander
        </Link>
        <nav aria-label="Project navigation">
          <Link href="/projects">Home</Link>
          <span>/</span>
          <Link href="/projects">{project.category}</Link>
          <span>/</span>
          <span>{project.title}</span>
        </nav>
      </header>

      <SectionRenderer sections={project.sections} />
    </main>
  );
}
