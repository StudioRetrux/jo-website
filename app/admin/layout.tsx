import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { SITE } from "../site";
import "./admin.css";

// Admin is its own root layout, so it inherits nothing from the site one — including
// metadataBase, whose absence makes Next fall back to localhost when resolving URLs.
const TITLE = "Retrux Dashboard - Yohanes Alexander";
const DESCRIPTION =
  "Manage and curate Yohanes Alexander Studio's portfolio website, projects, and curated spaces in one place.";

// Icon and share images come from the file conventions in this folder
// (icon.png, opengraph-image.png, twitter-image.png).
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: "website", url: "/admin/projects", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar">
            <div className="flex items-center gap-3 border-b px-5 py-4">
              <Image src="/logo-rtrx.png" alt="Retrux" width={101} height={82} className="h-8 w-auto" priority />
              <div>
                <p className="text-sm font-semibold">Retrux Dashboard</p>
                <p className="text-xs text-muted-foreground">Yohanes Alexander</p>
              </div>
            </div>
            <AdminNav />
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
