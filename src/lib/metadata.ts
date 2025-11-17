import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://nanosudo.com';
const SITE_NAME = 'Sayan Roor — Full-stack разработчик';
const DEFAULT_DESCRIPTION = 'Создаю высокопроизводительные веб-приложения на Next.js и TypeScript с фокусом на конверсию. Полный цикл: разработка, интеграции с CRM/1С/Kaspi, маркетинг.';

type GenerateMetadataOptions = {
  readonly title?: string;
  readonly description?: string;
  readonly image?: string;
  readonly url?: string;
  readonly locale?: string;
  readonly type?: 'website' | 'article';
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly author?: string;
};

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = `${BASE_URL}/Sayan_Roor_Web_Dev.jpg`,
  url,
  locale = routing.defaultLocale,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Sayan Roor',
}: GenerateMetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url || (locale === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${locale}`);

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ru': `${BASE_URL}/ru`,
        'en': `${BASE_URL}/en`,
        'kk': `${BASE_URL}/kk`,
      },
    },
    openGraph: {
      type,
      locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'kk_KZ',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@satoshi_iam',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(author && {
      authors: [{ name: author }],
    }),
  };
}

