"use server";

import { revalidatePath } from "next/cache";
import { homeConfigSchema, updateHomeConfig, type HomeConfig } from "@/lib/projects/home";

type ActionResult = {
  status: "success" | "error";
  message: string;
};

export async function saveHomeAction(config: HomeConfig): Promise<ActionResult> {
  const parsed = homeConfigSchema.safeParse(config);

  if (!parsed.success) {
    return { status: "error", message: "Home config is invalid." };
  }

  await updateHomeConfig(parsed.data);

  revalidatePath("/");
  revalidatePath("/admin/home");

  return { status: "success", message: "Home page saved." };
}
