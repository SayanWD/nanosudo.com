/**
 * Blog post data structure (locale-aware via mapper)
 */

import type { locales } from "@/i18n/config";

export type AppLocale = (typeof locales)[number];

export type BlogPost = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly excerpt: string;
  readonly content: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly publishedAt: string;
  readonly publishedLabel: string;
  readonly updatedAt?: string;
  readonly author: string;
  readonly tags: readonly string[];
  readonly category: string;
  readonly readingTime: number; // in minutes
  readonly featured?: boolean;
};

type BlogPostTranslations = {
  readonly title: Record<AppLocale, string>;
  readonly description: Record<AppLocale, string>;
  readonly excerpt: Record<AppLocale, string>;
  readonly content: Record<AppLocale, string>;
  readonly imageAlt: Record<AppLocale, string>;
  readonly category: Record<AppLocale, string>;
  readonly publishedLabel: Record<AppLocale, string>;
};

type BlogPostSource = {
  readonly slug: string;
  readonly image: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly author: string;
  readonly tags: readonly string[];
  readonly readingTime: number;
  readonly featured?: boolean;
  readonly translations: BlogPostTranslations;
};

export const BLOG_POSTS: readonly BlogPostSource[] = [
  {
    slug: "kz-developer-tender-checklist",
    image: "/need_developer_who.png",
    publishedAt: "2025-02-01",
    author: "Sayan Roor",
    tags: ["Kazakhstan", "Tenders", "Development", "Full-stack"],
    readingTime: 9,
    translations: {
      title: {
        ru: "Как выбрать разработчика в Казахстане: чек-лист для тендеров и прямых подрядчиков",
        en: "Choosing a developer in Kazakhstan: tender checklist for direct contractors",
        kk: "Қазақстанда әзірлеушіні қалай таңдау керек: тендерге арналған чек-лист",
      },
      description: {
        ru: "Разбираем критерии отбора подрядчика на казахстанском рынке: тендеры, KPI, Kaspi/1С интеграции и финансовые риски.",
        en: "A detailed checklist for selecting a full-stack vendor in Kazakhstan: tenders, KPIs, Kaspi/1C integrations and financial risks.",
        kk: "Қазақстанда әзірлеушіні таңдауға арналған толық чек-лист: тендер, KPI, Kaspi/1C интеграциялары және қаржылық тәуекелдер.",
      },
      excerpt: {
        ru: "16 критериев, которые я использую при оценке подрядчиков в Казахстане. Подойдёт отделу закупок, тендерным комиссиям и бизнесу, который нанимает напрямую.",
        en: "16 criteria I use when evaluating developers in Kazakhstan — suitable for procurement teams, tender committees and founders hiring directly.",
        kk: "Қазақстандағы әзірлеушілерді бағалау үшін қолданатын 16 критерийім — сатып алу бөлімдері мен тікелей жалдайтын бизнеске арналған.",
      },
      imageAlt: {
        ru: "Tender checklist Kazakhstan",
        en: "Tender checklist Kazakhstan",
        kk: "Тендер чек-листі Қазақстан",
      },
      category: {
        ru: "Разработка",
        en: "Development",
        kk: "Әзірлеу",
      },
      publishedLabel: {
        ru: "1 февраля 2025",
        en: "February 1, 2025",
        kk: "2025 ж. 1 ақпан",
      },
      content: {
        ru: `# Чек-лист для закупок и тендеров в Казахстане

> Регулярно участвую в тендерах B2B/B2G и часто помогаю клиентам оценивать подрядчиков. Ниже — чек-лист, который закрывает 90% рисков.

## 1. KPI, сроки и metrix
- Зафиксируйте KPI: LCP < 2 сек, конверсия, SLA по багфиксам.
- Убедитесь, что подрядчик умеет работать с KZT и локальными налогами (УСН/ИП).

## 2. Локальные интеграции
- Чётко указать: Kaspi API, 1С:Бухгалтерия, Халык, ККМ, ЭЦП (NCALayer), госуведомления.
- Спросите демо или ссылку на производство, где это уже работает.

## 3. Структура тендерного ТЗ
1. Бизнес-цель и метрики.
2. Ограничения (НПА, СТ РК, ГОСТ).
3. Требования к DevOps и средам.
4. График платежей (30-40-30, аванс, постоплата).

## 4. Финансовые риски
- Проверяйте BIN/ИП в eGov.
- Настоять на фиксированном бюджете + прозрачном change request.

## 5. Чем полезен прямой подрядчик
- Меньше накладных расходов (экономия 30–50%).
- Прямая коммуникация и быстрые итерации без менеджеров.
- Личная ответственность за код, RTO < 1 часа.

## Что ещё почитать
- [Интеграция Kaspi, 1С и CRM](/blog/kaspi-1c-crm-integration-case) — как выстроить middleware и синхронизировать заявки за 2 минуты.
- [Техническое задание для тендера](/blog/kz-tender-technical-spec-template) — готовый шаблон ТЗ и пример бюджета в тенге.

## Итог
> **Коротко:** проверяем KPI, финансы и интеграции до подписания договора, чтобы избежать сюрпризов.

- фиксируем метрики и SLA в договоре;
- оцениваем опыт с Kaspi/1С и локальными платежами;
- требуем прозрачный change-request и ответственного исполнителя.

---

➡️ **Готовы к такому же результату?** Заполните [бриф](/brief), и я вернусь с планом и оценкой в течение 24 часов.`,
        en: `# Tender checklist for Kazakhstan

> I often support procurement teams and founders when they evaluate vendors. This checklist consistently saves budgets in local tenders.

## 1. KPIs and timelines
- Fix KPIs: LCP < 2s, conversion target, SLA for bug fixes.
- Confirm the vendor can work with KZT billing, local taxes and official paperwork.

## 2. Local integrations
- Explicitly mention Kaspi API, 1C, Halyk acquiring, fiscal registers, NCALayer/EDS.
- Ask for a live reference where these integrations already work.

## 3. Tender-ready scope
1. Business goal and measurable metrics.
2. Compliance requirements (Kazakh regulations).
3. DevOps, environments, release pipeline.
4. Payment milestones (30-40-30 or similar).

## 4. Financial & legal due diligence
- Check BIN/IP status via eGov.
- Demand a transparent change request process.

## 5. Why hire directly
- No agency overhead (30–50% cheaper).
- Direct communication and faster iterations.
- Single responsible engineer for code + support.

## Recommended reading
- [Kaspi, 1C and CRM integration case study](/blog/kaspi-1c-crm-integration-case) — middleware architecture and measurable impact.
- [Tender technical spec template](/blog/kz-tender-technical-spec-template) — structure + budget example for public procurement.

## Takeaway
> **TL;DR:** define KPIs, check local integrations and make the vendor financially accountable before signing.

- capture KPIs + SLA in the contract;
- review Kaspi / 1C / payment experience;
- demand a clear change-request process and a single accountable engineer.

---

➡️ **Ready to start?** Fill out the [brief](/brief) and I’ll reply with scope and budget within 24 hours.`,
        kk: `# Қазақстандағы тендерлерге арналған чек-лист

> B2B және B2G тендерлеріне жиі қатысамын, сол себепті клиенттерге мердігер таңдау кезінде мына критерийлерді ұсынамын.

## 1. KPI және мерзімдер
- KPI-ды бекітіңіз: LCP < 2 сек, конверсия, багтарды түзетуге арналған SLA.
- Мердігер KZT-мен, жергілікті салық режимдерімен және құжаттармен жұмыс істей алуы тиіс.

## 2. Локалды интеграциялар
- Kaspi API, 1C, Halyk, ККМ, NCALayer талап етілетінін нақты жазыңыз.
- Бұрынғы жобалардың мысалын сұраңыз.

## 3. Тендерлік ТЗ құрылымы
1. Бизнес-мақсат және метрикалар.
2. Нормативтік талаптар (СТ РК, ГОСТ, НҚА).
3. DevOps және орта сипаттамасы.
4. Төлем графигі (30-40-30 және т.б.).

## 4. Қаржылық тексеру
- BIN/IP-ті eGov арқылы тексеріңіз.
- Change request процесін шартта бекітіңіз.

## 5. Неге тікелей мердігер тиімді
- Делдалдық шығындар жоқ (30–50% үнем).
- Коммуникация тікелей, итерациялар жылдам.
- Кодқа және қолдауға жеке жауапкершілік.

## Қосымша оқу
- [Kaspi, 1C және CRM интеграциясы](/blog/kaspi-1c-crm-integration-case) — автоматтандыру архитектурасы мен нәтижелері.
- [Тендерге арналған ТЗ шаблоны](/blog/kz-tender-technical-spec-template) — құрылым және бюджет мысалы.

## Қорытынды
> **Негізгі ой:** KPI, интеграция және қаржылық тәуекелдерді алдын ала тексеріңіз.

- шартта KPI және SLA бекітіңіз;
- Kaspi/1C интеграция тәжірибесін бағалаңыз;
- change-request пен жауапты адамды нақтылаңыз.

---

➡️ **Осындай нәтижеге дайынсыз ба?** [Брифті толтырыңыз](/brief), 24 сағат ішінде жоспар мен сметаны жіберемін.`,
      },
    },
  },
  {
    slug: "kz-tender-technical-spec-template",
    image: "/supabase-integration.jpg",
    publishedAt: "2025-01-10",
    author: "Sayan Roor",
    tags: ["Tender", "Technical Specification", "Goszakup", "Kazakhstan"],
    readingTime: 11,
    translations: {
      title: {
        ru: "Техническое задание для тендеров в Казахстане: шаблон + бюджет",
        en: "Technical specification for Kazakhstan tenders: template and budget",
        kk: "Қазақстандағы тендерлерге арналған техникалық тапсырма: шаблон және бюджет",
      },
      description: {
        ru: "Даю структуру ТЗ, пример бюджета и чек-лист подачи заявки для гос- и квазигос проектов.",
        en: "Structure, budget example and submission checklist for Kazakh government and quasi-government tenders.",
        kk: "Мемлекеттік және квазимемлекеттік жобаларға арналған ТЗ құрылымы, бюджет мысалы және өтінім чек-листі.",
      },
      excerpt: {
        ru: "Если вы участвуете в госзакупках по веб-проектам, это руководство поможет упаковать ТЗ так, чтобы комиссия не отклоняла заявку.",
        en: "If you participate in Kazakh public procurement for web projects, this guide shows how to package the technical spec so it passes the commission.",
        kk: "Веб-жобаларға арналған мемлекеттік сатып алуларға қатыссаңыз, бұл нұсқаулық ТЗ-ны комиссия қабылдайтындай етіп рәсімдеуге көмектеседі.",
      },
      imageAlt: {
        ru: "Техническое задание для тендера",
        en: "Tender technical specification",
        kk: "Тендерге арналған техникалық тапсырма",
      },
      category: {
        ru: "Интеграции",
        en: "Integrations",
        kk: "Интеграциялар",
      },
      publishedLabel: {
        ru: "10 января 2025",
        en: "January 10, 2025",
        kk: "2025 ж. 10 қаңтар",
      },
      content: {
        ru: `# ТЗ для тендеров Казахстана

## 1. Нормативная база
- Ссылайтесь на НПА: Закон РК «О госзакупках», приказы MIIR.
- Для квазигос нужно учитывать внутренние регламенты (Самрук-Казына, БРК).

## 2. Обязательные разделы ТЗ
1. **Цель и бизнес-показатели.** Например, LTV↑, автоматизация заявок.
2. **Функциональные требования.** В формате user stories или таблицы.
3. **Интеграции.** Kaspi, 1С, EDS, платежные шлюзы.
4. **Безопасность.** Резервное копирование, доступы, аудит.
5. **DevOps.** Среды, CICD, требования к коду (TS, no-any, eslint).
6. **Поддержка.** SLA, гарантия 6–12 месяцев.

## 3. Пример бюджета (KZT)
| Этап | Срок | Стоимость |
| --- | --- | --- |
| Discovery & ТЗ | 2 недели | 3 080 000 ₸ |
| Разработка (Front/Back) | 6 недель | 9 100 000 ₸ |
| Интеграции Kaspi/1C | 2 недели | 1 960 000 ₸ |
| Тестирование + запуск | 1 неделя | 1 190 000 ₸ |
| Итого | 11 недель | **15 330 000 ₸** |

## 4. Чек-лист подачи
- BIN, лицензии, портфолио с аналогами.
- План-график и ресурсы (team CV).
- Подтверждения по аналогичным проектам (рекомендации).
- Гарантийное письмо о соблюдении сроков.

## 5. Что приложить дополнительно
- Макеты/прототипы (Figma).
- ER-диаграммы, API контракты.
- RACI-матрица.

## Что ещё почитать
- [Чек-лист для выбора подрядчика](/blog/kz-developer-tender-checklist) — 16 критериев для закупок и тендеров.
- [Интеграция Kaspi, 1С и CRM](/blog/kaspi-1c-crm-integration-case) — как автоматизировать учёт и заказы.

## Итог
> **Коротко:** ТЗ должно связывать бизнес-цели, интеграции и бюджет в один документ.

- начинаем с KPI и бизнес-метрик, которые ждёт комиссия;
- описываем интеграции (Kaspi, 1С, платежи, ЭЦП) и DevOps-процессы;
- прикладываем макеты, RACI и гарантийные письма, чтобы снять вопросы.

Скачайте мой шаблон ТЗ и адаптируйте под проект — ускорит согласование и снимет вопросы комиссии.

---

➡️ **Нужно упаковать проект для тендера?** Заполните [бриф](/brief) и получите индивидуальный план и смету за 24 часа.`,
        en: `# Technical specification template for Kazakhstan tenders

## 1. Regulations
- Reference local laws: the Law on Public Procurement, MIIR orders.
- For quasi-state companies (Samruk-Kazyna, Baiterek) include internal regulations.

## 2. Mandatory sections
1. **Business goals & KPIs** (conversion growth, automation share).
2. **Functional scope** — user stories, tables, acceptance criteria.
3. **Integrations** — Kaspi, 1C, EDS, local payment providers.
4. **Security** — backups, access matrix, audit trail.
5. **DevOps** — environments, CI/CD, code standards.
6. **Support** — warranty 6–12 months, reaction SLA.

## 3. Budget example (KZT)
| Phase | Timeline | Cost |
| --- | --- | --- |
| Discovery & spec | 2 weeks | 3,080,000 ₸ |
| Development | 6 weeks | 9,100,000 ₸ |
| Integrations (Kaspi/1C) | 2 weeks | 1,960,000 ₸ |
| QA & launch | 1 week | 1,190,000 ₸ |
| **Total** | **11 weeks** | **15,330,000 ₸** |

## 4. Submission checklist
- BIN certificate, licenses, case studies.
- Project schedule + resource plan.
- Letters of recommendation / references.
- Warranty letter for timeline compliance.

## 5. Attachments
- Prototype or wireframes.
- ER diagrams, API contracts.
- RACI matrix.

## Read next
- [Tender checklist for Kazakhstan](/blog/kz-developer-tender-checklist) — 16 vendor selection criteria.
- [Kaspi, 1C and CRM integration case](/blog/kaspi-1c-crm-integration-case) — real automation results.

## Takeaway
> **TL;DR:** a winning spec links business KPIs, integrations and proof documents.

- lead with metrics (conversion, automation, SLA);
- detail integrations (Kaspi, 1C, payments, EDS) and DevOps expectations;
- attach prototypes, RACI and warranty letters to build trust.

Use this template, customize it and the tender committee will have fewer questions.

---

➡️ **Want help with the tender package?** Fill out the [brief](/brief) and I’ll send a tailored scope + budget within 24 hours.`,
        kk: `# Қазақстандағы тендерлерге арналған ТЗ шаблоны

## 1. Нормативтік негіз
- «Мемлекеттік сатып алу туралы» Заң, MIIR бұйрықтары.
- Самұрық-Қазына, Бәйтерек сияқты квазимемлекеттік ұйымдардың регламенттері.

## 2. Міндетті бөлімдер
1. **Бизнес-мақсат және KPI** (конверсия, автоматтандыру үлесі).
2. **Функционалдық талаптар** — user story немесе кесте.
3. **Интеграциялар** — Kaspi, 1C, ЭЦҚ, төлем провайдерлері.
4. **Қауіпсіздік** — резервтік көшіру, қолжетімділік, аудит.
5. **DevOps** — орталар, CI/CD, код стандарттары.
6. **Қолдау** — 6–12 ай кепілдік, SLA.

## 3. Бюджет мысалы (₸)
| Этап | Мерзім | Баға |
| --- | --- | --- |
| Discovery & ТЗ | 2 апта | 3 080 000 ₸ |
| Әзірлеу | 6 апта | 9 100 000 ₸ |
| Kaspi/1C интеграциялары | 2 апта | 1 960 000 ₸ |
| Тестілеу және іске қосу | 1 апта | 1 190 000 ₸ |
| **Барлығы** | **11 апта** | **15 330 000 ₸** |

## 4. Өтінімді тапсыру чек-листі
- BIN, лицензиялар, ұқсас жобалар.
- Жоба кестесі және ресурстар жоспары.
- Ұсыным хаттар.
- Мерзімді сақтау туралы кепілдік хат.

## 5. Қосымша материалдар
- Прототиптер немесе макеттер.
- ER диаграммалар, API келісімдері.
- RACI матрицасы.

## Қосымша оқу
- [Мердігер таңдау чек-листі](/blog/kz-developer-tender-checklist) — тендердегі негізгі критерийлер.
- [Kaspi, 1C және CRM интеграциясы](/blog/kaspi-1c-crm-integration-case) — автоматтандыру практикалық нәтижелері.

## Қорытынды
> **Қысқаша:** сапалы ТЗ бизнес мақсаттарын, интеграцияларды және дәлел құжаттарын біріктіреді.

- KPI мен SLA-ны нақты көрсетіңіз;
- Kaspi, 1C, төлем, ЭЦҚ интеграцияларын және DevOps талаптарын сипаттаңыз;
- Макет, RACI және кепілдік хаттарды қосыңыз.

Осы шаблонды өз жобаңызға бейімдеп, тендер комиссиясынан қосымша сұрақтар алмайсыз.

---

➡️ **Тендерге дайындалу керек пе?** [Брифті толтырыңыз](/brief), 24 сағат ішінде жоба жоспары мен бюджетін беремін.`,
      },
    },
  },
  {
    slug: "kaspi-1c-crm-integration-case",
    image: "/crm_integration.png",
    publishedAt: "2025-01-24",
    author: "Sayan Roor",
    tags: ["Kaspi", "1C", "CRM", "Automation", "Case study"],
    readingTime: 10,
    translations: {
      title: {
        ru: "Кейс: интеграция Kaspi, 1С и CRM для ускорения продаж",
        en: "Case study: Kaspi, 1C and CRM integration for faster sales",
        kk: "Кейс: Kaspi, 1C және CRM интеграциясы сату жылдамдығын арттыру үшін",
      },
      description: {
        ru: "Показываю архитектуру, API-слой и бизнес-результаты проекта, где объединили Kaspi Store, 1С и CRM за 4 недели.",
        en: "Architecture, API layer and business impact of a project that connected Kaspi Store, 1C and CRM in four weeks.",
        kk: "Kaspi Store, 1C және CRM жүйелерін төрт аптада біріктірген жобаның архитектурасы мен нәтижелері.",
      },
      excerpt: {
        ru: "Клиент: e-commerce в Алматы. Проблема — ручные заявки и разрозненные системы. Решение — единый middleware между Kaspi, 1С и CRM.",
        en: "Client: e-commerce in Almaty. Problem: manual orders and siloed systems. Solution: middleware that syncs Kaspi, 1C and CRM.",
        kk: "Клиент: Алматыдағы e-commerce. Мәселе: қолмен өңделетін тапсырыстар. Шешім: Kaspi, 1C және CRM-ді ортақ middleware арқылы біріктіру.",
      },
      imageAlt: {
        ru: "Интеграция Kaspi и 1C",
        en: "Kaspi and 1C integration",
        kk: "Kaspi және 1C интеграциясы",
      },
      category: {
        ru: "Интеграции",
        en: "Integrations",
        kk: "Интеграциялар",
      },
      publishedLabel: {
        ru: "24 января 2025",
        en: "January 24, 2025",
        kk: "2025 ж. 24 қаңтар",
      },
      content: {
        ru: `# Кейс по автоматизации с Kaspi и 1С

## Исходные данные
- E-commerce площадка в Алматы, 700+ SKU.
- Заказы приходили из Kaspi Store, CRM и Instagram — менеджеры дублировали всё в 1С руками.

## Цель проекта
1. Синхронизация заказов и оплат Kaspi → 1С → CRM.
2. Обновление остатков в реальном времени.
3. Авто-уведомления клиента (WhatsApp, email).

## Архитектура
\`\`\`
Kaspi API → Integration Layer (Nest.js + Supabase) → 1С + Bitrix24 CRM
\`\`\`
- Integration Layer подписывается на вебхуки Kaspi (orders, payments).
- 1С получает заказы через OData REST.
- CRM обновляется через Bitrix24 REST API.

## Технические детали
- Queue: Supabase Edge Functions + cron для ретраев.
- Безопасность: подписанные вебхуки, VPN канал с 1С.
- SLA: < 2 минут на синхронизацию.

## Результат
- 0 ручных переносов (экономия 30 часов/неделю).
- Ошибки в CRM ↓ на 92%.
- Время обработки заказа с 15 до 3 минут.

## Что важно учесть
1. Kaspi и 1С работают с разными кодировками — обязательно нормализовать.
2. Учитывать лимиты API Kaspi (5 запросов/сек).
3. Делать трассировку: logs + dashboard в Supabase Studio.

## Что ещё почитать
- [Чек-лист по выбору подрядчика в Казахстане](/blog/kz-developer-tender-checklist) — 16 критериев для закупок.
- [ТЗ для тендеров](/blog/kz-tender-technical-spec-template) — структура, бюджет и чек-лист подачи.

## Итог
> **Главное:** автоматизация через middleware окупается только при чётких SLA и наблюдаемости.

- фиксируем SLA для синхронизаций и уведомлений;
- контролируем кодировки/лимиты API ещё на этапе дизайна;
- подключаем мониторинг, чтобы команда поддержки видела ошибки в моменте.

Если нужен такой интеграционный слой, просто оставьте заявку — покажу демо.

---

➡️ **Хотите такую же интеграцию?** Заполните [бриф](/brief), и за 24 часа я пришлю архитектуру и бюджет.`,
        en: `# Case study: Kaspi, 1C and CRM integration

## Client background
- E-commerce retailer in Almaty, 700+ SKUs.
- Orders arrived from Kaspi Store, CRM and Instagram; managers retyped everything into 1C manually.

## Objectives
1. Sync orders/payments from Kaspi → 1C → CRM.
2. Real-time stock updates.
3. Automated customer notifications (WhatsApp/email).

## Architecture
\`\`\`
Kaspi API → Integration Layer (Nest.js + Supabase) → 1C + Bitrix24 CRM
\`\`\`
- The integration layer listens to Kaspi webhooks (orders, payments).
- 1C consumes the data via OData REST.
- Bitrix24 is updated through its REST API.

## Implementation highlights
- Queue/retry logic built on Supabase Edge Functions + scheduled cron.
- Security: signed webhooks, VPN tunnel with on-prem 1C.
- SLA: < 2 minutes from purchase to synced state.

## Results
- Eliminated manual copying (30 hours saved weekly).
- CRM errors decreased by 92%.
- Order processing time dropped from 15 to 3 minutes.

## Lessons learned
1. Kaspi and 1C expect different encodings — normalize early.
2. Respect Kaspi rate limits (5 req/sec) and plan batching.
3. Observability matters: structured logs + Supabase dashboards.

## More resources
- [Tender checklist for Kazakhstan](/blog/kz-developer-tender-checklist) — procurement criteria and risk mitigation.
- [Technical spec template](/blog/kz-tender-technical-spec-template) — ready-to-use structure with KZT budget.

## Wrap-up
> **TL;DR:** middleware works when you control latency, encoding and monitoring from day one.

- agree on SLA (<2 minutes) for every integration path;
- normalize data formats between Kaspi, 1C and CRM;
- instrument the pipeline with logs + dashboards so ops can react instantly.

Want a similar middleware? Let’s discuss your stack.

---

➡️ **Need a similar middleware?** Fill out the [brief](/brief) and I’ll send architecture + quote within 24 hours.`,
        kk: `# Kaspi, 1C және CRM интеграциясы туралы кейс

## Клиент туралы
- Алматыдағы e-commerce, 700+ SKU.
- Тапсырыстар Kaspi Store, CRM және Instagram-нан келіп, 1C-ке қолмен енгізілді.

## Жобаның мақсаты
1. Kaspi → 1C → CRM арасындағы тапсырыстар мен төлемдерді автоматты синхрондау.
2. Қойма қалдықтарын нақты уақыт режимінде жаңарту.
3. Клиентке автоматты хабарламалар (WhatsApp/email).

## Архитектура
\`\`\`
Kaspi API → Integration Layer (Nest.js + Supabase) → 1C + Bitrix24 CRM
\`\`\`
- Integration Layer Kaspi вебхуктарына жазылады.
- 1C деректерді OData REST арқылы алады.
- Bitrix24 REST API арқылы жаңарып отырады.

## Іске асыру ерекшеліктері
- Қайта жіберу логикасы Supabase Edge Functions + cron арқылы жасалды.
- Қауіпсіздік: қол қойылған вебхуктар, 1C-пен VPN туннель.
- SLA: сатып алудан кейін < 2 минут ішінде синхрондау.

## Нәтижелер
- Қолмен көшіру нөлге тең (аптасына 30 сағат үнем).
- CRM қателері 92% азайды.
- Тапсырысты өңдеу уақыты 15 минуттан 3 минутқа дейін қысқарды.

## Қорытындылар
1. Kaspi және 1C әртүрлі кодировкаларды қолданады — алдын ала нормализациялаңыз.
2. Kaspi API лимиттерін (5 сұрау/сек) ескеріңіз.
3. Бақылау: логтар және Supabase бақылау тақталары.

## Қосымша материалдар
- [Мердігер таңдау чек-листі](/blog/kz-developer-tender-checklist) — сатып алуларға арналған 16 критерий.
- [Тендерге арналған ТЗ шаблоны](/blog/kz-tender-technical-spec-template) — құрылым мен смета.

## Қорытынды
> **Бастысы:** middleware тек SLA, нормализация және мониторинг орнатылғанда тиімді.

- Синхрондау үшін SLA келісіңіз (< 2 минут);
- Kaspi, 1C және CRM арасындағы форматтарды біріздендіріңіз;
- Логтар мен бақылау тақталарын қосып, қолдау тобын хабардар етіңіз.

Осындай интеграциялық қабат керек болса, байланысыңыз.

---

➡️ **Ұқсас интеграция керек пе?** [Брифті толтырыңыз](/brief), 24 сағат ішінде архитектура мен сметаны беремін.`,
      },
    },
  },
  {
    slug: "nextjs-performance-optimization",
    image: "/nextjs-optimization.jpg",
    publishedAt: "2024-11-15",
    author: "Sayan Roor",
    tags: ["Next.js", "Performance", "Optimization", "TypeScript"],
    readingTime: 8,
    featured: true,
    translations: {
      title: {
        ru: "Оптимизация Next.js приложения: от 3 сек до 1.2 сек",
        en: "Next.js performance: from 3s to 1.2s",
        kk: "Next.js өнімділігі: 3 секундтан 1.2 секундқа дейін",
      },
      description: {
        ru: "Практические техники оптимизации Next.js приложений: code splitting, image optimization, SSR/SSG стратегии и мониторинг производительности.",
        en: "Practical techniques for optimizing Next.js apps: code splitting, image optimization, SSR/SSG strategies and performance monitoring.",
        kk: "Next.js қосымшаларын оңтайландыруға арналған практикалық тәсілдер: code splitting, суреттерді оңтайландыру, SSR/SSG стратегиялары және өнімділікті бақылау.",
      },
      excerpt: {
        ru: "Как я оптимизировал Next.js приложение и сократил время загрузки с 3 секунд до 1.2 сек. Практические техники и инструменты для production.",
        en: "How I optimized a Next.js app and reduced load time from 3 seconds to 1.2s. Practical production-ready techniques and tools.",
        kk: "Next.js қосымшасын қалай оңтайландырып, жүктеу уақытын 3 секундтан 1.2 секундқа дейін қысқарттым. Production‑ға дайын практикалық тәсілдер мен құралдар.",
      },
      imageAlt: {
        ru: "Next.js оптимизация производительности",
        en: "Next.js performance optimization",
        kk: "Next.js өнімділігін оңтайландыру",
      },
      category: {
        ru: "Разработка",
        en: "Development",
        kk: "Әзірлеу",
      },
      publishedLabel: {
        ru: "15 ноября 2024",
        en: "November 15, 2024",
        kk: "2024 ж. 15 қараша",
      },
      content: {
        ru: `# Оптимизация производительности Next.js

В этой статье я расскажу о техниках оптимизации, которые помогли сократить время загрузки приложения с 3 секунд до 1.2 сек.

## Проблема

Изначально приложение загружалось за 3+ секунды, что критично для конверсии. Нужно было оптимизировать.

## Решения

### 1. Code Splitting

Использование динамических импортов для разделения кода:

\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Загрузка...</div>,
  ssr: false,
});
\`\`\`

### 2. Image Optimization

Next.js Image компонент автоматически оптимизирует изображения:

\`\`\`tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>
\`\`\`

### 3. SSR vs SSG

Для статического контента используем SSG:

\`\`\`typescript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 3600, // ISR каждые 60 минут
  };
}
\`\`\`

## Результаты

- LCP: 1.2 сек (было 3.2 сек)
- FID: 50ms (было 200ms)
- CLS: 0.05 (было 0.15)
- PageSpeed Score: 96/100

## Выводы
> **Коротко:** сначала измеряем, потом оптимизируем критичные узкие места.

- фиксируем метрики (LCP/FID/CLS) до и после изменений;
- раскатываем code splitting и оптимизацию изображений;
- выбираем SSR/SSG исходя из сценария, чтобы не перегружать сервер.

Оптимизация производительности — это итеративный процесс. Начните с измерения, затем оптимизируйте критичные участки.`,
        en: `# Next.js performance optimization

In this article I’ll walk through the techniques that helped reduce page load time from 3 seconds down to 1.2s in a real Next.js project.

## The problem

Initially the app was loading in 3+ seconds, which is critical for conversion. We needed to improve performance without rewriting everything.

## Solutions

### 1. Code splitting

Use dynamic imports to split heavy components:

\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
\`\`\`

### 2. Image optimization

The Next.js \`Image\` component optimizes images out of the box:

\`\`\`tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>;
\`\`\`

### 3. SSR vs SSG

Use SSG for static content with incremental revalidation:

\`\`\`typescript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 3600, // ISR every 60 minutes
  };
}
\`\`\`

## Results

- LCP: 1.2s (was 3.2s)
- FID: 50ms (was 200ms)
- CLS: 0.05 (was 0.15)
- PageSpeed Score: 96/100

## Takeaways
> **TL;DR:** measure, prioritize bottlenecks, iterate.

- establish a performance baseline (LCP/FID/CLS);
- apply code splitting + optimized images for quick wins;
- choose SSR/SSG per use case to keep latency predictable.

Performance optimization is an iterative process. Start with measuring, then focus on the most critical bottlenecks.`,
        kk: `# Next.js өнімділігін оңтайландыру

Бұл мақалада Next.js жобасында жүктеу уақытын 3 секундтан 1.2 секундқа дейін қалай қысқартқаным туралы айтамын.

## Мәселе

Алғашында бет 3+ секундта жүктелді — конверсия үшін бұл қауіпті. Барлық кодты қайта жазбай, өнімділікті жақсарту қажет болды.

## Шешімдер

### 1. Code splitting

Ауыр компоненттерді динамикалық импорттау:

\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Жүктелуде...</div>,
  ssr: false,
});
\`\`\`

### 2. Суреттерді оңтайландыру

Next.js \`Image\` компоненті суреттерді автоматты түрде оңтайландырады:

\`\`\`tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>;
\`\`\`

### 3. SSR және SSG

Статикалық контент үшін SSG қолданамыз, ISR‑мен:

\`\`\`typescript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 3600, // ISR әр 60 минутта
  };
}
\`\`\`

## Нәтижелер

- LCP: 1.2 сек (бұрын 3.2 сек)
- FID: 50ms (бұрын 200ms)
- CLS: 0.05 (бұрын 0.15)
- PageSpeed Score: 96/100

## Қорытынды
> **Қысқаша:** алдымен өлшеу, кейін басты тар жерлерді түзету.

- LCP/FID/CLS көрсеткіштерін базалық деңгейде өлшеңіз;
- code splitting және суреттерді оңтайландыруды енгізіңіз;
- сценарийге қарай SSR немесе SSG таңдаңыз.

Өнімділікті оңтайландыру — итеративті процесс. Алдымен өлшеңіз, содан кейін ең маңызды тар орындарды жақсартыңыз.`,
      },
    },
  },
  {
    slug: "typescript-best-practices",
    image: "/typescript-practices.jpg",
    publishedAt: "2024-11-10",
    author: "Sayan Roor",
    tags: ["TypeScript", "Best Practices"],
    readingTime: 6,
    featured: true,
    translations: {
      title: {
        ru: "TypeScript: лучшие практики для production",
        en: "TypeScript: production best practices",
        kk: "TypeScript: production үшін үздік тәжірибелер",
      },
      description: {
        ru: "Практические советы по использованию TypeScript в production: типизация, утилиты, паттерны и распространенные ошибки.",
        en: "Practical tips for using TypeScript in production: typing, utilities, patterns and common pitfalls.",
        kk: "Production‑да TypeScript қолдануға арналған практикалық кеңестер: типтеу, утилиттер, паттерндер және жиі кездесетін қателер.",
      },
      excerpt: {
        ru: "Собрал лучшие практики TypeScript, которые использую в каждом проекте. Типизация, утилиты, паттерны и как избежать распространенных ошибок.",
        en: "A collection of TypeScript practices I use in every project: typing, utilities, patterns and how to avoid common mistakes.",
        kk: "Әр жобада қолданатын TypeScript тәжірибелерім: типтеу, утилиттер, паттерндер және жиі кездесетін қателерден қалай аулақ болу.",
      },
      imageAlt: {
        ru: "TypeScript лучшие практики",
        en: "TypeScript best practices",
        kk: "TypeScript үздік тәжірибелері",
      },
      category: {
        ru: "Разработка",
        en: "Development",
        kk: "Әзірлеу",
      },
      publishedLabel: {
        ru: "10 ноября 2024",
        en: "November 10, 2024",
        kk: "2024 ж. 10 қараша",
      },
      content: {
        ru: `# TypeScript: лучшие практики

TypeScript — мощный инструмент, но только при правильном использовании.

## 1. Строгая типизация

Избегайте \`any\`. Используйте \`unknown\` для неизвестных типов:

\`\`\`typescript
// ❌ Плохо
function processData(data: any) {
  return data.value;
}

// ✅ Хорошо
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
\`\`\`

## 2. Утилиты типов

Используйте встроенные утилиты:

\`\`\`typescript
type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
};

// Pick - выбрать поля
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - исключить поля
type UserWithoutEmail = Omit<User, 'email'>;

// Partial - все поля опциональны
type PartialUser = Partial<User>;
\`\`\`

## 3. Явные return types

Всегда указывайте возвращаемый тип:

\`\`\`typescript
// ✅ Хорошо
function getUser(id: string): Promise<User> {
  return fetchUser(id);
}
\`\`\`

## Выводы

TypeScript помогает писать более надежный код, но требует дисциплины. Следуйте этим практикам, и код станет чище и безопаснее.`,
        en: `# TypeScript: production best practices

TypeScript is powerful — but only when used deliberately.

## 1. Strict typing

Avoid \`any\`. Use \`unknown\` for values with unknown shape:

\`\`\`typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
\`\`\`

## 2. Type utilities

Leverage built‑in helpers:

\`\`\`typescript
type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
};

// Pick — select fields
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit — remove fields
type UserWithoutEmail = Omit<User, 'email'>;

// Partial — all fields optional
type PartialUser = Partial<User>;
\`\`\`

## 3. Explicit return types

Always declare what a function returns:

\`\`\`typescript
// ✅ Good
function getUser(id: string): Promise<User> {
  return fetchUser(id);
}
\`\`\`

## Takeaways

TypeScript helps write safer code but requires discipline. Follow these practices to keep your codebase clean and robust.`,
        kk: `# TypeScript: production үшін үздік тәжірибелер

TypeScript — өте қуатты құрал, бірақ оны саналы түрде қолдану маңызды.

## 1. Қатаң типтеу

\`any\` қолданудан аулақ болыңыз. Белгісіз мәндер үшін \`unknown\` пайдаланыңыз:

\`\`\`typescript
// ❌ Жаман
function processData(data: any) {
  return data.value;
}

// ✅ Жақсы
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
\`\`\`

## 2. Тип утилиттері

Құрал‑қораптағы утилиттерді қолданыңыз:

\`\`\`typescript
type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
};

// Pick — өрістерді таңдау
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit — өрістерді алып тастау
type UserWithoutEmail = Omit<User, 'email'>;

// Partial — барлық өрістер опционал
type PartialUser = Partial<User>;
\`\`\`

## 3. Явный return түрлері

Функция не қайтаратынын әрқашан көрсетіңіз:

\`\`\`typescript
// ✅ Жақсы
function getUser(id: string): Promise<User> {
  return fetchUser(id);
}
\`\`\`

## Қорытынды

TypeScript қауіпсіз код жазуға көмектеседі, бірақ тәртіпті қажет етеді. Осы тәжірибелерді ұстансаңыз, кодыңыз тазарақ және сенімдірек болады.`,
      },
    },
  },
  {
    slug: "supabase-integration-guide",
    image: "/build_fast_website.png",
    publishedAt: "2024-11-05",
    author: "Sayan Roor",
    tags: ["Supabase", "Next.js", "Backend", "Database"],
    readingTime: 10,
    featured: false,
    translations: {
      title: {
        ru: "Интеграция Supabase в Next.js: руководство",
        en: "Supabase integration in Next.js: a practical guide",
        kk: "Supabase‑ты Next.js‑ке интеграциялау: нұсқаулық",
      },
      description: {
        ru: "Пошаговое руководство по интеграции Supabase в Next.js приложение: аутентификация, база данных, real‑time подписки.",
        en: "Step‑by‑step guide to integrating Supabase into a Next.js app: auth, database, real‑time subscriptions.",
        kk: "Supabase‑ты Next.js қосымшасына интеграциялау жөніндегі қадамдық нұсқаулық: аутентификация, дерекқор, real‑time жазылымдар.",
      },
      excerpt: {
        ru: "Подробное руководство по интеграции Supabase в Next.js. Аутентификация, работа с базой данных, real‑time подписки и лучшие практики.",
        en: "Detailed guide to integrating Supabase with Next.js: authentication, database operations, real‑time subscriptions and best practices.",
        kk: "Supabase‑ты Next.js‑пен интеграциялау бойынша толық нұсқаулық: аутентификация, дерекқормен жұмыс, real‑time жазылымдар және үздік тәжірибелер.",
      },
      imageAlt: {
        ru: "Интеграция Supabase в Next.js",
        en: "Supabase integration in Next.js",
        kk: "Supabase‑ты Next.js‑ке интеграциялау",
      },
      category: {
        ru: "Интеграции",
        en: "Integrations",
        kk: "Интеграциялар",
      },
      publishedLabel: {
        ru: "5 ноября 2024",
        en: "November 5, 2024",
        kk: "2024 ж. 5 қараша",
      },
      content: {
        ru: `# Интеграция Supabase в Next.js

Supabase — отличная альтернатива Firebase с открытым исходным кодом.

## Установка

\`\`\`bash
pnpm add @supabase/supabase-js
\`\`\`

## Настройка клиента

\`\`\`typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
\`\`\`

## Аутентификация

\`\`\`typescript
// Вход
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Регистрация
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});
\`\`\`

## Работа с данными

\`\`\`typescript
// Получение данных
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true);

// Создание записи
const { data, error } = await supabase
  .from('posts')
  .insert({ title: 'New Post', content: '...' });
\`\`\`

## Выводы

Supabase предоставляет мощный backend без необходимости писать серверный код. Идеально для быстрой разработки.`,
        en: `# Supabase integration in Next.js

Supabase is an open‑source alternative to Firebase with a great developer experience.

## Installation

\`\`\`bash
pnpm add @supabase/supabase-js
\`\`\`

## Client setup

\`\`\`typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
\`\`\`

## Authentication

\`\`\`typescript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});
\`\`\`

## Working with data

\`\`\`typescript
// Fetch data
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true);

// Insert record
const { data, error } = await supabase
  .from('posts')
  .insert({ title: 'New Post', content: '...' });
\`\`\`

## Takeaways

Supabase gives you a powerful backend without writing your own server. Great for fast product delivery.`,
        kk: `# Supabase‑ты Next.js‑ке интеграциялау

Supabase — ашық бастапқы коды бар Firebase баламасы және әзірлеушілер үшін ыңғайлы платформа.

## Орнату

\`\`\`bash
pnpm add @supabase/supabase-js
\`\`\`

## Клиентті баптау

\`\`\`typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
\`\`\`

## Аутентификация

\`\`\`typescript
// Кіру
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Тіркелу
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});
\`\`\`

## Деректермен жұмыс

\`\`\`typescript
// Деректерді алу
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true);

// Жазба қосу
const { data, error } = await supabase
  .from('posts')
  .insert({ title: 'New Post', content: '...' });
\`\`\`

## Қорытынды

Supabase өз серверіңізді жазбай‑ақ қуатты backend ұсынады. Жобаларды тез іске қосуға өте ыңғайлы.`,
      },
    },
  },
  {
    slug: "nextjs-website-development-guide",
    image: "/nextjs-website.jpg",
    publishedAt: "2025-01-20",
    author: "Sayan Roor",
    tags: ["Next.js", "Web Development", "React", "TypeScript", "SEO"],
    readingTime: 12,
    featured: true,
    translations: {
      title: {
        ru: "Как создать быстрый сайт на Next.js: полное руководство",
        en: "How to build a fast Next.js website: complete guide",
        kk: "Next.js-те жылдам сайт қалай құруға болады: толық нұсқаулық",
      },
      description: {
        ru: "Пошаговое руководство по созданию современного сайта на Next.js с нуля. SSR, SSG, оптимизация производительности, SEO и лучшие практики для production.",
        en: "Step-by-step guide to building a modern Next.js website from scratch. SSR, SSG, performance optimization, SEO and production best practices.",
        kk: "Next.js-те заманауи сайтты нөлден құру бойынша қадамдық нұсқаулық. SSR, SSG, өнімділікті оңтайландыру, SEO және production үшін үздік тәжірибелер.",
      },
      excerpt: {
        ru: "Подробное руководство по созданию быстрого и SEO-оптимизированного сайта на Next.js. От настройки проекта до деплоя в production с лучшими практиками.",
        en: "Detailed guide to building a fast, SEO-optimized Next.js website. From project setup to production deployment with best practices.",
        kk: "Next.js-те жылдам, SEO-оңтайландырылған сайт құру бойынша толық нұсқаулық. Жобаны баптаудан production-ға дейін үздік тәжірибелермен.",
      },
      imageAlt: {
        ru: "Создание сайта на Next.js",
        en: "Next.js website development",
        kk: "Next.js-те сайт құру",
      },
      category: {
        ru: "Разработка",
        en: "Development",
        kk: "Әзірлеу",
      },
      publishedLabel: {
        ru: "20 января 2025",
        en: "January 20, 2025",
        kk: "2025 ж. 20 қаңтар",
      },
      content: {
        ru: `# Как создать быстрый сайт на Next.js: полное руководство

Next.js — один из самых популярных фреймворков для создания современных веб-приложений. В этой статье я расскажу, как создать быстрый, SEO-оптимизированный сайт на Next.js с нуля.

## Почему Next.js?

Next.js предоставляет множество преимуществ:

- **Server-Side Rendering (SSR)** — улучшает SEO и время первой загрузки
- **Static Site Generation (SSG)** — для максимальной производительности
- **Автоматическая оптимизация** — изображения, шрифты, код
- **Встроенный роутинг** — файловая система как маршрутизация
- **API Routes** — создание backend без отдельного сервера

## Начало работы

### Установка

\`\`\`bash
npx create-next-app@latest my-website --typescript --tailwind --app
cd my-website
\`\`\`

### Структура проекта

\`\`\`
src/
├── app/
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx         # Главная страница
│   ├── about/
│   │   └── page.tsx     # Страница "О нас"
│   └── api/
│       └── route.ts     # API endpoints
├── components/          # React компоненты
├── lib/                 # Утилиты
└── public/              # Статические файлы
\`\`\`

## Оптимизация производительности

### 1. Использование Image компонента

Next.js автоматически оптимизирует изображения:

\`\`\`tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority
      placeholder="blur"
    />
  );
}
\`\`\`

### 2. Code Splitting

Динамические импорты для разделения кода:

\`\`\`tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Загрузка...</div>,
  ssr: false,
});
\`\`\`

### 3. Static Generation для статических страниц

\`\`\`tsx
export async function generateStaticParams() {
  return [
    { slug: 'post-1' },
    { slug: 'post-2' },
  ];
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
\`\`\`

## SEO оптимизация

### Мета-теги

\`\`\`tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Мой сайт | Главная',
  description: 'Описание сайта для поисковых систем',
  openGraph: {
    title: 'Мой сайт',
    description: 'Описание',
    images: ['/og-image.jpg'],
  },
};
\`\`\`

### Структурированные данные

\`\`\`tsx
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Мой сайт',
    url: 'https://mysite.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Контент */}
    </>
  );
}
\`\`\`

## Деплой в production

### Vercel (рекомендуется)

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Vercel автоматически оптимизирует Next.js приложения и предоставляет:
- CDN для статических файлов
- Автоматический SSL
- Preview deployments
- Analytics

## Заключение

Next.js — мощный инструмент для создания быстрых и SEO-оптимизированных сайтов. Следуя этим практикам, вы создадите сайт, который будет быстро загружаться и хорошо ранжироваться в поисковых системах.

**Ключевые моменты:**
- Используйте SSG для статического контента
- Оптимизируйте изображения через Image компонент
- Настройте правильные мета-теги
- Добавьте структурированные данные
- Используйте code splitting для больших компонентов`,
        en: `# How to build a fast Next.js website: complete guide

Next.js is one of the most popular frameworks for building modern web applications. In this article, I'll show you how to create a fast, SEO-optimized Next.js website from scratch.

## Why Next.js?

Next.js provides many advantages:

- **Server-Side Rendering (SSR)** — improves SEO and first load time
- **Static Site Generation (SSG)** — for maximum performance
- **Automatic optimization** — images, fonts, code
- **Built-in routing** — file system as routing
- **API Routes** — create backend without separate server

## Getting started

### Installation

\`\`\`bash
npx create-next-app@latest my-website --typescript --tailwind --app
cd my-website
\`\`\`

### Project structure

\`\`\`
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx         # Home page
│   ├── about/
│   │   └── page.tsx     # About page
│   └── api/
│       └── route.ts     # API endpoints
├── components/          # React components
├── lib/                 # Utilities
└── public/              # Static files
\`\`\`

## Performance optimization

### 1. Using Image component

Next.js automatically optimizes images:

\`\`\`tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority
      placeholder="blur"
    />
  );
}
\`\`\`

### 2. Code splitting

Dynamic imports for code splitting:

\`\`\`tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
\`\`\`

### 3. Static generation for static pages

\`\`\`tsx
export async function generateStaticParams() {
  return [
    { slug: 'post-1' },
    { slug: 'post-2' },
  ];
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
\`\`\`

## SEO optimization

### Meta tags

\`\`\`tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Website | Home',
  description: 'Website description for search engines',
  openGraph: {
    title: 'My Website',
    description: 'Description',
    images: ['/og-image.jpg'],
  },
};
\`\`\`

### Structured data

\`\`\`tsx
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'My Website',
    url: 'https://mysite.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Content */}
    </>
  );
}
\`\`\`

## Production deployment

### Vercel (recommended)

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Vercel automatically optimizes Next.js apps and provides:
- CDN for static files
- Automatic SSL
- Preview deployments
- Analytics

## Conclusion

Next.js is a powerful tool for building fast, SEO-optimized websites. By following these practices, you'll create a site that loads quickly and ranks well in search engines.

**Key takeaways:**
- Use SSG for static content
- Optimize images via Image component
- Set up proper meta tags
- Add structured data
- Use code splitting for large components`,
        kk: `# Next.js-те жылдам сайт қалай құруға болады: толық нұсқаулық

Next.js — заманауи веб-қосымшалар құру үшін ең танымал фреймворктардың бірі. Бұл мақалада Next.js-те нөлден жылдам, SEO-оңтайландырылған сайт қалай құруға болатынын көрсетемін.

## Неге Next.js?

Next.js көптеген артықшылықтар береді:

- **Server-Side Rendering (SSR)** — SEO мен бірінші жүктеу уақытын жақсартады
- **Static Site Generation (SSG)** — максималды өнімділік үшін
- **Автоматты оңтайландыру** — суреттер, қаріптер, код
- **Кірістірілген роутинг** — файлдық жүйе маршрутизация ретінде
- **API Routes** — жеке серверсіз backend құру

## Жұмысты бастау

### Орнату

\`\`\`bash
npx create-next-app@latest my-website --typescript --tailwind --app
cd my-website
\`\`\`

### Жоба құрылымы

\`\`\`
src/
├── app/
│   ├── layout.tsx      # Түбірлік layout
│   ├── page.tsx         # Басты бет
│   ├── about/
│   │   └── page.tsx     # "Біз туралы" беті
│   └── api/
│       └── route.ts     # API endpoints
├── components/          # React компоненттері
├── lib/                 # Утилиттер
└── public/              # Статикалық файлдар
\`\`\`

## Өнімділікті оңтайландыру

### 1. Image компонентін қолдану

Next.js суреттерді автоматты түрде оңтайландырады:

\`\`\`tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority
      placeholder="blur"
    />
  );
}
\`\`\`

### 2. Code Splitting

Кодты бөлу үшін динамикалық импорттар:

\`\`\`tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Жүктелуде...</div>,
  ssr: false,
});
\`\`\`

### 3. Статикалық беттер үшін Static Generation

\`\`\`tsx
export async function generateStaticParams() {
  return [
    { slug: 'post-1' },
    { slug: 'post-2' },
  ];
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
\`\`\`

## SEO оңтайландыру

### Мета-тегтер

\`\`\`tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Менің сайтым | Басты',
  description: 'Іздеу жүйелері үшін сайт сипаттамасы',
  openGraph: {
    title: 'Менің сайтым',
    description: 'Сипаттама',
    images: ['/og-image.jpg'],
  },
};
\`\`\`

### Құрылымдалған деректер

\`\`\`tsx
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Менің сайтым',
    url: 'https://mysite.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Контент */}
    </>
  );
}
\`\`\`

## Production-ға деплой

### Vercel (ұсынылады)

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Vercel Next.js қосымшаларын автоматты түрде оңтайландырады және ұсынады:
- Статикалық файлдар үшін CDN
- Автоматты SSL
- Preview deployments
- Analytics

## Қорытынды

Next.js — жылдам, SEO-оңтайландырылған сайттар құру үшін қуатты құрал. Осы тәжірибелерді ұстансаңыз, жылдам жүктелетін және іздеу жүйелерінде жақсы рейтингте болатын сайт құрасыз.

**Негізгі нүктелер:**
- Статикалық контент үшін SSG қолданыңыз
- Image компоненті арқылы суреттерді оңтайландырыңыз
- Дұрыс мета-тегтерді баптаңыз
- Құрылымдалған деректерді қосыңыз
- Үлкен компоненттер үшін code splitting қолданыңыз`,
      },
    },
  },
  {
    slug: "1c-integration-web-application",
    image: "/1c-integration.jpg",
    publishedAt: "2025-01-18",
    author: "Sayan Roor",
    tags: ["1С", "Integration", "API", "Backend", "ERP"],
    readingTime: 15,
    featured: true,
    translations: {
      title: {
        ru: "Интеграция 1С с веб-приложением: практическое руководство",
        en: "1C integration with web application: practical guide",
        kk: "1С-ті веб-қосымшамен интеграциялау: практикалық нұсқаулық",
      },
      description: {
        ru: "Подробное руководство по интеграции 1С:Предприятие с веб-приложением через REST API, COM-соединение и веб-сервисы. Примеры кода, лучшие практики и решение типичных проблем.",
        en: "Detailed guide to integrating 1C:Enterprise with web applications via REST API, COM connection and web services. Code examples, best practices and common issues solutions.",
        kk: "1С:Кәсіпорынды REST API, COM байланысы және веб-сервистер арқылы веб-қосымшалармен интеграциялау бойынша толық нұсқаулық. Код мысалдары, үздік тәжірибелер және жиі кездесетін мәселелерді шешу.",
      },
      excerpt: {
        ru: "Как интегрировать 1С с веб-приложением на Next.js. REST API, COM-соединение, обмен данными, синхронизация и решение проблем интеграции.",
        en: "How to integrate 1C with Next.js web application. REST API, COM connection, data exchange, synchronization and integration issues resolution.",
        kk: "1С-ті Next.js веб-қосымшасымен қалай интеграциялауға болады. REST API, COM байланысы, деректер алмасуы, синхронизация және интеграция мәселелерін шешу.",
      },
      imageAlt: {
        ru: "Интеграция 1С с веб-приложением",
        en: "1C integration with web application",
        kk: "1С-ті веб-қосымшамен интеграциялау",
      },
      category: {
        ru: "Интеграции",
        en: "Integrations",
        kk: "Интеграциялар",
      },
      publishedLabel: {
        ru: "18 января 2025",
        en: "January 18, 2025",
        kk: "2025 ж. 18 қаңтар",
      },
      content: {
        ru: `# Интеграция 1С с веб-приложением: практическое руководство

Интеграция 1С:Предприятие с веб-приложениями — частая задача в бизнесе. В этой статье я расскажу о различных способах интеграции и покажу практические примеры.

## Способы интеграции 1С

### 1. REST API (HTTP-сервисы)

Самый современный и рекомендуемый способ. 1С предоставляет HTTP-сервисы для обмена данными.

**Настройка в 1С:**

\`\`\`bsl
// В конфигураторе создаем HTTP-сервис
// Обработчик запроса
Функция ОбработатьЗапрос(Запрос) Экспорт
    ПараметрыЗапроса = Запрос.ПараметрыЗапроса;

    Если Запрос.Метод = "GET" Тогда
        // Получение данных
        Возврат ПолучитьДанные(ПараметрыЗапроса);
    ИначеЕсли Запрос.Метод = "POST" Тогда
        // Создание/обновление данных
        Возврат СоздатьДанные(Запрос.ТелоКакСтроку());
    КонецЕсли;
КонецФункции
\`\`\`

**Интеграция в Next.js:**

\`\`\`typescript
// lib/1c-client.ts
export class OneCClient {
  private baseUrl: string;
  private credentials: string;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl;
    this.credentials = Buffer.from(\`\${username}:\${password}\`).toString('base64');
  }

  async getData(endpoint: string): Promise<unknown> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      headers: {
        'Authorization': \`Basic \${this.credentials}\`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(\`1C API error: \${response.statusText}\`);
    }

    return response.json();
  }

  async postData(endpoint: string, data: unknown): Promise<unknown> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${this.credentials}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(\`1C API error: \${response.statusText}\`);
    }

    return response.json();
  }
}
\`\`\`

### 2. COM-соединение

Для локальных интеграций можно использовать COM-соединение (только Windows).

\`\`\`typescript
// Требует Node.js на Windows
import { exec } from 'child_process';

// Использование через внешнюю программу или COM-объект
// Не рекомендуется для production
\`\`\`

### 3. Файловый обмен

Простой способ через обмен XML/JSON файлами.

\`\`\`typescript
// lib/1c-file-exchange.ts
import fs from 'fs';
import path from 'path';

export async function read1CExport(filePath: string): Promise<unknown> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function write1CImport(data: unknown, filePath: string): Promise<void> {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
\`\`\`

## Практический пример: синхронизация товаров

### API Route в Next.js

\`\`\`typescript
// app/api/1c/sync-products/route.ts
import { NextResponse } from 'next/server';
import { OneCClient } from '@/lib/1c-client';

const oneC = new OneCClient(
  process.env.ONE_C_BASE_URL!,
  process.env.ONE_C_USERNAME!,
  process.env.ONE_C_PASSWORD!,
);

export async function POST() {
  try {
    // Получаем товары из 1С
    const products = await oneC.getData('catalog/products');

    // Синхронизируем с базой данных
    // ... логика синхронизации

    return NextResponse.json({
      success: true,
      synced: products.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}
\`\`\`

## Обработка ошибок и повторные попытки

\`\`\`typescript
async function syncWithRetry(
  fn: () => Promise<unknown>,
  maxRetries = 3
): Promise<unknown> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
\`\`\`

## Безопасность

- Используйте HTTPS для всех запросов
- Храните credentials в переменных окружения
- Ограничьте доступ по IP
- Используйте токены вместо базовой аутентификации
- Логируйте все операции

## Заключение

Интеграция 1С с веб-приложением требует понимания архитектуры обеих систем. REST API — наиболее надежный и масштабируемый способ. Правильная обработка ошибок и безопасность критичны для production.`,
        en: `# 1C integration with web application: practical guide

Integrating 1C:Enterprise with web applications is a common business task. In this article, I'll cover different integration methods and show practical examples.

## 1C integration methods

### 1. REST API (HTTP services)

The most modern and recommended approach. 1C provides HTTP services for data exchange.

**Setup in 1C:**

\`\`\`bsl
// Create HTTP service in configurator
// Request handler
Function ProcessRequest(Request) Export
    RequestParams = Request.RequestParams;

    If Request.Method = "GET" Then
        // Get data
        Return GetData(RequestParams);
    ElseIf Request.Method = "POST" Then
        // Create/update data
        Return CreateData(Request.BodyAsString());
    EndIf;
EndFunction
\`\`\`

**Integration in Next.js:**

\`\`\`typescript
// lib/1c-client.ts
export class OneCClient {
  private baseUrl: string;
  private credentials: string;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl;
    this.credentials = Buffer.from(\`\${username}:\${password}\`).toString('base64');
  }

  async getData(endpoint: string): Promise<unknown> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      headers: {
        'Authorization': \`Basic \${this.credentials}\`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(\`1C API error: \${response.statusText}\`);
    }

    return response.json();
  }

  async postData(endpoint: string, data: unknown): Promise<unknown> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${this.credentials}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(\`1C API error: \${response.statusText}\`);
    }

    return response.json();
  }
}
\`\`\`

### 2. COM connection

For local integrations, COM connection can be used (Windows only).

\`\`\`typescript
// Requires Node.js on Windows
import { exec } from 'child_process';

// Usage via external program or COM object
// Not recommended for production
\`\`\`

### 3. File exchange

Simple method via XML/JSON file exchange.

\`\`\`typescript
// lib/1c-file-exchange.ts
import fs from 'fs';
import path from 'path';

export async function read1CExport(filePath: string): Promise<unknown> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function write1CImport(data: unknown, filePath: string): Promise<void> {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
\`\`\`

## Practical example: product synchronization

### API Route in Next.js

\`\`\`typescript
// app/api/1c/sync-products/route.ts
import { NextResponse } from 'next/server';
import { OneCClient } from '@/lib/1c-client';

const oneC = new OneCClient(
  process.env.ONE_C_BASE_URL!,
  process.env.ONE_C_USERNAME!,
  process.env.ONE_C_PASSWORD!,
);

export async function POST() {
  try {
    // Get products from 1C
    const products = await oneC.getData('catalog/products');

    // Sync with database
    // ... sync logic

    return NextResponse.json({
      success: true,
      synced: products.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}
\`\`\`

## Error handling and retries

\`\`\`typescript
async function syncWithRetry(
  fn: () => Promise<unknown>,
  maxRetries = 3
): Promise<unknown> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
\`\`\`

## Security

- Use HTTPS for all requests
- Store credentials in environment variables
- Limit access by IP
- Use tokens instead of basic authentication
- Log all operations

## Conclusion

Integrating 1C with web applications requires understanding both systems' architecture. REST API is the most reliable and scalable approach. Proper error handling and security are critical for production.`,
        kk: `# 1С-ті веб-қосымшамен интеграциялау: практикалық нұсқаулық

1С:Кәсіпорынды веб-қосымшалармен интеграциялау — бизнесте жиі кездесетін тапсырма. Бұл мақалада әртүрлі интеграция әдістерін қарастырып, практикалық мысалдар көрсетемін.

## 1С интеграция әдістері

### 1. REST API (HTTP-сервистер)

Ең заманауи және ұсынылатын әдіс. 1С деректер алмасуы үшін HTTP-сервистер ұсынады.

**1С-те баптау:**

\`\`\`bsl
// Конфигураторда HTTP-сервис құру
// Сұрау өңдеушісі
Функция СұраудыӨңдеу(Сұрау) Экспорт
    СұрауПараметрлері = Сұрау.СұрауПараметрлері;

    Егер Сұрау.Әдіс = "GET" Онда
        // Деректерді алу
        Қайтару ДеректердіАлу(СұрауПараметрлері);
    Ал Егер Сұрау.Әдіс = "POST" Онда
        // Деректерді құру/жаңарту
        Қайтару ДеректердіҚұру(Сұрау.ДенесіСызықТүрінде());
    СоңыЕгер;
СоңыФункция
\`\`\`

**Next.js-те интеграция:**

\`\`\`typescript
// lib/1c-client.ts
export class OneCClient {
  private baseUrl: string;
  private credentials: string;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl;
    this.credentials = Buffer.from(\`\${username}:\${password}\`).toString('base64');
  }

  async getData(endpoint: string): Promise<unknown> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      headers: {
        'Authorization': \`Basic \${this.credentials}\`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(\`1C API error: \${response.statusText}\`);
    }

    return response.json();
  }

  async postData(endpoint: string, data: unknown): Promise<unknown> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${this.credentials}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(\`1C API error: \${response.statusText}\`);
    }

    return response.json();
  }
}
\`\`\`

### 2. COM байланысы

Жергілікті интеграциялар үшін COM байланысын қолдануға болады (тек Windows).

\`\`\`typescript
// Windows-та Node.js қажет
import { exec } from 'child_process';

// Сыртқы бағдарлама немесе COM-объект арқылы қолдану
// Production үшін ұсынылмайды
\`\`\`

### 3. Файлдық алмасу

XML/JSON файлдары арқылы қарапайым әдіс.

\`\`\`typescript
// lib/1c-file-exchange.ts
import fs from 'fs';
import path from 'path';

export async function read1CExport(filePath: string): Promise<unknown> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function write1CImport(data: unknown, filePath: string): Promise<void> {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
\`\`\`

## Практикалық мысал: тауарларды синхронизациялау

### Next.js-те API Route

\`\`\`typescript
// app/api/1c/sync-products/route.ts
import { NextResponse } from 'next/server';
import { OneCClient } from '@/lib/1c-client';

const oneC = new OneCClient(
  process.env.ONE_C_BASE_URL!,
  process.env.ONE_C_USERNAME!,
  process.env.ONE_C_PASSWORD!,
);

export async function POST() {
  try {
    // 1С-тен тауарларды алу
    const products = await oneC.getData('catalog/products');

    // Дерекқормен синхронизациялау
    // ... синхронизация логикасы

    return NextResponse.json({
      success: true,
      synced: products.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}
\`\`\`

## Қателерді өңдеу және қайталау

\`\`\`typescript
async function syncWithRetry(
  fn: () => Promise<unknown>,
  maxRetries = 3
): Promise<unknown> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
\`\`\`

## Қауіпсіздік

- Барлық сұраулар үшін HTTPS қолданыңыз
- Credentials-терді орта айнымалыларында сақтаңыз
- IP бойынша қолжетімділікті шектеңіз
- Негізгі аутентификация орнына токендерді қолданыңыз
- Барлық операцияларды журналдаңыз

## Қорытынды

1С-ті веб-қосымшалармен интеграциялау екі жүйенің де архитектурасын түсінуді қажет етеді. REST API — ең сенімді және масштабталатын әдіс. Дұрыс қателерді өңдеу және қауіпсіздік production үшін маңызды.`,
      },
    },
  },
  {
    slug: "website-conversion-optimization",
    image: "/conversion-optimization.jpg",
    publishedAt: "2025-01-15",
    author: "Sayan Roor",
    tags: ["Conversion", "UX", "Marketing", "Analytics", "A/B Testing"],
    readingTime: 14,
    featured: true,
    translations: {
      title: {
        ru: "Оптимизация конверсии веб-сайта: практические методы",
        en: "Website conversion optimization: practical methods",
        kk: "Веб-сайт конверсиясын оңтайландыру: практикалық әдістер",
      },
      description: {
        ru: "Практическое руководство по увеличению конверсии веб-сайта. A/B тестирование, UX оптимизация, работа с формами, психология продаж и аналитика.",
        en: "Practical guide to increasing website conversion. A/B testing, UX optimization, form handling, sales psychology and analytics.",
        kk: "Веб-сайт конверсиясын арттыру бойынша практикалық нұсқаулық. A/B тестілеу, UX оңтайландыру, формалармен жұмыс, сату психологиясы және аналитика.",
      },
      excerpt: {
        ru: "Как увеличить конверсию сайта на 30-50%. Практические методы оптимизации: формы, CTA, UX, A/B тестирование и работа с возражениями.",
        en: "How to increase website conversion by 30-50%. Practical optimization methods: forms, CTAs, UX, A/B testing and objection handling.",
        kk: "Сайт конверсиясын 30-50% қалай арттыруға болады. Практикалық оңтайландыру әдістері: формалар, CTA, UX, A/B тестілеу және наразылықтармен жұмыс.",
      },
      imageAlt: {
        ru: "Оптимизация конверсии веб-сайта",
        en: "Website conversion optimization",
        kk: "Веб-сайт конверсиясын оңтайландыру",
      },
      category: {
        ru: "Разработка",
        en: "Development",
        kk: "Әзірлеу",
      },
      publishedLabel: {
        ru: "15 января 2025",
        en: "January 15, 2025",
        kk: "2025 ж. 15 қаңтар",
      },
      content: {
        ru: `# Оптимизация конверсии веб-сайта: практические методы

Конверсия — ключевой показатель эффективности веб-сайта. В этой статье я расскажу о практических методах увеличения конверсии на основе реального опыта.

## Что такое конверсия?

Конверсия — это процент посетителей, которые выполнили целевое действие (покупка, заявка, регистрация).

**Формула:** Конверсия = (Целевые действия / Всего посетителей) × 100%

## Методы оптимизации

### 1. Оптимизация форм

**Проблемы типичных форм:**
- Слишком много полей
- Неясные инструкции
- Отсутствие социального доказательства
- Нет прогресс-индикатора

**Решения:**

\`\`\`tsx
// Оптимизированная форма
export function ContactForm() {
  return (
    <form className="space-y-4">
      {/* Минимум полей */}
      <input
        type="text"
        placeholder="Ваше имя"
        required
        aria-label="Имя"
      />
      <input
        type="email"
        placeholder="Email"
        required
        aria-label="Email"
      />

      {/* Социальное доказательство */}
      <p className="text-sm text-muted-foreground">
        ✓ Более 100 довольных клиентов
      </p>

      {/* Четкий CTA */}
      <button type="submit" className="w-full">
        Получить консультацию бесплатно
      </button>

      {/* Гарантия конфиденциальности */}
      <p className="text-xs text-muted-foreground">
        Ваши данные защищены
      </p>
    </form>
  );
}
\`\`\`

### 2. Оптимизация CTA (Call-to-Action)

**Принципы эффективных CTA:**

- **Конкретность:** "Получить расчет" вместо "Узнать больше"
- **Срочность:** "Заказать сегодня" вместо "Заказать"
- **Выгода:** "Сэкономить 30%" вместо "Купить"
- **Визуальное выделение:** Контрастный цвет, достаточный размер

### 3. A/B тестирование

\`\`\`typescript
// Пример A/B теста заголовка
export function HeroSection() {
  const variant = useABTest('hero-title', ['A', 'B']);

  const titles = {
    A: 'Создаем сайты, которые продают',
    B: 'Веб-сайты с гарантией конверсии',
  };

  return (
    <h1>{titles[variant]}</h1>
  );
}
\`\`\`

### 4. Улучшение UX

**Ключевые принципы:**

- **Скорость загрузки:** Оптимизация изображений, code splitting
- **Мобильная адаптация:** Mobile-first подход
- **Простота навигации:** Понятная структура, хлебные крошки
- **Обратная связь:** Индикаторы загрузки, сообщения об успехе

### 5. Работа с возражениями

**Типичные возражения и ответы:**

- "Дорого" → Показать ROI, рассрочку, сравнение с конкурентами
- "Не уверен" → Отзывы, кейсы, гарантии
- "Нет времени" → Подчеркнуть экономию времени в будущем

## Аналитика и метрики

### Ключевые метрики:

- **Conversion Rate** — основной показатель
- **Bounce Rate** — процент ушедших без действий
- **Time on Page** — время на сайте
- **Click-Through Rate** — процент кликов по CTA

### Инструменты:

- Google Analytics
- Hotjar (heatmaps)
- Google Optimize (A/B тесты)
- Vercel Analytics

## Практический пример

**До оптимизации:**
- Конверсия: 2.1%
- Средний чек: 70,000₸
- Заявок в месяц: 21

**После оптимизации:**
- Конверсия: 3.5% (+67%)
- Средний чек: 70,000₸
- Заявок в месяц: 35 (+67%)

**Результат:** Увеличение выручки на 67% без изменения трафика.

## Заключение

Оптимизация конверсии — итеративный процесс. Начните с анализа текущих показателей, проведите A/B тесты, улучшите UX и постоянно измеряйте результаты.

**Ключевые принципы:**
- Минимизируйте трение (friction)
- Максимизируйте ценность предложения
- Используйте социальное доказательство
- Тестируйте гипотезы
- Измеряйте все изменения`,
        en: `# Website conversion optimization: practical methods

Conversion is the key metric for website effectiveness. In this article, I'll share practical methods to increase conversion based on real experience.

## What is conversion?

Conversion is the percentage of visitors who completed a target action (purchase, form submission, registration).

**Formula:** Conversion = (Target actions / Total visitors) × 100%

## Optimization methods

### 1. Form optimization

**Common form problems:**
- Too many fields
- Unclear instructions
- Lack of social proof
- No progress indicator

**Solutions:**

\`\`\`tsx
// Optimized form
export function ContactForm() {
  return (
    <form className="space-y-4">
      {/* Minimum fields */}
      <input
        type="text"
        placeholder="Your name"
        required
        aria-label="Name"
      />
      <input
        type="email"
        placeholder="Email"
        required
        aria-label="Email"
      />

      {/* Social proof */}
      <p className="text-sm text-muted-foreground">
        ✓ Over 100 satisfied clients
      </p>

      {/* Clear CTA */}
      <button type="submit" className="w-full">
        Get free consultation
      </button>

      {/* Privacy guarantee */}
      <p className="text-xs text-muted-foreground">
        Your data is protected
      </p>
    </form>
  );
}
\`\`\`

### 2. CTA optimization

**Effective CTA principles:**

- **Specificity:** "Get quote" instead of "Learn more"
- **Urgency:** "Order today" instead of "Order"
- **Benefit:** "Save 30%" instead of "Buy"
- **Visual prominence:** Contrasting color, sufficient size

### 3. A/B testing

\`\`\`typescript
// Example A/B test for headline
export function HeroSection() {
  const variant = useABTest('hero-title', ['A', 'B']);

  const titles = {
    A: 'We build websites that sell',
    B: 'Websites with conversion guarantee',
  };

  return (
    <h1>{titles[variant]}</h1>
  );
}
\`\`\`

### 4. UX improvements

**Key principles:**

- **Load speed:** Image optimization, code splitting
- **Mobile adaptation:** Mobile-first approach
- **Simple navigation:** Clear structure, breadcrumbs
- **Feedback:** Loading indicators, success messages

### 5. Handling objections

**Common objections and responses:**

- "Too expensive" → Show ROI, payment plans, competitor comparison
- "Not sure" → Reviews, case studies, guarantees
- "No time" → Emphasize future time savings

## Analytics and metrics

### Key metrics:

- **Conversion Rate** — primary metric
- **Bounce Rate** — percentage leaving without action
- **Time on Page** — time spent on site
- **Click-Through Rate** — CTA click percentage

### Tools:

- Google Analytics
- Hotjar (heatmaps)
- Google Optimize (A/B tests)
- Vercel Analytics

## Practical example

**Before optimization:**
- Conversion: 2.1%
- Average order: $700
- Monthly leads: 21

**After optimization:**
- Conversion: 3.5% (+67%)
- Average order: $700
- Monthly leads: 35 (+67%)

**Result:** 67% revenue increase without traffic changes.

## Conclusion

Conversion optimization is an iterative process. Start by analyzing current metrics, run A/B tests, improve UX and constantly measure results.

**Key principles:**
- Minimize friction
- Maximize offer value
- Use social proof
- Test hypotheses
- Measure all changes`,
        kk: `# Веб-сайт конверсиясын оңтайландыру: практикалық әдістер

Конверсия — веб-сайт тиімділігінің негізгі көрсеткіші. Бұл мақалада нақты тәжірибеге негізделген конверсияны арттырудың практикалық әдістерін бөлісемін.

## Конверсия дегеніміз не?

Конверсия — мақсатты әрекетті орындаған қонақтардың пайызы (сатып алу, форма толтыру, тіркелу).

**Формула:** Конверсия = (Мақсатты әрекеттер / Барлық қонақтар) × 100%

## Оңтайландыру әдістері

### 1. Формаларды оңтайландыру

**Типтік формалардың мәселелері:**
- Тым көп өрістер
- Түсініксіз нұсқаулар
- Әлеуметтік дәлелдердің жоқтығы
- Прогресс көрсеткішінің жоқтығы

**Шешімдер:**

\`\`\`tsx
// Оңтайландырылған форма
export function ContactForm() {
  return (
    <form className="space-y-4">
      {/* Минималды өрістер */}
      <input
        type="text"
        placeholder="Сіздің атыңыз"
        required
        aria-label="Аты"
      />
      <input
        type="email"
        placeholder="Email"
        required
        aria-label="Email"
      />

      {/* Әлеуметтік дәлел */}
      <p className="text-sm text-muted-foreground">
        ✓ 100-ден астам қанағаттанған клиенттер
      </p>

      {/* Анық CTA */}
      <button type="submit" className="w-full">
        Тегін консультация алу
      </button>

      {/* Құпиялылық кепілдігі */}
      <p className="text-xs text-muted-foreground">
        Сіздің деректеріңіз қорғалған
      </p>
    </form>
  );
}
\`\`\`

### 2. CTA оңтайландыру

**Тиімді CTA принциптері:**

- **Нақтылық:** "Есептеу алу" орнына "Көбірек білу"
- **Шұғылдық:** "Бүгін тапсырыс беру" орнына "Тапсырыс беру"
- **Пайда:** "30% үнемдеу" орнына "Сатып алу"
- **Көрнекі ерекшелену:** Контрастты түс, жеткілікті өлшем

### 3. A/B тестілеу

\`\`\`typescript
// Тақырыптың A/B тестінің мысалы
export function HeroSection() {
  const variant = useABTest('hero-title', ['A', 'B']);

  const titles = {
    A: 'Сататын сайттар құрамыз',
    B: 'Конверсия кепілдігімен веб-сайттар',
  };

  return (
    <h1>{titles[variant]}</h1>
  );
}
\`\`\`

### 4. UX жақсарту

**Негізгі принциптер:**

- **Жүктеу жылдамдығы:** Суреттерді оңтайландыру, code splitting
- **Мобильді бейімдеу:** Mobile-first тәсіл
- **Қарапайым навигация:** Түсінікті құрылым, breadcrumbs
- **Кері байланыс:** Жүктеу көрсеткіштері, сәттілік хабарламалары

### 5. Наразылықтармен жұмыс

**Типтік наразылықтар және жауаптар:**

- "Қымбат" → ROI көрсету, бөліп төлеу, бәсекелестермен салыстыру
- "Сенімсіз" → Пікірлер, кейстер, кепілдіктер
- "Уақыт жоқ" → Болашақта уақыт үнемдеуін атап өту

## Аналитика және метрикалар

### Негізгі метрикалар:

- **Conversion Rate** — негізгі көрсеткіш
- **Bounce Rate** — әрекетсіз кеткендердің пайызы
- **Time on Page** — сайттағы уақыт
- **Click-Through Rate** — CTA бойынша кликтердің пайызы

### Құралдар:

- Google Analytics
- Hotjar (heatmaps)
- Google Optimize (A/B тесттер)
- Vercel Analytics

## Практикалық мысал

**Оңтайландыруға дейін:**
- Конверсия: 2.1%
- Орташа чек: 70,000₸
- Айына өтініштер: 21

**Оңтайландырудан кейін:**
- Конверсия: 3.5% (+67%)
- Орташа чек: 70,000₸
- Айына өтініштер: 35 (+67%)

**Нәтиже:** Трафикті өзгертпей, кірісті 67% арттыру.

## Қорытынды

Конверсияны оңтайландыру — итеративті процесс. Ағымдағы көрсеткіштерді талдаудан бастаңыз, A/B тесттерін өткізіңіз, UX-ті жақсартыңыз және нәтижелерді үнемі өлшеңіз.

**Негізгі принциптер:**
- Тығырықты минимизациялау (friction)
- Ұсыныс құндылығын максимизациялау
- Әлеуметтік дәлелдерді қолдану
- Гипотезаларды тестілеу
- Барлық өзгерістерді өлшеу`,
      },
    },
  },
] as const;

