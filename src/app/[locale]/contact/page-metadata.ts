import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

type ContactPageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: ContactPageMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  return generateBaseMetadata({
    title: t('contact.hero.title', { defaultValue: 'Контакты' }),
    description: t('contact.hero.description', { defaultValue: 'Свяжитесь со мной любым удобным способом. Отвечаю в течение 24 часов. Первая консультация бесплатно.' }),
    locale,
    url: locale === routing.defaultLocale ? 'https://nanosudo.com/contact' : `https://nanosudo.com/${locale}/contact`,
  });
}

