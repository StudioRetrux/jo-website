"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProject, getProjectById, updateProject } from "@/lib/projects/data";
import { createProjectSchema, projectUpdateSchema } from "@/lib/projects/schema";
import type { ProjectUpdateInput } from "@/lib/projects/schema";

type ActionResult = {
  status: "success" | "error";
  message: string;
};

export async function createProjectAction(formData: FormData) {
  const parsed = createProjectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    throw new Error("Invalid project input.");
  }

  const project = await createProject(parsed.data);

  revalidatePath("/cms/projects");
  redirect(`/cms/projects/${project.id}`);
}

export async function updateProjectAction(
  id: string,
  input: ProjectUpdateInput,
): Promise<ActionResult> {
  const parsed = projectUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Project data is invalid. Check required fields and image URLs.",
    };
  }

  const existing = await getProjectById(id);

  if (!existing) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  const project = await updateProject(id, parsed.data);

  if (!project) {
    return {
      status: "error",
      message: "Failed to save project.",
    };
  }

  revalidatePath("/cms/projects");
  revalidatePath(`/cms/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  revalidatePath(`/projects/${project.slug}`);

  return {
    status: "success",
    message: "Project saved.",
  };
}
