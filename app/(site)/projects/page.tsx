import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedProjects } from "@/lib/projects/data";
import styles from "./projects.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Legacy list — /works is the canonical one and /projects/[slug] already redirects
// there. Kept reachable, kept out of the index so the two don't compete.
export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: true },
  alternates: { canonical: "/works" },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Yohanes Alexander
        </Link>
        <p>Selected works</p>
      </header>

      <section className={styles.hero}>
        <p>[Portfolio]</p>
        <h1>Projects shaped through atmosphere, material, and spatial rhythm.</h1>
      </section>

      <section className={styles.grid} aria-label="Projects">
        {projects.map((project) => (
          <Link
            href={`/works/${project.slug}`}
            className={styles.card}
            key={project.id}
          >
            <div className={styles.thumb}>
              <Image
                src={project.thumbnail.url}
                alt={project.thumbnail.alt}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
                className={styles.image}
              />
            </div>
            <div className={styles.meta}>
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
            <h2>{project.title}</h2>
            <p>{project.subtitle}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
