import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/cms/ProjectEditor";
import { getProjectById } from "@/lib/projects/data";
import styles from "./projectEditorPage.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CmsProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CmsProjectPage({ params }: CmsProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <ProjectEditor project={project} />
    </main>
  );
}
