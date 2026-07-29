import Image from "next/image";
import { SIZES } from "../assets";
import type { Project } from "@/lib/projects/types";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: fixed copy like the hero and about — one line to swap for CMS props later.
export default function ProjectStatement({ project }: { project: Project }) {
  return (
    <section className={styles.statement}>
      <Image
        src={project.thumbnail.url}
        alt={project.thumbnail.alt}
        fill
        sizes={SIZES.full}
        className={styles.statementImage}
      />
      <p className={styles.statementText}>
        Designed to efficiently make the experience not intimidating for everyone
        including kids
      </p>
    </section>
  );
}
