import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "../site";
import "./admin.css";

// Admin is its own root layout, so it inherits nothing from the site one — including
// metadataBase, whose absence makes Next fall back to localhost when resolving URLs.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Admin — Yohanes Alexander",
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
            <div className="border-b px-5 py-4">
              <p className="text-sm font-semibold">Yohanes Alexander</p>
              <p className="text-xs text-muted-foreground">Admin</p>
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
