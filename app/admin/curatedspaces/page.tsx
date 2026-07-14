import { CuratedSpacesManager } from "@/components/admin/CuratedSpacesManager";
import { getCuratedSpacesConfig } from "@/lib/projects/curated";
import { DEFAULT_CURATED_SPACE_ITEMS } from "@/lib/projects/curated-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminCuratedSpacesPage() {
  const config = await getCuratedSpacesConfig();
  const items = config.items.length > 0 ? config.items : DEFAULT_CURATED_SPACE_ITEMS;

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Curated Spaces</h1>
        <p className="text-sm text-muted-foreground">
          Images in the curated spaces carousel, in display order. Width and
          height control each card&apos;s size on a 1440px design.
        </p>
      </header>

      <CuratedSpacesManager items={items} />
    </div>
  );
}
