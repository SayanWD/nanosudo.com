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

## Текущее решение

Используется комбинация:
- Route segment config (`dynamic = 'force-dynamic'`)
- Клиентский компонент
- Динамический импорт с `ssr: false`

Это должно предотвратить все попытки prerendering страницы `/brief`.
