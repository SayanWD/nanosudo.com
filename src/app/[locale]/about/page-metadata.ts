import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

type AboutPageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: AboutPageMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  return generateBaseMetadata({
    title: t('about.hero.title', { defaultValue: 'О себе' }),
    description: t('about.hero.description', { defaultValue: 'Путь от обучения к независимой разработке. Опыт работы в квазигоссекторе и переход к full-stack разработке.' }),
    locale,
    url: locale === routing.defaultLocale ? 'https://nanosudo.com/about' : `https://nanosudo.com/${locale}/about`,
  });
}

