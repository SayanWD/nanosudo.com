import type { Metadata } from "next";
import type { ReactElement } from "react";
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { BlogPageClient } from "./blog-page-client";

type BlogPageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: BlogPageMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  return generateBaseMetadata({
    title: t('blog.list.title', { defaultValue: 'Блог разработчика' }),
    description: t('blog.list.description', { defaultValue: 'Практические статьи о разработке, оптимизации и лучших практиках. Реальный опыт из проектов.' }),
    locale,
    url: locale === routing.defaultLocale ? 'https://nanosudo.com/blog' : `https://nanosudo.com/${locale}/blog`,
  });
}

export default function BlogPage(): ReactElement {
  return <BlogPageClient />;
}
