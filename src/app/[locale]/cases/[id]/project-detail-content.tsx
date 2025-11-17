'use client';

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Target, CheckCircle2, TrendingUp, Calendar, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { getTranslatedProject, type PortfolioProject } from "@/lib/portfolio-data";

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

type ProjectDetailContentProps = {
  readonly project: PortfolioProject;
};

export function ProjectDetailContent({ project }: ProjectDetailContentProps): ReactElement {
  const t = useTranslations();
  // Get translated project data
  const translatedProject = getTranslatedProject(project.id, t) ?? project;
  return (
    <>
      {/* Header with breadcrumb */}
      <section className="border-b border-border/60 py-8 bg-surface/40">
        <Container className="max-w-6xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
                <motion.div variants={fadeInUp} className="mb-8">
                  <Link
                    href={"/cases"}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    {t("cases.detail.backToCases")}
                  </Link>
                </motion.div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              {/* Main content */}
              <motion.div className="space-y-6" variants={fadeInUp}>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      {translatedProject.category}
                    </span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {translatedProject.year}
                    </span>
                  </div>
                  <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                    {translatedProject.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    {translatedProject.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {translatedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/60 bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              {translatedProject.url && (
                <motion.div variants={fadeInUp} className="lg:sticky lg:top-24">
                  <a
                    href={translatedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold normal-case text-accent-foreground shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {t("cases.detail.openProject")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Hero Image */}
      <section className="border-b border-border/60 py-section bg-gradient-to-b from-surface/20 to-background">
        <Container className="max-w-7xl">
          <motion.div
            className="relative aspect-video overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-accent/20 to-accent/5 shadow-soft"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <Image
              src={translatedProject.image}
              alt={translatedProject.imageAlt}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </Container>
      </section>

      {/* Content Sections */}
      <section className="py-section">
        <Container className="max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Goals */}
            {translatedProject.goals && translatedProject.goals.length > 0 && (
              <motion.div
                className="space-y-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div className="flex items-center gap-3 pb-2 border-b border-border/60" variants={fadeInUp}>
                  <div className="rounded-xl bg-accent/10 p-3">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                       <h2 className="font-heading text-2xl md:text-3xl">{t("cases.detail.goals")}</h2>
                </motion.div>
                     <ul className="space-y-4">
                  {translatedProject.goals.map((goal, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-4 rounded-xl border border-border/40 bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface/60"
                      variants={fadeInUp}
                    >
                      <div className="rounded-full bg-accent/10 p-1.5 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-foreground leading-relaxed">{goal}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tasks */}
            {translatedProject.tasks && translatedProject.tasks.length > 0 && (
              <motion.div
                className="space-y-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                     <motion.div className="flex items-center gap-3 pb-2 border-b border-border/60" variants={fadeInUp}>
                  <div className="rounded-xl bg-accent/10 p-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                       <h2 className="font-heading text-2xl md:text-3xl">{t("cases.detail.tasks")}</h2>
                </motion.div>
                <ul className="space-y-4">
                  {translatedProject.tasks.map((task, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-4 rounded-xl border border-border/40 bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface/60"
                      variants={fadeInUp}
                    >
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span className="text-foreground leading-relaxed">{task}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Results - Highlighted Section */}
          {translatedProject.results && translatedProject.results.length > 0 && (
            <motion.div
              className="mt-16 space-y-8 rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-surface/40 p-8 md:p-12 shadow-soft"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="flex items-center gap-4" variants={fadeInUp}>
                <div className="rounded-xl bg-accent p-3 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                       <h2 className="font-heading text-3xl md:text-4xl">{t("cases.detail.results")}</h2>
                       <p className="text-sm text-muted-foreground mt-1">{t("cases.detail.metricsSubtitle")}</p>
                </div>
              </motion.div>
              <ul className="grid gap-4 md:grid-cols-2">
                {translatedProject.results.map((result, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4 rounded-xl border border-accent/30 bg-surface/60 p-5 transition-all hover:border-accent/50 hover:bg-surface/80"
                    variants={fadeInUp}
                  >
                    <div className="rounded-full bg-accent/20 p-1.5 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed">{result}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Metrics */}
          {translatedProject.metrics && translatedProject.metrics.length > 0 && (
            <motion.div
              className="mt-16 space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                     <h2 className="font-heading text-2xl md:text-3xl mb-2">{t("cases.detail.keyMetrics")}</h2>
                     <p className="text-muted-foreground">{t("cases.detail.keyMetricsSubtitle")}</p>
              </motion.div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {translatedProject.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    className="rounded-2xl border border-border/60 bg-surface/80 p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                    variants={fadeInUp}
                  >
                    <p className="text-3xl md:text-4xl font-heading text-accent mb-2">
                      {metric.value}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation to other cases */}
          <motion.div
            className="mt-16 pt-12 border-t border-border/60"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
                 <Link
                   href={"/cases"}
                   className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                 >
                   <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                   {t("cases.detail.backToList")}
                 </Link>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

