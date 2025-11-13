// Footer with contact info and quick links.
import Link from "next/link";
import type { Route } from "next";
import type { ReactElement } from "react";

import { Container } from "./container";

const CONTACT_LINKS: Array<{ readonly label: string; readonly href: string }> =
  [
    { label: "Email", href: "mailto:sayan@nanosudo.com" },
    { label: "Telegram", href: "https://t.me/sayanroor" },
    { label: "LinkedIn", href: "https://linkedin.com/in/sayanroor" },
    { label: "GitHub", href: "https://github.com/sayanroor" },
  ];

const QUICK_LINKS: Array<
  | { readonly label: string; readonly route: Route }
  | { readonly label: string; readonly href: string }
> = [
  { label: "Заполнить бриф", route: "/brief" as Route },
  { label: "Процесс", href: "#process" },
  { label: "Кейсы", href: "#portfolio" },
  { label: "Контакты", href: "#contact" },
];

const currentYear = new Date().getFullYear();

export function SiteFooter(): ReactElement {
  return (
    <div className="bg-surface/80 text-sm text-muted-foreground">
      <Container className="grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-lg font-heading text-foreground">
            Делаю веб-продукты, которые приносят результат.
          </p>
          <p className="max-w-md leading-relaxed">
            Алмата · GMT+5. Работаю с клиентами по всему миру. Настройка
            аналитики, Supabase, Brevo и Cloudflare под один адрес.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Быстрые ссылки
          </h3>
          <ul className="mt-4 grid gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={"route" in link ? link.route : link.href}>
                {"route" in link ? (
                  <Link
                    href={link.route}
                    className="transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div id="contact">
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Контакты
          </h3>
          <ul className="mt-4 grid gap-2">
            {CONTACT_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
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
