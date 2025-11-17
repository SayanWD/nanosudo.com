<!-- Документ описывает настройки версионирования и правила контрибьюта -->

# Версионирование и контрибьютинг: заметки по реализации

## Версионирование
- **Инструмент:** `semantic-release` + плагины (`@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`).
- **Конфигурация:** хранится в `package.json` (`scripts.release`, раздел `release.branches/plugins`).
- **CHANGELOG:** файл `CHANGELOG.md` обновляется автоматически при выпуске.
- **Пререлизы:** ветка `develop` и `release/*` публикуют версии с суффиксом `-rc.x`.
- **Без npm-публикации:** в GitHub Actions не используется `NPM_TOKEN`, релизы ограничены GitHub-тегами и changelog.

### Требования к окружению релизов
- Workflow `release.yml` запускается на пуши в `main` и `develop`.
- Для успешной сборки нужно задать секреты/переменные окружения (минимум Supabase и Brevo), иначе `next build` упадёт на валидации Zod.
- Теги создаются только на `main` (`vX.Y.Z`), придерживаемся SemVer.

## Контрибьютинг
- **Базовый флоу:** ветка `develop` — основная для интеграции. Новые задачи → `feature/*`, `fix/*`, `chore/*` от `develop`, PR обратно.
- **Коммиты:** Conventional Commits, без `any`, следуем `documentation/CONTRIBUTING.md`.
- **Branch protection:** после первого запуска CI включаем `Require status checks` для `CI` на ветках `main`/`develop` через GitHub Settings.
- **CI workflow:** `.github/workflows/ci.yml` (lint, typecheck, unit-тесты) — обязателен для всех PR.
- **Release workflow:** `.github/workflows/release.yml` (build + semantic-release) — следит за тегами и changelog.

## Чеклист перед merge
1. Обновлены зависимости/lockfile после изменения конфигураций.
2. `pnpm lint`, `pnpm typecheck`, `pnpm test` пройдены локально.
3. Заполнены необходимые `secrets`/`variables` в репозитории.
4. Для релизных изменений подготовлено описание в PR с ссылками на `documentation/VERSIONING.md` и `documentation/CONTRIBUTING.md`.

