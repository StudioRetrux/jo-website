"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, House, Images, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/projects", label: "Projects", icon: LayoutGrid },
  { href: "/admin/home", label: "Home Page", icon: House },
  { href: "/admin/curatedspaces", label: "Curated Spaces", icon: Images },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            pathname.startsWith(href) &&
              "bg-sidebar-accent text-sidebar-foreground",
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}

      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="mt-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <ExternalLink className="size-4" />
        View site
      </a>
    </nav>
  );
}
