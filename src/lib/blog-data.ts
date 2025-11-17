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
    slug: "nextjs-performance-optimization",
    image: "/blog/nextjs-optimization.jpg",
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

Өнімділікті оңтайландыру — итеративті процесс. Алдымен өлшеңіз, содан кейін ең маңызды тар орындарды жақсартыңыз.`,
      },
    },
  },
  {
    slug: "typescript-best-practices",
    image: "/blog/typescript-practices.jpg",
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
    image: "/blog/supabase-integration.jpg",
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
