# Настройка базы данных

Этот документ описывает процесс настройки базы данных для проекта.

## Быстрая настройка

### Вариант 1: Использование Supabase CLI (рекомендуется)

Если у вас установлен Supabase CLI и настроен локальный проект:

```bash
# Применить все миграции
supabase db push

# Или для локального проекта
supabase migration up
```

### Вариант 2: Ручное применение через SQL Editor

1. Откройте Supabase Dashboard → SQL Editor
2. Скопируйте содержимое файла `supabase/setup-db.sql`
3. Выполните SQL скрипт

### Вариант 3: Применение миграций по отдельности

Примените миграции в порядке:

1. `20250115120000_create_submissions.sql` - создает базовые таблицы
2. `20250116000000_create_brief_submissions.sql` - создает таблицу для новой формы

## Структура базы данных

После настройки будут созданы следующие таблицы:

### 1. `admin_members`
Хранит информацию об администраторах, которые имеют доступ к заявкам.

**Поля:**
- `auth_user_id` (uuid, PK) - ID пользователя из Supabase Auth
- `email` (text, unique) - Email администратора
- `created_at`, `updated_at` (timestamptz) - Временные метки

### 2. `submissions`
Хранит заявки из старой формы брифов.

**Поля:**
- Основная информация о клиенте
- Информация о целевой аудитории
- Метрики и брендбук
- Контактная информация
- Статус заявки

### 3. `brief_submissions`
Хранит заявки из новой интерактивной формы с расчетом стоимости.

**Поля:**
- Информация о проекте (название, тип, описание)
- Контактная информация
- Расчет стоимости (`total_cost`, `total_hours`)
- Детализация расчетов (JSONB)
- Полные данные формы (JSONB)
- Статус заявки

### 4. Storage Bucket: `brandbooks`
Хранилище для файлов брендбуков (PDF, ZIP).

## Настройка администратора

После создания таблиц нужно добавить администратора:

```sql
-- Замените {AUTH_USER_UUID} на реальный UUID пользователя из Supabase Auth
-- и 'your-email@example.com' на ваш email
insert into public.admin_members (auth_user_id, email)
values ('{AUTH_USER_UUID}', 'your-email@example.com');
```

**Как получить AUTH_USER_UUID:**
1. Зарегистрируйтесь/войдите в Supabase Auth
2. В Supabase Dashboard → Authentication → Users найдите свой пользователь
3. Скопируйте UUID из поля `id`

## Проверка настройки

Выполните следующие запросы для проверки:

```sql
-- Проверить создание таблиц
select table_name 
from information_schema.tables 
where table_schema = 'public' 
and table_name in ('admin_members', 'submissions', 'brief_submissions');

-- Проверить storage bucket
select * from storage.buckets where id = 'brandbooks';

-- Проверить RLS политики
select tablename, policyname 
from pg_policies 
where schemaname = 'public' 
and tablename in ('admin_members', 'submissions', 'brief_submissions');
```

## Переменные окружения

Убедитесь, что в `.env.local` или `.env` установлены:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BREVO_API_KEY=your-brevo-api-key
NEXT_PUBLIC_BREVO_SENDER_EMAIL=sender@example.com
BREVO_NOTIFICATION_EMAIL=notify@example.com
```

## Устранение проблем

### Ошибка: "function set_updated_at_timestamp() does not exist"
Функция должна быть создана в первой миграции. Если ошибка возникает, выполните:

```sql
create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
```

### Ошибка: "relation already exists"
Таблицы уже существуют. Это нормально, скрипт использует `create table if not exists`.

### Ошибка при применении миграций
Если миграции не применяются, попробуйте:
1. Проверить порядок миграций (по дате в имени файла)
2. Применить `setup-db.sql` напрямую через SQL Editor
3. Проверить права доступа к базе данных

## Дополнительная информация

- Все таблицы используют Row Level Security (RLS)
- Анонимные пользователи могут только создавать заявки (INSERT)
- Администраторы могут читать и обновлять все заявки
- Storage bucket `brandbooks` доступен только администраторам

