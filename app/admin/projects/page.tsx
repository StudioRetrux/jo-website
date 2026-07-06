import { CreateProjectDialog } from "@/components/admin/CreateProjectDialog";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { getAllProjects } from "@/lib/projects/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} total — works grid, detail pages, and home
            carousel all pull from here.
          </p>
        </div>
        <CreateProjectDialog />
      </header>

      <ProjectsTable projects={projects} />
    </div>
  );
}
