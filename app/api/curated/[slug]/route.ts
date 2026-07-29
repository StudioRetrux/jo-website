import { getCuratedDetail } from "@/lib/projects/curated";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Feeds the client-side detail overlay — /curratedspaces/[slug] still serves direct
// hits and no-JS visitors.
export async function GET(_request: Request, ctx: RouteContext<"/api/curated/[slug]">) {
  const { slug } = await ctx.params;
  const detail = await getCuratedDetail(slug);

  if (!detail) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(detail);
}
