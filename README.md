## nanosudo.com

Портфолио full-stack разработчика (Next.js 16, TypeScript, Tailwind 4, Supabase, Brevo).

### Быстрый старт

```bash
pnpm install
cp .env.example .env.local   # заполнить значения ниже
pnpm dev
```

Откройте http://localhost:3000. Линт/типы:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

### Переменные окружения

Храним только в `.env.local` (не коммитим). Шаблон — `.env.example`.

| Ключ                             | Где взять                                        | Назначение                                 |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase Project Settings → API                  | URL анонимного клиента                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase Project Settings → API                  | Публичный ключ (client)                    |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase Project Settings → API                  | Service role для server actions / миграций |
| `BREVO_API_KEY`                  | Brevo (ex-Sendinblue) API Keys                   | Отправка transactional email               |
| `NEXT_PUBLIC_BREVO_SENDER_EMAIL` | Brevo → Senders (домен подтверждён в Cloudflare) | Отправитель писем                          |
| `BREVO_NOTIFICATION_EMAIL`       | email для получения заявок (например, владельца) | Получатель уведомлений о новых отправках   |

Дополнительно (по мере внедрения):

- `NEXT_PUBLIC_TELEGRAM_BOT_URL` — webhooks бота для уведомлений
- `STRIPE_SECRET_KEY` — прием оплат/депозитов
- `NEXT_PUBLIC_STAGING_FLAG` — разделение окружений

### Скрипты

| Команда          | Описание                                                        |
| ---------------- | --------------------------------------------------------------- |
| `pnpm dev`       | Dev-сервер Next.js                                              |
| `pnpm build`     | Типизация + линт + продакшн билд                                |
| `pnpm start`     | Запуск собранного приложения                                    |
| `pnpm lint`      | ESLint (`@typescript-eslint/no-explicit-any`, explicit returns) |
| `pnpm typecheck` | `tsc --noEmit`                                                  |
| `pnpm test`      | Vitest (юнит + интеграция)                                      |
| `pnpm test:e2e`  | Playwright, happy-path /brief с mock API                        |
| `pnpm test:e2e:headed` | Playwright в headed-режиме                                  |
| `pnpm format`    | Prettier                                                        |

### Структура (основное)

```