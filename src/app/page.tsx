import type { ReactElement } from "react";

import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";

function HeroSection(): ReactElement {
  return (
    <section className="py-section">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-center">
        <div className="space-y-8 text-balance">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Full-stack разработчик
          </p>
          <div className="space-y-6">
            <h1 className="font-heading">
              Разработка сайтов, которые приносят результат
            </h1>
            <p className="text-lg">
              Я Sayan Roor, full-stack разработчик из Алматы. Создаю лендинги,
              порталы и MVP, которые загружаются за секунды и приводят клиентов.
              Стек: Next.js 16, TypeScript, Supabase, Brevo, Cloudflare.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href="/brief"
            >
              Начать проект
            </a>
            <a
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href="#portfolio"
            >
              Портфолио
            </a>
          </div>
        </div>
        <aside className="space-y-6 rounded-2xl bg-surface p-6 shadow-soft lg:ml-auto">
          <dl className="grid gap-4">
            <div className="rounded-xl border border-border/70 bg-surface/60 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Core Web Vitals
              </dt>
              <dd className="mt-3 text-2xl font-heading text-foreground">
                LCP &lt; 2 c
              </dd>
              <p className="mt-1 text-xs text-muted-foreground">
                Производительность 95+ по Lighthouse.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface/60 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Проекты
              </dt>
              <dd className="mt-3 text-2xl font-heading text-foreground">
                20+ кейсов
              </dd>
              <p className="mt-1 text-xs text-muted-foreground">
                Никто не теряется: прозрачный процесс, еженедельные демо.
              </p>
            </div>
          </dl>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Настраиваю Supabase, Brevo и Cloudflare. Один подрядчик, закрывающий
            дизайн, разработку и деплой, без посредников.
          </p>
        </aside>
      </Container>
    </section>
  );
}

function ServicesSection(): ReactElement {
  const services: Array<{
    readonly title: string;
    readonly description: string;
    readonly deliverables: string;
  }> = [
    {
      title: "Лендинги и корпоративные сайты",
      description:
        "От прототипа до продакшена за 2–3 недели. SEO, аналитика, Core Web Vitals ≤ 2 c.",
      deliverables: "Hero, кейсы, формы, интеграции CRM",
    },
    {
      title: "MVP и SaaS-продукты",
      description:
        "Supabase + Next.js App Router. Адаптивные интерфейсы, email-триггеры, PDF отчеты.",
      deliverables: "Auth, дашборды, админка, webhooks",
    },
    {
      title: "E-commerce и интеграции",
      description:
        "Платежи, каталог, аналитика, Shopify/Stripe/Notion API. Готово к росту трафика.",
      deliverables: "Кастомный UI, API-интеграции, автоматизация",
    },
  ];

  return (
    <section id="services" className="border-t border-border/60 py-section">
      <Container className="space-y-10">
        <div className="space-y-4 text-balance text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            что я делаю
          </p>
          <h2 className="font-heading">Услуги под ваш бизнес</h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Подбираю стек под задачу, а не наоборот. Каждая итерация завершается
            измеримым результатом: быстрый деплой, KPI и итоговые материалы в
            Notion.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-surface/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent/70"
            >
              <div className="space-y-4">
                <h3 className="font-heading text-xl text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                {service.deliverables}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProcessSection(): ReactElement {
  const steps: Array<{
    readonly title: string;
    readonly summary: string;
    readonly timeline: string;
  }> = [
    {
      title: "Бриф",
      summary:
        "Вы заполняете анкету за 5 минут. Формализуем цели, сегменты и KPI.",
      timeline: "День 0–1",
    },
    {
      title: "Прототип",
      summary:
        "Интерактивный макет в Figma/коде. Согласовываем структуру и сценарии.",
      timeline: "День 2–4",
    },
    {
      title: "Разработка",
      summary:
        "Верстка, интеграции, Supabase, Brevo. Еженедельные демо и прозрачный трекинг.",
      timeline: "Неделя 1–3",
    },
    {
      title: "Запуск",
      summary:
        "Деплой на Vercel, настройка Cloudflare, аналитика, обучение команды.",
      timeline: "Неделя 3–4",
    },
  ];

  return (
    <section id="process" className="border-t border-border/60 py-section">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="space-y-4 text-balance">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            как работаем
          </p>
          <h2 className="font-heading">Процесс в 4 понятных шага</h2>
          <p className="text-lg text-muted-foreground">
            Все этапы фиксируются в Notion/Trello. Вы видите прогресс, материалы
            и комментарии в реальном времени.
          </p>
        </div>
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border/50 bg-surface/70 p-6 shadow-soft"
            >
              <span className="absolute left-6 top-6 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="ml-12 space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-heading text-xl text-foreground">
                    {step.title}
                  </h3>
                  <span className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {step.timeline}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{step.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function HighlightsSection(): ReactElement {
  const highlights: Array<{
    readonly title: string;
    readonly description: string;
  }> = [
    {
      title: "Доступность 100/100",
      description:
        "WCAG 2.1 AA, клавиатурная навигация и проверка axe DevTools без серьёзных ошибок.",
    },
    {
      title: "Supabase + Brevo",
      description:
        "Брифы в Supabase, HTML-письма через Brevo, PDF экспорт, RLS и rate limiting через Cloudflare.",
    },
    {
      title: "Прозрачность",
      description:
        "Статус проекта, чек-листы и отчётность доступны в личной Notion-странице клиента.",
    },
  ];

  return (
    <section id="portfolio" className="border-t border-border/60 py-section">
      <Container className="space-y-10">
        <div className="space-y-4 text-balance text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            качество и метрики
          </p>
          <h2 className="font-heading">Практика, а не слова</h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Кейсы с ROI, A/B тесты, рост конверсии и Core Web Vitals в зелёной
            зоне. Полное портфолио скоро появится здесь, пока доступно по
            запросу.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft"
            >
              <h3 className="font-heading text-lg text-foreground">
                {highlight.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-accent/40 bg-accent/10 p-6 text-balance shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            текущая доступность
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-sm text-accent-foreground">
            <span className="inline-flex items-center gap-2 font-heading text-base text-accent">
              <span className="inline-flex h-3 w-3 rounded-full bg-success"></span>
              Открыт для новых проектов · старт с декабря 2024
            </span>
            <a
              href="mailto:sayan@nanosudo.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              sayan@nanosudo.com
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function Home(): ReactElement {
  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <HighlightsSection />
      </main>
    </SiteShell>
  );
}
