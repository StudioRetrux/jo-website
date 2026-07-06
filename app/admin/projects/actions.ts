"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProject,
  deleteProject,
  getProjectById,
  setProjectPublished,
  updateProject,
} from "@/lib/projects/data";
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

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${project.id}`);
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

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  revalidatePath(`/projects/${project.slug}`);

  return {
    status: "success",
    message: "Project saved.",
  };
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const deleted = await deleteProject(id);

  if (!deleted) {
    return { status: "error", message: "Failed to delete project." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  return { status: "success", message: "Project deleted." };
}

export async function setPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const project = await setProjectPublished(id, published);

  if (!project) {
    return { status: "error", message: "Failed to update project." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);

  return {
    status: "success",
    message: published ? "Project published." : "Project unpublished.",
  };
}
