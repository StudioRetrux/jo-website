import ProjectIntro from "./ProjectIntro";
import type { Project } from "@/lib/projects/types";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: same block as About, different copy — no gallery, so the section's 120px
// gap has nothing to act on.
export default function ProjectConclusion({ project }: { project: Project }) {
  return (
    <section className={styles.about}>
      <ProjectIntro
        label="(CONCLUSION)"
        heading={`${project.title} illustrates how intentional design can alter perceptions. By blending structure with care, the space transcends mere functionality.`}
        body="By prioritizing features that boost comfort and alleviate stress, we aim to develop a space that fulfills practical needs while promoting a sense of well-being."
      />
    </section>
  );
}
