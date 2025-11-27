'use client';

// Footer with contact info and quick links.
import { type ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import {
  Github,
  Mail,
  Send,
  MessageCircle,
  Instagram,
  Linkedin,
  FileText,
  Briefcase,
  User,
  BookOpen,
  MessageSquare,
} from "lucide-react";

import { Container } from "./container";
import { useTheme } from "@/components/theme/theme-provider";

function FooterBrandColumn(): ReactElement {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = (mounted ? theme : "dark") ?? "dark";
  const logoSrc =
    resolvedTheme === "light"
      ? "/Nanosudo_logo_dark.png"
      : "/Nanosudo_logo_light.png";

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.55em] text-muted-foreground">
        NANOSUDO
      </p>
      <Link
        href="/"
        className="group inline-block rounded-2xl border border-border/40 bg-surface/60 p-4 transition hover:border-accent/50 hover:bg-surface/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label="Перейти на главную"
      >
        <Image
          src={logoSrc}
          alt="NanoSudo логотип"
          width={320}
          height={120}
          priority
          className="h-16 w-auto object-contain md:h-20"
          sizes="(max-width: 768px) 220px, 320px"
        />
      </Link>
    </div>
  );
}

const CONTACT_LINKS: Array<{
  readonly labelKey: string;
  readonly href: string;
  readonly icon: typeof Mail;
}> = [
    { labelKey: "common.footer.email", href: "mailto:roorsayan@gmail.com", icon: Mail },
    { labelKey: "common.footer.whatsapp", href: "https://wa.me/77478277485", icon: MessageCircle },
    { labelKey: "common.footer.telegram", href: "https://t.me/satoshi_iam", icon: Send },
    { labelKey: "common.footer.instagram", href: "https://instagram.com/satoshi_iam", icon: Instagram },
    { labelKey: "common.footer.linkedin", href: "https://www.linkedin.com/in/sayan-roor/", icon: Linkedin },
    { labelKey: "common.footer.github", href: "https://github.com/SayanWD", icon: Github },
  ];

const QUICK_LINKS: Array<{
  readonly labelKey: string;
  readonly href?: string;
  readonly route?: string;
  readonly icon: typeof FileText;
}> = [
    { labelKey: "common.footer.fillBrief", href: "/brief", icon: FileText },
    { labelKey: "common.nav.cases", route: "/cases", icon: Briefcase },
    { labelKey: "common.nav.about", route: "/about", icon: User },
    { labelKey: "common.nav.blog", route: "/blog", icon: BookOpen },
    { labelKey: "common.nav.contact", route: "/contact", icon: MessageSquare },
  ];

const currentYear = new Date().getFullYear();

export function SiteFooter(): ReactElement {
  const t = useTranslations();

  return (
    <div className="relative text-sm text-muted-foreground overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
        <div className="absolute inset-0">
          <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[#99b9ff] opacity-20 blur-3xl transition-opacity duration-1000 dark:opacity-10" />
          <div className="absolute -right-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-[#78ffd1] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8" />
          <div className="absolute -bottom-1/4 -left-1/4 h-[550px] w-[550px] rounded-full bg-[#ffb3c2] opacity-15 blur-3xl transition-opacity duration-1000 dark:opacity-8" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[450px] w-[450px] rounded-full bg-[#f0ffa6] opacity-12 blur-3xl transition-opacity duration-1000 dark:opacity-6" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <Container className="grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr] text-center md:text-left">
        <FooterBrandColumn />
        <div>
          <h3 className="text-xs font-semibold tracking-[0.28em] text-muted-foreground normal-case">
            {t("common.footer.quickLinks")}
          </h3>
          <ul className="mt-4 grid gap-2 justify-items-center md:justify-items-start">
            {QUICK_LINKS.map((link) => {
              const href = link.route ?? link.href;
              const isExternal = href?.startsWith('#') || href?.startsWith('http') || href === '/brief';
              const Icon = link.icon;

              return (
                <li key={href}>
                  {isExternal ? (
                    <a
                      href={href}
                      className="normal-case transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent inline-flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t(link.labelKey)}</span>
                    </a>
                  ) : (
                    <Link
                      href={href as "/cases" | "/about" | "/blog" | "/contact"}
                      className="normal-case transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent inline-flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t(link.labelKey)}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div id="contact">
          <h3 className="text-xs font-semibold tracking-[0.28em] text-muted-foreground normal-case">
            {t("common.footer.contacts")}
          </h3>
          <ul className="mt-4 grid gap-2 justify-items-center md:justify-items-start">
            {CONTACT_LINKS.map((link) => {
              const Icon = link.icon;
              if (link.labelKey === "common.footer.github") {
                return null;
              }
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="normal-case transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent inline-flex items-center gap-2"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(link.labelKey)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
      <div className="border-t border-border/70">
        <Container className="flex flex-col gap-3 py-6 text-xs text-muted-foreground text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-1 md:justify-start">
            <span>© {currentYear} Sayan Roor. Все права защищены.</span>
            <span>—</span>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-1 normal-case text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Политика конфиденциальности
            </Link>
          </div>
          <a
            href="https://github.com/SayanWD"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 normal-case text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface/80 px-2 py-0.5 text-[11px] leading-none">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Online
            </span>
          </a>
        </Container>
      </div>
    </div>
  );
}
