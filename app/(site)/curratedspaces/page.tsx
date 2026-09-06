import SiteShell from "../SiteShell";
import { pageMetadata } from "../../site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Without its own entry this route inherits the site-wide title, description
// and canonical ("/") from app/site.ts.
export const metadata = pageMetadata({
  title: "Curated Spaces",
  description:
    "A running observation deck of spaces worth a second look, curated by Yohanes Alexander.",
  path: "/curratedspaces",
});

export default function Page() {
  return <SiteShell />;
}
