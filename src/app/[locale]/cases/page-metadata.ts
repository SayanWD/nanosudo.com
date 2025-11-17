import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

type CasesPageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: CasesPageMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  return generateBaseMetadata({
    title: t('cases.list.title', { defaultValue: 'Кейсы' }),
    description: t('cases.list.description', { defaultValue: 'Реальные проекты с измеримыми результатами. Каждый проект — это решение конкретных бизнес‑задач с четкими целями, задачами и результатами.' }),
    locale,
    url: locale === routing.defaultLocale ? 'https://nanosudo.com/cases' : `https://nanosudo.com/${locale}/cases`,
  });
}

