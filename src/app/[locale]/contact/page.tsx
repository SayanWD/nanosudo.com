'use client';

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
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

type ContactMethod = {
  readonly icon: typeof Mail;
  readonly labelKey: string;
  readonly descriptionKey: string;
  readonly link: string;
  readonly linkText: string;
  readonly isExternal?: boolean;
};

const contactMethods: readonly ContactMethod[] = [
  {
    icon: Mail,
    labelKey: "contact.methods.email.title",
    descriptionKey: "contact.methods.email.description",
    link: "mailto:sayan@nanosudo.com",
    linkText: "sayan@nanosudo.com",
    isExternal: true,
  },
  {
    icon: MessageCircle,
    labelKey: "contact.methods.telegram.title",
    descriptionKey: "contact.methods.telegram.description",
    link: "https://t.me/sayanroor",
    linkText: "@sayanroor",
    isExternal: true,
  },
] as const;

const workingHours: ReadonlyArray<{ readonly dayKey: string; readonly timeKey: string }> = [
  { dayKey: "contact.hours.weekdays.day", timeKey: "contact.hours.weekdays.time" },
  { dayKey: "contact.hours.saturday.day", timeKey: "contact.hours.saturday.time" },
  { dayKey: "contact.hours.sunday.day", timeKey: "contact.hours.sunday.time" },
] as const;

export default function ContactPage(): ReactElement {
  const t = useTranslations();

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
                {t("contact.hero.label")}
              </motion.p>
              <motion.h1
                className="font-heading text-4xl md:text-5xl lg:text-6xl"
                variants={fadeInUp}
              >
                {t("contact.hero.title")}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                {t("contact.hero.description")}
              </motion.p>
            </motion.div>
          </Container>
        </section>

        {/* Contact Methods */}
        <section className="py-section">
          <Container className="max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;

                return (
                  <motion.div
                    key={index}
                    className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/70 hover:shadow-lg"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                  >
                    {method.isExternal ? (
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block space-y-4 group"
                      >
                        <div className="rounded-xl bg-accent/10 p-3 w-fit">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-xl group-hover:text-accent transition-colors">
                            {t(method.labelKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(method.descriptionKey)}
                          </p>
                          <p className="text-sm font-medium text-accent">{method.linkText}</p>
                        </div>
                      </a>
                    ) : (
                      <Link
                        href={method.link as Route}
                        className="block space-y-4 group"
                      >
                        <div className="rounded-xl bg-accent/10 p-3 w-fit">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-xl group-hover:text-accent transition-colors">
                            {t(method.labelKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(method.descriptionKey)}
                          </p>
                          <p className="text-sm font-medium text-accent">{method.linkText}</p>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              {/* Location Card */}
              <motion.div
                className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <div className="space-y-4">
                  <div className="rounded-xl bg-accent/10 p-3 w-fit">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl">{t("contact.location.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("contact.location.description")}</p>
                    <p className="text-sm font-medium text-accent">{t("contact.location.details")}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              className="rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-surface/40 p-8 md:p-12 shadow-soft text-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div className="space-y-6 max-w-2xl mx-auto" variants={fadeInUp}>
                <div className="rounded-xl bg-accent p-3 w-fit mx-auto">
                  <Send className="w-7 h-7 text-accent-foreground" />
                </div>
                <div className="space-y-4">
                  <h2 className="font-heading text-3xl md:text-4xl">
                    {t("contact.cta.title")}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {t("contact.cta.description")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href={"/brief" as Route}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-semibold normal-case text-accent-foreground shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {t("contact.cta.button")}
                    <Send className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Working Hours & Info */}
        <section className="border-t border-border/60 py-section bg-surface/40">
          <Container className="max-w-4xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Working Hours */}
              <motion.div
                className="space-y-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div className="flex items-center gap-3" variants={fadeInUp}>
                  <div className="rounded-xl bg-accent/10 p-3">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl">{t("contact.hours.title")}</h2>
                </motion.div>
                <ul className="space-y-4">
                  {workingHours.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-4 rounded-xl border border-border/40 bg-surface/40 p-4"
                      variants={fadeInUp}
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{t(item.dayKey)}</p>
                        <p className="text-sm text-muted-foreground">{t(item.timeKey)}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                className="space-y-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 className="font-heading text-2xl md:text-3xl" variants={fadeInUp}>
                  {t("contact.next.title")}
                </motion.h2>
                <motion.div className="space-y-4 text-muted-foreground" variants={fadeInUp}>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{t("contact.next.points.responseTime")}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{t("contact.next.points.freeConsultation")}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{t("contact.next.points.worldwide")}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{t("contact.next.points.channels")}</span>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

