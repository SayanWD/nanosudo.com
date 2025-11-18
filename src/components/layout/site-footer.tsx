'use client';

// Footer with contact info and quick links.
import type { ReactElement } from "react";
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
  Settings
} from "lucide-react";

import { Container } from "./container";

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
  { labelKey: "common.footer.process", href: "#process", icon: Settings },
  { labelKey: "common.nav.cases", route: "/cases", icon: Briefcase },
  { labelKey: "common.nav.about", route: "/about", icon: User },
  { labelKey: "common.nav.blog", route: "/blog", icon: BookOpen },
  { labelKey: "common.nav.contact", route: "/contact", icon: MessageSquare },
];

const currentYear = new Date().getFullYear();

export function SiteFooter(): ReactElement {
  const t = useTranslations();
  
  return (
    <div className="bg-surface/80 text-sm text-muted-foreground">
      <Container className="grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-lg font-heading text-foreground">
            {t("footer.pitch.title")}
          </p>
          <p className="max-w-md leading-relaxed">
            {t("footer.pitch.description")}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.28em] text-muted-foreground normal-case">
            {t("common.footer.quickLinks")}
          </h3>
          <ul className="mt-4 grid gap-2">
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
          <ul className="mt-4 grid gap-2">
            {CONTACT_LINKS.map((link) => {
              const Icon = link.icon;
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
                    {link.href.includes("github.com") && link.href.includes("SayanWD") && (
                      <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface/80 px-2 py-0.5 text-[11px] leading-none">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                        {t("common.footer.status.online")}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
      <div className="border-t border-border/70">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {currentYear} Sayan Roor. Все права защищены.</span>
          <span>
            Core Web Vitals · Lighthouse 95/100 · Accessibility 100/100
          </span>
        </Container>
      </div>
    </div>
  );
}
