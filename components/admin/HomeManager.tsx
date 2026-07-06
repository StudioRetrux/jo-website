"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveHomeAction } from "@/app/admin/home/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { resolveHomeSlide, type HomeConfig, type HomeSlide } from "@/lib/projects/home-shared";
import type { Project } from "@/lib/projects/types";

type Props = {
  config: HomeConfig;
  projects: Project[];
};

function OverrideField({
  label,
  placeholder,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {textarea ? (
        <Textarea
          value={value}
          placeholder={placeholder}
          rows={2}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}

export function HomeManager({ config, projects }: Props) {
  const [slides, setSlides] = useState<HomeSlide[]>(config.slides);
  const [isPending, startSaving] = useTransition();

  const available = projects.filter(
    (project) => !slides.some((slide) => slide.projectId === project.id),
  );

  function addSlide(projectId: string) {
    setSlides((current) => [...current, { projectId }]);
  }

  function removeSlide(index: number) {
    setSlides((current) => current.filter((_, i) => i !== index));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    setSlides((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [slide] = next.splice(index, 1);
      next.splice(nextIndex, 0, slide);
      return next;
    });
  }

  function setOverride(index: number, key: keyof Omit<HomeSlide, "projectId">, value: string) {
    setSlides((current) =>
      current.map((slide, i) => {
        if (i !== index) return slide;
        const next = { ...slide };
        if (value) {
          next[key] = value;
        } else {
          delete next[key];
        }
        return next;
      }),
    );
  }

  function save() {
    startSaving(async () => {
      const result = await saveHomeAction({ slides });
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Select value="" onValueChange={addSlide} disabled={available.length === 0}>
          <SelectTrigger className="w-72">
            <div className="flex items-center gap-2">
              <Plus className="size-4" />
              <SelectValue
                placeholder={
                  available.length === 0
                    ? "All published works added"
                    : "Add work to carousel"
                }
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            {available.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title} — {project.category} {project.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : "Save home page"}
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No slides yet. Add published works above — order here is carousel
          order.
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => {
            const project = projects.find((p) => p.id === slide.projectId);

            if (!project) {
              return (
                <Card key={`${slide.projectId}-${index}`}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">Missing</Badge>
                      <p className="text-sm text-muted-foreground">
                        Project no longer exists or is unpublished.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeSlide(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            }

            const resolved = resolveHomeSlide(slide, project);

            return (
              <Card key={slide.projectId}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolved.background}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                    <div>
                      <CardTitle className="text-sm">
                        {index + 1}. {project.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {resolved.tag}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => moveSlide(index, -1)}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => moveSlide(index, 1)}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSlide(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <OverrideField
                    label="Tag override"
                    placeholder={resolved.tag}
                    value={slide.tag ?? ""}
                    onChange={(value) => setOverride(index, "tag", value)}
                  />
                  <OverrideField
                    label="Heading override"
                    placeholder={resolved.heading}
                    value={slide.heading ?? ""}
                    onChange={(value) => setOverride(index, "heading", value)}
                  />
                  <OverrideField
                    label="Background image override"
                    placeholder={project.thumbnail.url}
                    value={slide.image ?? ""}
                    onChange={(value) => setOverride(index, "image", value)}
                  />
                  <OverrideField
                    label="Thumbnail override"
                    placeholder={project.hoverImage?.url ?? project.thumbnail.url}
                    value={slide.thumbnail ?? ""}
                    onChange={(value) => setOverride(index, "thumbnail", value)}
                  />
                  <div className="col-span-2">
                    <OverrideField
                      label="Description override — line breaks split lines"
                      placeholder={resolved.descLines.join("\n")}
                      value={slide.description ?? ""}
                      onChange={(value) =>
                        setOverride(index, "description", value)
                      }
                      textarea
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
