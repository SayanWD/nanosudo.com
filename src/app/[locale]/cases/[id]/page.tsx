import type { ReactElement } from "react";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { getProjectById, getAllProjects } from "@/lib/portfolio-data";
import { ProjectDetailContent } from "./project-detail-content";

type ProjectDetailPageProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps): Promise<ReactElement> {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        <ProjectDetailContent project={project} />
      </main>
    </SiteShell>
  );
}

// Generate static params for all projects
export async function generateStaticParams(): Promise<Array<{ readonly id: string }>> {
  const projects = getAllProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

