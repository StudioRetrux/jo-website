import WorkSection from "../work/WorkSection";
import { getWorkItems } from "@/lib/projects/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const works = await getWorkItems();

  return <WorkSection works={works} open={true} homeNavigation="route" />;
}
