import { SectionRenderer } from "@/components/sections/SectionRenderer";
import ProjectAbout from "./ProjectAbout";
import ProjectCarousel from "./ProjectCarousel";
import ProjectCompare from "./ProjectCompare";
import ProjectConclusion from "./ProjectConclusion";
import ProjectCredits from "./ProjectCredits";
import ProjectCta from "./ProjectCta";
import ProjectFooter from "./ProjectFooter";
import ProjectHero from "./ProjectHero";
import ProjectProgress from "./ProjectProgress";
import ProjectProgressMobile from "./ProjectProgressMobile";
import ProjectStatement from "./ProjectStatement";
import ProjectNav from "./ProjectNav";
import ProjectOther, { type OtherItem } from "./ProjectOther";
import type { Project } from "@/lib/projects/types";

// Shared by the real /projects/[slug] route and the client overlay, so the two can't
// drift. The overlay passes onLeave so nav dismisses it instead of reloading.
export default function ProjectContent({
  project,
  related = [],
  homeNavigation = "route",
  onLeave,
}: {
  project: Project;
  related?: OtherItem[];
  homeNavigation?: "state" | "route";
  onLeave?: () => void;
}) {
  return (
    <>
      <ProjectNav title={project.title} homeNavigation={homeNavigation} onLeave={onLeave} />
      <ProjectHero
        image={project.thumbnail.url}
        alt={project.thumbnail.alt}
        category={project.category}
        year={project.year}
        title={project.title}
        subtitle={project.subtitle}
      />
      <ProjectAbout project={project} />
      <ProjectStatement project={project} />
      <ProjectProgress />
      <ProjectProgressMobile />
      <ProjectCompare />
      <ProjectConclusion project={project} />
      <ProjectCarousel />
      <ProjectCredits />
      <ProjectCta />
      <ProjectOther items={related} homeNavigation={homeNavigation} onLeave={onLeave} />
      <ProjectFooter homeNavigation={homeNavigation} onLeave={onLeave} />
      {/* the fixed layout above replaces the CMS equivalents — drop those, keep the rest */}
      <SectionRenderer
        sections={project.sections.filter(
          (section) =>
            section.type !== "hero" &&
            section.type !== "introGallery" &&
            section.type !== "imageStatement",
        )}
      />
    </>
  );
}
