"use server";

import { revalidatePath } from "next/cache";
import {
  curatedSpacesConfigSchema,
  updateCuratedSpacesConfig,
  type CuratedSpacesConfig,
} from "@/lib/projects/curated";

type ActionResult = {
  status: "success" | "error";
  message: string;
};

export async function saveCuratedSpacesAction(config: CuratedSpacesConfig): Promise<ActionResult> {
  const parsed = curatedSpacesConfigSchema.safeParse(config);

  if (!parsed.success) {
    return { status: "error", message: "Curated spaces config is invalid." };
  }

  await updateCuratedSpacesConfig(parsed.data);

  revalidatePath("/");
  revalidatePath("/curratedspaces");
  revalidatePath("/admin/curatedspaces");

  return { status: "success", message: "Curated spaces saved." };
}
