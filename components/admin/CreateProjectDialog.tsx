"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createProjectAction } from "@/app/admin/projects/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Draft is created immediately — editor opens after submit.
          </DialogDescription>
        </DialogHeader>
        <form action={createProjectAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-project-title">Title</Label>
            <Input
              id="new-project-title"
              name="title"
              placeholder="Home Resort Batu"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-project-slug">
              Slug <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="new-project-slug"
              name="slug"
              placeholder="home-resort-batu"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
