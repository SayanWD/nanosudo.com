# Настройка интернационализации (i18n)

## Структура

Система переводов организована с использованием `next-intl` для поддержки трех языков:
- **ru** (Русский) - язык по умолчанию
- **en** (English) - английский
- **kk** (Қазақша) - казахский

## Файлы конфигурации

### `src/i18n/config.ts`
Определяет поддерживаемые локали и их названия.

### `src/i18n/routing.ts`
Настраивает роутинг для локалей и экспортирует обертки для навигации (`Link`, `useRouter`, `usePathname`).

### `src/i18n/request.ts`
Конфигурация для загрузки переводов на сервере.

### `src/middleware.ts`
Middleware для определения локали из URL и заголовков.

## Структура переводов

Файлы переводов находятся в `messages/`:
- `messages/ru.json` - русский
- `messages/en.json` - английский
- `messages/kk.json` - казахский

## Использование в компонентах

### Клиентские компоненты

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <Link href="/about">{t('common.nav.about')}</Link>
    </div>
  );
}
```

### Серверные компоненты

```tsx
import { useTranslations } from 'next-intl';

export default async function Page() {
  const t = await useTranslations();
  
  return <h1>{t('home.hero.title')}</h1>;
}
```

## Навигация

Используйте `Link` из `@/i18n/routing` вместо `next/link`:

```tsx
import { Link } from '@/i18n/routing';

<Link href="/about">О себе</Link>
```

## Переключение языка

Компонент `LanguageSwitcher` добавлен в хедер и позволяет переключаться между языками.

## Структура роутов

Все страницы (кроме `/brief`) находятся в `src/app/[locale]/`:
- `src/app/[locale]/page.tsx` - главная
- `src/app/[locale]/about/page.tsx` - о себе
- `src/app/[locale]/cases/page.tsx` - кейсы
- `src/app/[locale]/blog/page.tsx` - блог
- `src/app/[locale]/contact/page.tsx` - контакты

Страница `/brief` остается без локализации (как было запрошено).

## Добавление новых переводов

1. Добавьте ключ в `messages/ru.json`
2. Добавьте перевод в `messages/en.json` и `messages/kk.json`
3. Используйте `t('your.key')` в компонентах

## Пример структуры переводов

```json
{
  "common": {
    "nav": {
      "home": "Главная",
      "about": "О себе"
    }
  },
  "home": {
    "hero": {
      "title": "Заголовок"
    }
  }
}
```

