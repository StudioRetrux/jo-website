import SiteShell from "../SiteShell";
import { pageMetadata } from "../../site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Yohanes Alexander collects, uses and safeguards your personal information.",
  path: "/privacy",
});

export default function Page() {
  return <SiteShell />;
}
