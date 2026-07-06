"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { updateProjectAction } from "@/app/admin/projects/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugifyProjectTitle } from "@/lib/projects/defaults";
import type { ProjectUpdateInput } from "@/lib/projects/schema";
import type { ImageAsset, Project } from "@/lib/projects/types";

type BaseDraft = Omit<ProjectUpdateInput, "hoverImage">;

function createProjectDraft(project: Project): BaseDraft {
  return {
    title: project.title,
    slug: project.slug,
    subtitle: project.subtitle,
    thumbnail: project.thumbnail,
    published: project.published,
    year: project.year,
    category: project.category,
    // Detail-page sections aren't editable yet — passed through untouched on save.
    sections: project.sections,
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ProjectEditor({ project }: { project: Project }) {
  const [draft, setDraft] = useState<BaseDraft>(() =>
    createProjectDraft(project),
  );
  const [hoverImage, setHoverImage] = useState({
    url: project.hoverImage?.url ?? "",
    alt: project.hoverImage?.alt ?? "",
  });
  const [isPending, startSaving] = useTransition();

  function setField<K extends keyof BaseDraft>(key: K, value: BaseDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setThumbnail(patch: Partial<ImageAsset>) {
    setDraft((current) => ({
      ...current,
      thumbnail: { ...current.thumbnail, ...patch },
    }));
  }

  function syncSlugWithTitle(title: string) {
    setDraft((current) => ({
      ...current,
      title,
      slug: slugifyProjectTitle(title) || current.slug,
    }));
  }

  function saveProject() {
    startSaving(async () => {
      const result = await updateProjectAction(project.id, {
        ...draft,
        hoverImage: hoverImage.url
          ? { url: hoverImage.url, alt: hoverImage.alt || draft.title }
          : undefined,
      });

      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-8">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            Projects / {project.id}
          </p>
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {draft.title}
            </h1>
            <Badge variant={draft.published ? "default" : "secondary"}>
              {draft.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/projects/${draft.slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Public page
            </a>
          </Button>
          <Button size="sm" onClick={saveProject} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Title">
            <Input
              value={draft.title}
              onChange={(event) => syncSlugWithTitle(event.target.value)}
            />
          </Field>
          <Field label="Slug">
            <Input
              value={draft.slug}
              onChange={(event) => setField("slug", event.target.value)}
            />
          </Field>
          <Field label="Subtitle — home carousel description; use line breaks">
            <Textarea
              value={draft.subtitle}
              rows={3}
              onChange={(event) => setField("subtitle", event.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Input
                value={draft.category}
                onChange={(event) => setField("category", event.target.value)}
              />
            </Field>
            <Field label="Year">
              <Input
                value={draft.year}
                onChange={(event) => setField("year", event.target.value)}
              />
            </Field>
          </div>
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label className="text-sm">Published</Label>
            <Switch
              checked={draft.published}
              onCheckedChange={(checked) => setField("published", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Thumbnail URL — default state in works grid + home bg">
            <Input
              value={draft.thumbnail.url}
              onChange={(event) => setThumbnail({ url: event.target.value })}
            />
          </Field>
          <Field label="Thumbnail alt">
            <Input
              value={draft.thumbnail.alt}
              onChange={(event) => setThumbnail({ alt: event.target.value })}
            />
          </Field>
          <Field label="Hover image URL — swap on hover (optional)">
            <Input
              value={hoverImage.url}
              onChange={(event) =>
                setHoverImage((current) => ({
                  ...current,
                  url: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Hover image alt">
            <Input
              value={hoverImage.alt}
              onChange={(event) =>
                setHoverImage((current) => ({
                  ...current,
                  alt: event.target.value,
                }))
              }
            />
          </Field>
          {draft.thumbnail.url ? (
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.thumbnail.url}
                alt={draft.thumbnail.alt}
                className="h-24 w-36 rounded-md border object-cover"
              />
              {hoverImage.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hoverImage.url}
                  alt={hoverImage.alt}
                  className="h-24 w-36 rounded-md border object-cover"
                />
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Detail-page section builder comes later — existing sections are kept
        as-is when saving.
      </p>
    </div>
  );
}
