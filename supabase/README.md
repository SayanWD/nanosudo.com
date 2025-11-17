# Supabase Setup

## Requirements

- Supabase CLI `>=1.138` (опционально, для локальной разработки)
- Настроенный Supabase проект (локальный или облачный)
- Пользователь Auth, который будет администратором

## Быстрая настройка

### Вариант 1: Использование Supabase CLI (рекомендуется)

```bash
# Применить все миграции
supabase db push

# Или для локального проекта
supabase migration up
```

### Вариант 2: Ручное применение через SQL Editor

1. Откройте Supabase Dashboard → SQL Editor
2. Скопируйте и выполните содержимое файла `supabase/setup-db.sql`

### Вариант 3: Применение миграций по отдельности

Примените миграции в порядке:
1. `20250115120000_create_submissions.sql`
2. `20250116000000_create_brief_submissions.sql`

## Что создается

После применения миграций будут созданы:

- `public.submissions` - таблица для старой формы брифов
- `public.brief_submissions` - таблица для новой интерактивной формы с расчетом стоимости
- `public.admin_members` - таблица для хранения администраторов
- Storage bucket `brandbooks` - хранилище для файлов брендбуков (10MB, PDF/ZIP)
- RLS политики для безопасного доступа
- Индексы для оптимизации запросов

## Настройка администратора

После создания таблиц добавьте администратора:

```sql
insert into public.admin_members (auth_user_id, email)
values ('{AUTH_USER_UUID}', 'your-email@example.com');
```

**Как получить AUTH_USER_UUID:**
1. Зарегистрируйтесь/войдите в Supabase Auth
2. В Dashboard → Authentication → Users найдите пользователя
3. Скопируйте UUID из поля `id`

## Проверка настройки

```sql
-- Проверить таблицы
select table_name 
from information_schema.tables 
where table_schema = 'public' 
and table_name in ('admin_members', 'submissions', 'brief_submissions');

-- Проверить storage bucket
select * from storage.buckets where id = 'brandbooks';
```

## Environment variables

Убедитесь, что установлены следующие переменные (см. `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BREVO_API_KEY`
- `NEXT_PUBLIC_BREVO_SENDER_EMAIL`
- `BREVO_NOTIFICATION_EMAIL`

## Дополнительная информация

См. `supabase/SETUP.md` для подробной документации по настройке.
