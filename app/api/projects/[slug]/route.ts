import { getPublishedProjectBySlug } from "@/lib/projects/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Feeds the client-side project overlay — the real /projects/[slug] route still
// serves direct hits and no-JS visitors.
export async function GET(_request: Request, ctx: RouteContext<"/api/projects/[slug]">) {
  const { slug } = await ctx.params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(project);
}
