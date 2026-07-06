"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProjectAction,
  setPublishedAction,
} from "@/app/admin/projects/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Project } from "@/lib/projects/types";

function PublishSwitch({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={project.published}
      disabled={isPending}
      onCheckedChange={(checked) =>
        startTransition(async () => {
          const result = await setPublishedAction(project.id, checked);
          if (result.status === "error") {
            toast.error(result.message);
          }
        })
      }
    />
  );
}

function DeleteButton({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{project.title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            Permanently removes the project and its sections. This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await deleteProjectAction(project.id);
                if (result.status === "error") {
                  toast.error(result.message);
                } else {
                  toast.success(result.message);
                }
              })
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ProjectsTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        No projects yet. Create the first one.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16" />
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.thumbnail.url}
                  alt={project.thumbnail.alt}
                  className="h-10 w-14 rounded object-cover"
                />
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="font-medium hover:underline"
                >
                  {project.title}
                </Link>
                <p className="text-xs text-muted-foreground">/{project.slug}</p>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{project.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.year}
              </TableCell>
              <TableCell>
                <PublishSwitch project={project} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(project.updatedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/projects/${project.id}`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <DeleteButton project={project} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
