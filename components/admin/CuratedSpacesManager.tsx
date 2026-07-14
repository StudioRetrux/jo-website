"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveCuratedSpacesAction } from "@/app/admin/curatedspaces/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CuratedSpaceItem } from "@/lib/projects/curated-shared";

type Props = {
  items: CuratedSpaceItem[];
};

const NEW_ITEM: CuratedSpaceItem = {
  src: "",
  width: 496,
  height: 331,
  title: "",
  category: "",
  year: `${new Date().getFullYear()}`,
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function CuratedSpacesManager({ items: initialItems }: Props) {
  const [items, setItems] = useState<CuratedSpaceItem[]>(initialItems);
  const [isPending, startSaving] = useTransition();

  function addItem() {
    setItems((current) => [...current, { ...NEW_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  function setField(index: number, key: keyof CuratedSpaceItem, value: string) {
    setItems((current) =>
      current.map((item, i) => {
        if (i !== index) return item;
        if (key === "width" || key === "height") {
          return { ...item, [key]: Number(value) || 0 };
        }
        return { ...item, [key]: value };
      }),
    );
  }

  function save() {
    startSaving(async () => {
      const result = await saveCuratedSpacesAction({ items });
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
        <Button variant="outline" onClick={addItem}>
          <Plus className="size-4" />
          Add image
        </Button>
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : "Save curated spaces"}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No images yet. Add one above — order here is carousel order.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  {item.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.src} alt="" className="h-10 w-14 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-14 rounded bg-muted" />
                  )}
                  <CardTitle className="text-sm">
                    {index + 1}. {item.title || "Untitled"}
                  </CardTitle>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => moveItem(index, -1)}>
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => moveItem(index, 1)}>
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="col-span-2 md:col-span-3">
                  <Field label="Image URL" value={item.src} onChange={(value) => setField(index, "src", value)} />
                </div>
                <Field label="Title" value={item.title} onChange={(value) => setField(index, "title", value)} />
                <Field label="Category" value={item.category} onChange={(value) => setField(index, "category", value)} />
                <Field label="Year" value={item.year} onChange={(value) => setField(index, "year", value)} />
                <Field label="Width (px)" type="number" value={item.width} onChange={(value) => setField(index, "width", value)} />
                <Field label="Height (px)" type="number" value={item.height} onChange={(value) => setField(index, "height", value)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
