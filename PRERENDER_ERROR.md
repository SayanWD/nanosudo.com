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

Используется комбинация нескольких подходов:

### 1. Server Component wrapper с route segment config:
- `export const dynamic = 'error'` - выбрасывает ошибку при попытке статической генерации
- `export const dynamicParams = false` - не генерировать статические параметры
- `export const revalidate = 0` - без кеширования
- `export const fetchCache = 'force-no-store'` - без кеширования fetch
- `export const runtime = 'nodejs'` - runtime на Node.js
- `headers()` БЕЗ try-catch - принудительный динамический рендеринг, ошибка во время build ожидаема

### 2. Client Component с проверками:
- `BriefPageClientWrapper` проверяет `isClient` перед рендерингом
- Возвращает loading state во время SSR
- Использует `useEffect` для установки `isClient = true` только после монтирования

### 3. Динамический импорт с `ssr: false`:
- `BriefPageClient` загружается динамически с `ssr: false`
- Это гарантирует, что компонент не рендерится на сервере

### Почему `dynamic = 'error'` с `headers()` БЕЗ try-catch:
- Когда Next.js пытается prerender страницу, `headers()` выбрасывает ошибку синхронно
- `dynamic = 'error'` говорит Next.js, что это ожидаемо, и страница должна быть пропущена из статической генерации
- Ошибка обрабатывается Next.js и не останавливает build для других страниц
- Это единственный надежный способ предотвратить prerendering, когда `generateStaticParams` определен в layout
- **КРИТИЧНО**: Ошибка должна быть выброшена БЕЗ try-catch, чтобы Next.js мог обработать ее и пропустить страницу

### Важно:
- Route segment config (`export const dynamic`, `export const revalidate`, etc.) **НЕ МОЖЕТ** быть экспортирован из Client Components
- Поэтому используется Server Component wrapper, который экспортирует route segment config
- Внутри Server Component рендерится Client Component для UI
- `headers()` вызывается БЕЗ try-catch, чтобы ошибка была выброшена во время build
- Next.js обработает ошибку и пропустит страницу из статической генерации
- Ошибка должна быть выброшена синхронно, до любого рендеринга

### Почему предыдущие попытки не сработали:
- `dynamic = 'force-dynamic'` с `cookies()` в try-catch - Next.js все равно пытается prerender
- `dynamic = 'error'` с try-catch - ошибка не выбрасывается, Next.js продолжает prerender
- Client Component без route segment config - Next.js все равно пытается prerender из-за `generateStaticParams` в layout

### Текущее решение работает потому что:
- `dynamic = 'error'` явно говорит Next.js, что ошибка ожидаема
- `headers()` выбрасывает ошибку синхронно, до рендеринга
- Next.js обрабатывает ошибку и пропускает страницу из статической генерации
- Build продолжается для других страниц

Это должно предотвратить все попытки prerendering страницы `/brief`.
