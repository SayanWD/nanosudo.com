import type { Metadata } from "next";
import type { ReactElement } from "react";
import { BlogPageClient } from "./blog-page-client";

export const metadata: Metadata = {
  title: 'Блог разработчика | Sayan Roor',
  description: 'Практические статьи о разработке, оптимизации и лучших практиках. Реальный опыт из проектов.',
  openGraph: {
    title: 'Блог разработчика | Sayan Roor',
    description: 'Практические статьи о разработке, оптимизации и лучших практиках. Реальный опыт из проектов.',
    type: 'website',
  },
};

export default function BlogPage(): ReactElement {
  return <BlogPageClient />;
}
