import { redirect } from "next/navigation";

export default function CmsHomePage() {
  redirect("/admin/projects");
}
