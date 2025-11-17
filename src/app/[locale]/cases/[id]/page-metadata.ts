import type { Metadata } from 'next';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { getProjectById } from '@/lib/portfolio-data';

type CaseDetailPageMetadataProps = {
  readonly params: Promise<{ readonly id: string; readonly locale: string }>;
};

export async function generateMetadata({ params }: CaseDetailPageMetadataProps): Promise<Metadata> {
  const { id, locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const project = getProjectById(id);
  
  if (!project) {
    return generateBaseMetadata();
  }

  const baseUrl = 'https://nanosudo.com';
  const url = locale === routing.defaultLocale
    ? `${baseUrl}/cases/${id}`
    : `${baseUrl}/${locale}/cases/${id}`;

  return generateBaseMetadata({
    title: project.title,
    description: project.description,
    image: project.image.startsWith('http') ? project.image : `${baseUrl}${project.image}`,
    url,
    locale,
    type: 'website',
  });
}

