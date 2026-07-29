import Image from "next/image";
import { SIZES } from "../assets";
import type { Project } from "@/lib/projects/types";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: image is the project thumbnail — the same asset the work card shows, so
// nothing new to load and no second field to keep in sync until real hero art exists.
export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className={styles.hero}>
      <Image
        src={project.thumbnail.url}
        alt={project.thumbnail.alt}
        fill
        priority
        sizes={SIZES.full}
        className={styles.heroImage}
      />
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>
          {project.category}
          <span aria-hidden="true">{" • "}</span>
          {project.year}
        </p>
        <h1 className={styles.heroTitle}>{project.title}</h1>
        <p className={styles.heroSubtitle}>{project.subtitle}</p>
      </div>
    </section>
  );
}
