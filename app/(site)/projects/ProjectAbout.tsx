import ProjectGallery from "./ProjectGallery";
import ProjectIntro from "./ProjectIntro";
import type { Project } from "@/lib/projects/types";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: copy is templated off the title, same as the hero — every project reads
// identically until real per-project text exists. Swap for the CMS introGallery props
// (label/heading/body already on the section) when it does.
export default function ProjectAbout({ project }: { project: Project }) {
  return (
    <section className={styles.about}>
      <ProjectIntro
        label="(ABOUT)"
        heading={`${project.title} is crafted to transform the perception of living spaces — turning them into serene, intuitive, and welcoming environments.`}
        body="The project emphasizes creating a seamless experience, where every aspect enhances both guest comfort and operational efficiency."
      />
      <ProjectGallery src={project.thumbnail.url} alt={project.thumbnail.alt} />
    </section>
  );
}
