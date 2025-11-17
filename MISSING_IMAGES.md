# Отсутствующие изображения

## Блог
Изображения закомментированы, показываются placeholder'ы:
- `/blog/nextjs-optimization.jpg` - для статьи "Оптимизация Next.js приложения"
- `/blog/typescript-practices.jpg` - для статьи "TypeScript: лучшие практики"
- `/blog/supabase-integration.jpg` - для статьи "Интеграция Supabase в Next.js"

**Места использования:**
- `src/app/blog/blog-page-client.tsx` (строки 60-68) - карточки постов
- `src/app/blog/[slug]/page.tsx` (строки 139-145) - страница отдельного поста

## Портфолио/Кейсы
Изображения закомментированы, показываются placeholder'ы:
- `/projects/ecommerce.jpg` - E-commerce платформа
- `/projects/portal.jpg` - Корпоративный портал
- `/projects/landing.jpg` - Landing page

**Места использования:**
- `src/app/page.tsx` (строки 638-645) - секция портфолио на главной
- `src/app/cases/page.tsx` (строки 49-56) - список кейсов
- `src/app/cases/[id]/project-detail-content.tsx` (строки 121-127) - детальная страница кейса

## Работающие изображения
✅ Логотипы технологий в разделе "О себе" - используют внешние CDN (cdn.jsdelivr.net, cdn.simpleicons.org)

## Рекомендации
1. Создать папки `public/blog/` и `public/projects/`
2. Добавить реальные изображения или использовать placeholder сервисы
3. Раскомментировать Image компоненты после добавления изображений

