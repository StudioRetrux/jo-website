import SiteShell from "../SiteShell";
import { pageMetadata } from "../../site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms and conditions governing the use of Yohanes Alexander's website and services.",
  path: "/terms",
});

export default function Page() {
  return <SiteShell />;
}
