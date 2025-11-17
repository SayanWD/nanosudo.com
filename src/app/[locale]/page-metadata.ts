import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

type HomePageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: HomePageMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  return generateBaseMetadata({
    title: t('home.hero.title', { defaultValue: 'Разрабатываю решения, которые приносят результат' }).replace(/<[^>]*>/g, ''),
    description: t('home.hero.description', { defaultValue: 'Высокопроизводительные веб-приложения на Next.js и TypeScript. Полный цикл: разработка, интеграции с CRM/1С/Kaspi, маркетинг. Окупаемость 2-3 месяца.' }),
    locale,
    url: locale === routing.defaultLocale ? 'https://nanosudo.com' : `https://nanosudo.com/${locale}`,
  });
}

