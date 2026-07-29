import Link from "next/link";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import type { Project } from "@/lib/projects/types";
import styles from "./[slug]/projectDetail.module.css";

// Shared by the real /projects/[slug] route and the client overlay, so the two can't
// drift. onClose is set by the overlay; the route leaves its links as plain links.
export default function ProjectContent({ project, onClose }: { project: Project; onClose?: () => void }) {
  return (
    <>
      <header className={styles.header}>
        {onClose ? (
          <button type="button" className={styles.brand} onClick={onClose}>
            Johannes Alexander
          </button>
        ) : (
          <Link href="/" className={styles.brand}>
            Johannes Alexander
          </Link>
        )}
        <nav aria-label="Project navigation">
          {onClose ? (
            <button type="button" onClick={onClose}>Back</button>
          ) : (
            <Link href="/works">Back</Link>
          )}
          <span>/</span>
          <span>{project.category}</span>
          <span>/</span>
          <span>{project.title}</span>
        </nav>
      </header>

      <SectionRenderer sections={project.sections} />
    </>
  );
}
