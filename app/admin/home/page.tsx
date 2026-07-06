import { HomeManager } from "@/components/admin/HomeManager";
import { getPublishedProjects } from "@/lib/projects/data";
import { getHomeConfig } from "@/lib/projects/home";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [config, projects] = await Promise.all([
    getHomeConfig(),
    getPublishedProjects(),
  ]);

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Home Page</h1>
        <p className="text-sm text-muted-foreground">
          Select which published works appear in the home carousel. Every field
          falls back to the work&apos;s own data — overrides are optional.
        </p>
      </header>

      <HomeManager config={config} projects={projects} />
    </div>
  );
}
