import ProjectCarousel from "../../projects/ProjectCarousel";
import ProjectCta from "../../projects/ProjectCta";
import ProjectFooter from "../../projects/ProjectFooter";
import ProjectHero from "../../projects/ProjectHero";
import ProjectIntro from "../../projects/ProjectIntro";
import ProjectNav from "../../projects/ProjectNav";
import ProjectOther, { type OtherItem } from "../../projects/ProjectOther";
import type { CuratedSpaceItem } from "@/lib/projects/curated-shared";
import styles from "../../projects/[slug]/projectDetail.module.css";

// Same page as the project detail, minus the statement/progress/compare/credits
// sections, and with the About body beside the heading rather than under it.
export default function CuratedContent({
  item,
  related,
  homeNavigation = "route",
  onLeave,
}: {
  item: CuratedSpaceItem;
  related: OtherItem[];
  homeNavigation?: "state" | "route";
  onLeave?: () => void;
}) {
  return (
    <>
      <ProjectNav
        title={item.title}
        parent="Curated Spaces"
        homeNavigation={homeNavigation}
        onLeave={onLeave}
      />
      <ProjectHero
        image={item.src}
        alt={item.title}
        category={item.category}
        year={item.year}
        title={item.title}
        subtitle="A place of warmth in every space of the cafe."
      />
      <section className={styles.about}>
        <ProjectIntro
          layout="beside"
          label="(ABOUT)"
          heading={`${item.title} aims to change how we view clinical spaces, turning them into serene, intuitive, and comforting environments.`}
          body="The project focuses on creating a seamless journey, where every detail supports both patient comfort and operational clarity."
        />
      </section>
      <ProjectCarousel />
      <ProjectCta />
      <ProjectOther
        items={related}
        heading="View other curated spaces"
        viewAllHref="/curratedspaces"
        kind="curated"
      />
      <ProjectFooter />
    </>
  );
}
