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
import ProjectStatement from "./ProjectStatement";
import ProjectNav from "./ProjectNav";
import ProjectOther from "./ProjectOther";
import type { Project, WorkItem } from "@/lib/projects/types";

// Shared by the real /projects/[slug] route and the client overlay, so the two can't
// drift. The overlay passes onLeave so nav dismisses it instead of reloading.
export default function ProjectContent({
  project,
  related = [],
  homeNavigation = "route",
  onLeave,
}: {
  project: Project;
  related?: WorkItem[];
  homeNavigation?: "state" | "route";
  onLeave?: () => void;
}) {
  return (
    <>
      <ProjectNav title={project.title} homeNavigation={homeNavigation} onLeave={onLeave} />
      <ProjectHero project={project} />
      <ProjectAbout project={project} />
      <ProjectStatement project={project} />
      <ProjectProgress />
      <ProjectCompare />
      <ProjectConclusion project={project} />
      <ProjectCarousel />
      <ProjectCredits />
      <ProjectCta />
      <ProjectOther items={related} />
      <ProjectFooter />
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
