import CurratedSpacesSection from "./CurratedSpacesSection";
import { getCuratedSpaceItems } from "@/lib/projects/curated";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CurratedSpacesPage() {
  const items = await getCuratedSpaceItems();

  return <CurratedSpacesSection open={true} homeNavigation="route" items={items} />;
}
