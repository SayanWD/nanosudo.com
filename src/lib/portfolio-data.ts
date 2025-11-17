/**
 * Portfolio project data structure
 */

export type PortfolioProject = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly shortDescription: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly url?: string;
  readonly tags: readonly string[];
  readonly category: string;
  readonly year: number;
  readonly featured: boolean;
  readonly goals?: readonly string[];
  readonly tasks?: readonly string[];
  readonly results?: readonly string[];
  readonly metrics?: {
    readonly label: string;
    readonly value: string;
  }[];
};

export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  {
    id: 'zakyat-kz',
    title: 'ZAKYAT.KZ — Платформа добрых дел',
    description: 'Независимая онлайн-платформа для адресной помощи, построенная на принципах доверия, прозрачности и ручной модерации. Позволяет людям, нуждающимся в помощи, напрямую связываться с донорами без посредников и сбора денег.',
    shortDescription: 'Платформа для адресной помощи с ручной модерацией и прозрачностью',
    image: '/zakyat-platform.png',
    imageAlt: 'ZAKYAT.KZ — Платформа для адресной помощи',
    url: 'https://zakyat.kz',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Telegram Bot'],
    category: 'Социальный проект',
    year: 2024,
    featured: true,
    goals: [
      'Создать прозрачную платформу для адресной помощи без посредников',
      'Обеспечить ручную модерацию всех заявок для безопасности',
      'Исключить сбор денег и участие третьих сторон',
      'Реализовать систему фильтрации и рандомизации заявок',
    ],
    tasks: [
      'Разработать систему подачи заявок с валидацией данных',
      'Создать панель модерации с правами доступа (модератор/администратор)',
      'Реализовать публичный каталог заявок с фильтрацией по району и типу помощи',
      'Настроить рандомизацию отображения заявок для справедливости',
      'Внедрить систему статусов заявок (ожидание/проверено/отклонено/помощь получена)',
      'Создать логирование всех действий модераторов',
      'Реализовать защиту от спама (1 заявка в сутки с одного номера)',
      'Настроить SEO-оптимизацию и защиту контактов от индексации',
      'Разработать Telegram-бот для модераторов (Этап 2)',
      'Добавить кнопку "Я помог" с защитой от спама (Этап 2)',
    ],
    results: [
      'Запущена платформа с полным циклом модерации заявок',
      'Реализована система ролей с разграничением прав доступа',
      'Внедрена защита от спама и автоматическая валидация данных',
      'Создан прозрачный каталог с фильтрацией и рандомизацией',
      'Настроена система логирования для отслеживания всех действий',
      'Обеспечена безопасность контактов через robots.txt и noindex',
    ],
    metrics: [
      { label: 'Роли пользователей', value: '4 типа' },
      { label: 'Статусы заявок', value: '4 статуса' },
      { label: 'Защита от спама', value: '1 заявка/день' },
      { label: 'Этапы реализации', value: '3 фазы' },
    ],
  },
] as const;

/**
 * Get featured projects (last 3 projects)
 */
export function getFeaturedProjects(): readonly PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter((p) => p.featured).slice(0, 3);
}

/**
 * Get all projects with pagination
 */
export function getProjects(page: number = 1, perPage: number = 3): {
  readonly projects: readonly PortfolioProject[];
  readonly total: number;
  readonly totalPages: number;
} {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const projects = PORTFOLIO_PROJECTS.slice(start, end);
  
  return {
    projects,
    total: PORTFOLIO_PROJECTS.length,
    totalPages: Math.ceil(PORTFOLIO_PROJECTS.length / perPage),
  };
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.id === id);
}

/**
 * Get all projects
 */
export function getAllProjects(): readonly PortfolioProject[] {
  return PORTFOLIO_PROJECTS;
}

