import Link from "next/link";
import { createProjectAction } from "../actions";
import styles from "../projectsCms.module.css";

export default function NewProjectPage() {
  return (
    <main className={styles.page}>
      <section className={styles.createPanel}>
        <div>
          <p className={styles.kicker}>CMS</p>
          <h1>New project</h1>
          <span>Create draft metadata first. Section builder opens right after submit.</span>
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
          <h2>Next step</h2>
          <span>Builder flow</span>
        </div>

        <div className={styles.list}>
          <Link href="/cms/projects" className={styles.card}>
            <div>
              <p>Projects</p>
              <h3>Back to list</h3>
              <span>Review all drafts and published entries.</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
