'use client';

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { Code, GraduationCap, Briefcase, Award, FileText, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";

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

type TimelineItem = {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly icon: typeof Code;
  readonly pdfUrl?: string;
  readonly university?: string;
  readonly universityUrl?: string;
  readonly faculty?: string;
};

function PDFViewer({
  url,
  title,
  viewLabel,
  closeAriaLabel,
}: {
  readonly url: string;
  readonly title: string;
  readonly viewLabel: string;
  readonly closeAriaLabel: string;
}): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
      >
        <FileText className="w-4 h-4" />
        {viewLabel}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <div className="relative w-full h-full max-w-5xl max-h-[90vh] rounded-2xl border border-border/60 bg-surface/80 shadow-soft flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h3 className="font-heading text-lg">{title}</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-surface transition-colors"
            aria-label={closeAriaLabel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ 
  title, 
  items, 
  icon: Icon,
  pdfViewLabel,
  closeAriaLabel,
}: { 
  readonly title: string; 
  readonly items: readonly TimelineItem[]; 
  readonly icon: typeof Code;
  readonly pdfViewLabel: string;
  readonly closeAriaLabel: string;
}): ReactElement {
  return (
    <motion.section
      className="space-y-8"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <motion.div className="flex items-center gap-3 pb-4 border-b border-border/60" variants={fadeInUp}>
        <div className="rounded-xl bg-accent/10 p-3">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <h2 className="font-heading text-2xl md:text-3xl">{title}</h2>
      </motion.div>

      <div className="space-y-8">
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <motion.div
              key={index}
              className="relative pl-8 pb-8 border-l-2 border-border/60 last:border-l-0 last:pb-0"
              variants={fadeInUp}
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-background" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <ItemIcon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{item.year}</span>
                </div>
                <h3 className="font-heading text-xl">{item.title}</h3>
                {item.faculty && (
                  <p className="text-sm font-medium text-foreground">{item.faculty}</p>
                )}
                {item.university && (
                  <div>
                    {item.universityUrl ? (
                      <a
                        href={item.universityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium normal-case text-accent hover:text-accent/80 transition-colors"
                      >
                        {item.university}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium normal-case text-foreground">{item.university}</span>
                    )}
                  </div>
                )}
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                {item.pdfUrl && (
                  <PDFViewer url={item.pdfUrl} title={item.title} viewLabel={pdfViewLabel} closeAriaLabel={closeAriaLabel} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default function AboutPage(): ReactElement {
  const t = useTranslations();

  const education: readonly TimelineItem[] = [
    {
      year: '2013-2017',
      title: t('about.education.bachelor.title'),
      description: t('about.education.bachelor.description'),
      icon: GraduationCap,
      pdfUrl: '/documents/bachelor-diploma.pdf',
      university: t('about.education.bachelor.university'),
      universityUrl: 'https://ku.edu.kz/',
      faculty: t('about.education.bachelor.faculty'),
    },
    {
      year: '2018-2020',
      title: t('about.education.master.title'),
      description: t('about.education.master.description'),
      icon: GraduationCap,
      pdfUrl: '/documents/master-diploma.pdf',
      university: t('about.education.master.university'),
      universityUrl: 'https://ku.edu.kz/',
      faculty: t('about.education.master.faculty'),
    },
  ] as const;

  const experience: readonly TimelineItem[] = [
    {
      year: '2019-2021',
      title: t('about.experience.frontend.title'),
      description: t('about.experience.frontend.description'),
      icon: Code,
    },
    {
      year: '2021-2023',
      title: t('about.experience.fullstack.title'),
      description: t('about.experience.fullstack.description'),
      icon: Briefcase,
    },
    {
      year: '2024-настоящее время',
      title: t('about.experience.independent.title'),
      description: t('about.experience.independent.description'),
      icon: Award,
    },
  ] as const;

  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="border-b border-border/60 py-section bg-surface/40">
          <Container className="max-w-4xl">
            <motion.div
              className="space-y-8 text-balance text-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
                variants={fadeInUp}
              >
                {t('about.hero.label')}
              </motion.p>
              <motion.h1
                className="font-heading text-4xl md:text-5xl lg:text-6xl"
                variants={fadeInUp}
              >
                {t('about.hero.title')}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                {t('about.hero.description')}
              </motion.p>
            </motion.div>
          </Container>
        </section>

        {/* About Content */}
        <section className="py-section">
          <Container className="max-w-4xl">
            <div className="space-y-16">
              {/* Education & Experience Timeline */}
              <div className="grid gap-16 md:grid-cols-2">
                <TimelineSection
                  title={t('about.sections.education')}
                  items={education}
                  icon={GraduationCap}
                  pdfViewLabel={t('about.pdf.view')}
                  closeAriaLabel={t('about.pdf.close')}
                />
                <TimelineSection
                  title={t('about.sections.experience')}
                  items={experience}
                  icon={Briefcase}
                  pdfViewLabel={t('about.pdf.view')}
                  closeAriaLabel={t('about.pdf.close')}
                />
              </div>

              {/* Story Section */}
              <motion.section
                className="space-y-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div className="flex items-center gap-3 pb-4 border-b border-border/60" variants={fadeInUp}>
                  <div className="rounded-xl bg-accent/10 p-3">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl">{t('about.story.title')}</h2>
                </motion.div>
                <motion.div className="space-y-4 text-muted-foreground leading-relaxed" variants={fadeInUp}>
                  <p>
                    {t.rich('about.story.p1', {
                      kaz: (chunks) => (
                        <a
                          href="https://www.kazatomprom.kz/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold normal-case text-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
                        >
                          {chunks}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ),
                      alt: (chunks) => (
                        <a
                          href="https://www.altynalmas.kz/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold normal-case text-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
                        >
                          {chunks}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ),
                      sk: (chunks) => (
                        <a
                          href="https://sk.kz/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold normal-case text-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
                        >
                          {chunks}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ),
                    })}
                  </p>
                  <p>{t('about.story.p2')}</p>
                  <p>{t('about.story.p3')}</p>
                  <p className="pt-2 text-foreground font-medium">{t('about.story.p4')}</p>
                </motion.div>
              </motion.section>
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

