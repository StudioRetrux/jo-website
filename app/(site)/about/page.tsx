import SiteShell from "../SiteShell";
import { pageMetadata } from "../../site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Without its own entry this route inherits the site-wide title, description
// and canonical ("/") from app/site.ts.
export const metadata = pageMetadata({
  title: "About",
  description:
    "Yohanes Alexander is an interior designer working across dental, healthcare, hospitality and commercial spaces.",
  path: "/about",
});

export default function Page() {
  return <SiteShell />;
}
