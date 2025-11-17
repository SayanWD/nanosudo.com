'use client';

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllProjects, type PortfolioProject } from "@/lib/portfolio-data";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function ProjectCard({ project }: { readonly project: PortfolioProject }): ReactElement {
  const t = useTranslations();
  return (
    <motion.article
      className="group relative rounded-2xl border border-border/60 bg-surface/80 overflow-hidden shadow-soft transition-all hover:-translate-y-2 hover:border-accent/70 hover:shadow-lg"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      <Link
        href={`/cases/${project.id}`}
        className="block"
        aria-label={t("cases.list.openCaseAria", { title: project.title })}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading text-xl group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-0.5" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.shortDescription}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function CasesPage(): ReactElement {
  const projects = getAllProjects();
  const t = useTranslations();

  // If only one project, simplify the page
  const isSingleProject = projects.length === 1;

  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        {!isSingleProject && (
          <section className="border-b border-border/60 py-section bg-surface/40">
            <Container className="max-w-4xl">
              <motion.div
                className="space-y-6 text-balance text-center"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <motion.p
                  className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
                  variants={fadeInUp}
                >
                  {t("cases.list.label")}
                </motion.p>
                <motion.h1
                  className="font-heading text-4xl md:text-5xl lg:text-6xl"
                  variants={fadeInUp}
                >
                  {t("cases.list.title")}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                  variants={fadeInUp}
                >
                  {t("cases.list.description")}
                </motion.p>
              </motion.div>
            </Container>
          </section>
        )}

        <section className={isSingleProject ? "py-section" : "py-section"}>
          <Container>
            <div className="flex justify-center">
              <div className="grid gap-6 max-w-2xl w-full">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

