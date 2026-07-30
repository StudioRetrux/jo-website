import { permanentRedirect } from "next/navigation";

export const runtime = "nodejs";

// The detail page lives under /works now — the list it belongs to is /works, not
// /projects. Kept as a redirect so links shared before the move still land.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/works/${slug}`);
}
