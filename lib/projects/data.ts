import { prisma } from "@/lib/prisma";
import type { Prisma, Project as ProjectRow } from "@/lib/generated/prisma/client";
import { createStarterProject, slugifyProjectTitle } from "./defaults";
import type { CreateProjectInput, ProjectUpdateInput } from "./schema";
import type { ImageAsset, Project, ProjectSection, WorkCardLayout } from "./types";

function serializeProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle,
    thumbnail: row.thumbnail as ImageAsset,
    hoverImage: (row.hoverImage as ImageAsset | null) ?? undefined,
    cardLayout: (row.cardLayout as WorkCardLayout | null) ?? undefined,
    published: row.published,
    year: row.year,
    category: row.category,
    sections: row.sections as ProjectSection[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map(serializeProject);
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const row = await prisma.project.findFirst({ where: { slug, published: true } });

  return row ? serializeProject(row) : null;
}

export async function getAllProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return rows.map(serializeProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { id } });

  return row ? serializeProject(row) : null;
}

async function getUniqueSlug(baseSlug: string, projectId?: string) {
  const cleaned = slugifyProjectTitle(baseSlug) || "project";
  let candidate = cleaned;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === projectId) {
      return candidate;
    }

    counter += 1;
    candidate = `${cleaned}-${counter}`;
  }
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const starter = createStarterProject(input);
  const slug = await getUniqueSlug(starter.slug);
  const row = await prisma.project.create({
    data: {
      ...starter,
      slug,
      sections: starter.sections as unknown as Prisma.InputJsonValue,
    },
  });

  return serializeProject(row);
}

export async function updateProject(
  id: string,
  input: ProjectUpdateInput,
): Promise<Project | null> {
  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    return null;
  }

  const slug = await getUniqueSlug(input.slug, id);
  const row = await prisma.project.update({
    where: { id },
    data: {
      ...input,
      slug,
      thumbnail: input.thumbnail as Prisma.InputJsonValue,
      hoverImage: input.hoverImage as Prisma.InputJsonValue | undefined,
      cardLayout: input.cardLayout as Prisma.InputJsonValue | undefined,
      sections: input.sections as unknown as Prisma.InputJsonValue,
    },
  });

  return serializeProject(row);
}
