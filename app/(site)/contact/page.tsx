import SiteShell from "../SiteShell";
import { pageMetadata } from "../../site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Without its own entry this route inherits the site-wide title, description
// and canonical ("/") from app/site.ts.
export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Yohanes Alexander — studio enquiries, collaborations and project consultations.",
  path: "/contact",
});

export default function Page() {
  return <SiteShell />;
}