/**
 * Truncate text to specified length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

function mapPost(source: BlogPostSource, locale: AppLocale): BlogPost {
  const t = source.translations;
  return {
    slug: source.slug,
    title: t.title[locale],
    description: t.description[locale],
    excerpt: t.excerpt[locale],
    content: t.content[locale],
    image: source.image,
    imageAlt: t.imageAlt[locale],
    publishedAt: source.publishedAt,
    publishedLabel: t.publishedLabel[locale],
    updatedAt: source.updatedAt,
    author: source.author,
    tags: source.tags,
    category: t.category[locale],
    readingTime: source.readingTime,
    featured: source.featured,
  };
}

/**
 * Get all blog posts
 */
export function getAllPosts(locale: AppLocale): readonly BlogPost[] {
  return [...BLOG_POSTS]
    .map((post) => mapPost(post, locale))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(locale: AppLocale): readonly BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured)
    .map((post) => mapPost(post, locale))
    .slice(0, 3);
}

/**
 * Get post by slug
 */
export function getPostBySlug(
  slug: string,
  locale: AppLocale,
): BlogPost | undefined {
  const found = BLOG_POSTS.find((p) => p.slug === slug);
  if (!found) {
    return undefined;
  }
  return mapPost(found, locale);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(
  category: string,
  locale: AppLocale,
): readonly BlogPost[] {
  return BLOG_POSTS.filter((p) => p.translations.category.ru === category).map(
    (post) => mapPost(post, locale),
  );
}

/**
 * Get all categories
 */
export function getAllCategories(): readonly string[] {
  return Array.from(
    new Set(BLOG_POSTS.map((p) => p.translations.category.ru)),
  );
}

/**
 * Get all tags
 */
export function getAllTags(): readonly string[] {
  return Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags)));
}

/**
 * Get excerpt with consistent length (120 characters)
 */
export function getExcerpt(post: BlogPost): string {
  return truncateText(post.excerpt, 120);
}
