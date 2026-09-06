import SiteShell from "../SiteShell";
import { pageMetadata } from "../../site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Without its own entry this route inherits the site-wide title, description
// and canonical ("/") from app/site.ts.
export const metadata = pageMetadata({
  title: "Work",
  description:
    "Selected interior projects — dental, healthcare, hospitality and commercial spaces by Yohanes Alexander.",
  path: "/works",
});

export default function Page() {
  return <SiteShell />;
}
