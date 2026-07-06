import Link from "next/link";
import { getAllProjects } from "@/lib/projects/data";
import { createProjectAction } from "./actions";
import styles from "./projectsCms.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CmsProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className={styles.page}>
      <section className={styles.createPanel}>
        <div>
          <p className={styles.kicker}>CMS</p>
          <h1>Projects</h1>
          <span>Create project records, edit sections, and publish dynamic pages.</span>
        </div>

        <form action={createProjectAction} className={styles.createForm}>
          <label>
            <span>Project title</span>
            <input name="title" type="text" placeholder="Home Resort Batu" required />
          </label>

          <label>
            <span>Slug</span>
            <input name="slug" type="text" placeholder="home-resort-batu" />
          </label>

          <button type="submit">Create project</button>
        </form>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>All projects</h2>
          <div className={styles.headerMeta}>
            <span>{projects.length} total</span>
            <Link href="/cms/projects/new">Dedicated create page</Link>
          </div>
        </div>

        <div className={styles.list}>
          {projects.map((project) => (
            <Link
              href={`/cms/projects/${project.id}`}
              key={project.id}
              className={styles.card}
            >
              <div>
                <p>{project.category}</p>
                <h3>{project.title}</h3>
                <span>/projects/{project.slug}</span>
              </div>
              <div className={styles.cardMeta}>
                <strong>{project.published ? "Published" : "Draft"}</strong>
                <span>{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
