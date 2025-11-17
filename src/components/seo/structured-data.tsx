import type { ReactElement } from 'react';

type StructuredDataProps = {
  readonly data: Record<string, unknown>;
};

/**
 * Component for adding structured data (JSON-LD) to pages
 * Helps search engines understand the content better
 */
export function StructuredData({ data }: StructuredDataProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generate Person structured data for Sayan Roor
 */
export function generatePersonStructuredData(locale: string): Record<string, unknown> {
  const baseUrl = 'https://nanosudo.com';
  const url = locale === 'ru' ? baseUrl : `${baseUrl}/${locale}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sayan Roor',
    jobTitle: 'Full-stack Developer',
    description: 'Full-stack разработчик. Создаю веб-приложения на Next.js и TypeScript с фокусом на производительность и конверсию.',
    url,
    image: `${baseUrl}/Sayan_Roor_Web_Dev.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/sayan-roor/',
      'https://instagram.com/satoshi_iam',
      'https://t.me/satoshi_iam',
      'https://github.com/SayanWD',
    ],
    email: 'roorsayan@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Almaty',
      addressCountry: 'KZ',
    },
    knowsAbout: [
      'Web Development',
      'Next.js',
      'TypeScript',
      'React',
      'Full-stack Development',
      'CRM Integration',
      'API Development',
    ],
  };
}

/**
 * Generate WebSite structured data
 */
export function generateWebsiteStructuredData(locale: string): Record<string, unknown> {
  const baseUrl = 'https://nanosudo.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sayan Roor — Full-stack разработчик',
    url: baseUrl,
    description: 'Создаю высокопроизводительные веб-приложения на Next.js и TypeScript с фокусом на конверсию.',
    inLanguage: locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'kk-KZ',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Service structured data
 */
export function generateServiceStructuredData(): Record<string, unknown> {
  const baseUrl = 'https://nanosudo.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development',
    provider: {
      '@type': 'Person',
      name: 'Sayan Roor',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kazakhstan',
    },
    description: 'Полный цикл разработки веб-приложений: от стратегии и ТЗ до запуска и поддержки. Интеграции с CRM, 1С, Kaspi API.',
    offers: {
      '@type': 'Offer',
      description: 'Разработка веб-приложений с гарантией 12 месяцев',
    },
  };
}

