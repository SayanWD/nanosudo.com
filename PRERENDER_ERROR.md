# Prerender Error Analysis and Solution

## Проблема

Next.js пытается prerender страницу `/brief` во время build, что вызывает ошибку:
```
Error occurred prerendering page "/brief"
Export encountered an error on /brief/page: /brief, exiting the build.
```

## Причина

1. **`generateStaticParams` в layout** (`src/app/[locale]/layout.tsx`):
   - Генерирует параметры для всех локалей: `['en', 'ru', 'kk']`
   - Это заставляет Next.js пытаться prerender все страницы для всех локалей
   - Включая `/brief`, даже если она является клиентским компонентом

2. **Динамический маршрут `[locale]/brief`**:
   - Next.js пытается prerender страницу для каждой локали из `generateStaticParams`
   - Даже клиентские компоненты могут prerenderиться в этом случае

3. **Использование `useTranslations()` в клиентских компонентах**:
   - Может требовать серверного контекста во время prerendering
   - Вызывает ошибки, если контекст недоступен

## Решение

### Комбинация подходов:

1. **Route Segment Config в `page.tsx`**:
   ```typescript
   export const dynamic = 'force-dynamic';
   export const dynamicParams = false;
   export const revalidate = 0;
   export const fetchCache = 'force-no-store';
   export const runtime = 'nodejs';
   ```

2. **Клиентский компонент**:
   - Страница является клиентским компонентом (`"use client"`)
   - Это предотвращает серверный рендеринг

3. **Динамический импорт с `ssr: false`**:
   - `BriefPageClientWrapper` использует `dynamic()` с `ssr: false`
   - Это гарантирует, что компонент не рендерится на сервере

### Почему это работает:

- `dynamic = 'force-dynamic'` - заставляет Next.js рендерить страницу динамически
- `dynamicParams = false` - предотвращает генерацию статических параметров
- Клиентский компонент - предотвращает серверный рендеринг
- `ssr: false` в dynamic() - гарантирует, что компонент не рендерится на сервере

## Альтернативные решения (если проблема сохранится)

1. **Исключить `/brief` из `generateStaticParams` в layout**:
   - Модифицировать `generateStaticParams` чтобы не генерировать параметры для `/brief`
   - Это сложно, так как `generateStaticParams` работает на уровне сегмента

2. **Использовать `export const dynamic = 'error'`**:
   - Выбросит ошибку при попытке статической генерации
   - Next.js пропустит страницу из статической генерации
   - Но может вызвать проблемы с build

3. **Переместить `/brief` вне `[locale]` маршрута**:
   - Создать отдельный маршрут `/brief` без локализации
   - Это потребует изменений в структуре проекта

## Финальное решение

**Ключевое решение: Переопределение `generateStaticParams` в странице**

### 1. Переопределение `generateStaticParams`:
```typescript
export function generateStaticParams(): Array<{ locale: string }> {
  // Return empty array to prevent prerendering
  // This overrides the generateStaticParams from layout.tsx for this specific page
  return [];
}
```

**Почему это работает:**
- `generateStaticParams` в layout (`src/app/[locale]/layout.tsx`) генерирует параметры для всех локалей
- Когда страница экспортирует свой собственный `generateStaticParams`, он **переопределяет** поведение из layout для этого конкретного сегмента
- Пустой массив означает, что Next.js не будет пытаться prerender эту страницу для каких-либо локалей
- Это правильный способ исключить конкретную страницу из статической генерации, когда `generateStaticParams` определен в родительском layout

### 2. Route Segment Config:
```typescript
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
```

**Зачем:**
- `dynamic = 'force-dynamic'` - явно указывает, что страница должна рендериться динамически
- `dynamicParams = false` - предотвращает генерацию статических параметров
- `revalidate = 0` - без кеширования
- `fetchCache = 'force-no-store'` - без кеширования fetch запросов
- `runtime = 'nodejs'` - использование Node.js runtime

### 3. Принудительный динамический рендеринг:
```typescript
export default async function BriefPage(): Promise<ReactElement> {
  // Force dynamic rendering by accessing request-specific API
  await headers();
  return <BriefPageClientWrapper />;
}
```

**Зачем:**
- `headers()` делает страницу динамической во время runtime
- Это дополнительная гарантия, что страница не будет закеширована

### 4. Client Component с динамическим импортом:
- `BriefPageClientWrapper` использует `dynamic()` с `ssr: false`
- Это гарантирует, что UI компонент не рендерится на сервере

### Почему предыдущие попытки не сработали:
- `dynamic = 'error'` с try-catch - ошибка перехватывалась, Next.js продолжал prerender
- `dynamic = 'force-dynamic'` без переопределения `generateStaticParams` - Next.js все равно пытался prerender из-за `generateStaticParams` в layout
- Client Component без route segment config - Next.js все равно пытался prerender из-за `generateStaticParams` в layout

### Текущее решение работает потому что:
- **Переопределение `generateStaticParams`** - это правильный способ исключить страницу из статической генерации, когда родительский layout определяет `generateStaticParams`
- Пустой массив явно говорит Next.js: "не пытайся prerender эту страницу"
- `dynamic = 'force-dynamic'` дополнительно указывает на динамический рендеринг
- `headers()` делает страницу динамической во время runtime

Это **правильное и надежное** решение согласно документации Next.js.
