import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { Calendar, Tag, ArrowLeft, ArrowRight, User } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { getPostBySlug, getAllPosts, type AppLocale } from "@/lib/blog-data";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";

type BlogPostPageParams = {
  readonly slug: string;
  readonly locale: AppLocale;
};

type BlogPostPageProps = {
  readonly params: Promise<BlogPostPageParams>;
};

function formatDateFromLabel(label: string): string {
  return label;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Статья не найдена',
    };
  }

  const baseUrl = 'https://nanosudo.com';
  const url = locale === 'ru' 
    ? `${baseUrl}/blog/${slug}`
    : `${baseUrl}/${locale}/blog/${slug}`;

  return generateBaseMetadata({
    title: post.title,
    description: post.description,
    image: post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`,
    url,
    locale,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<ReactElement> {
  const { slug, locale } = await params;
  const t = await getTranslations();
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        {/* Header */}
        <section className="border-b border-border/60 py-8 bg-surface/40">
          <Container className="max-w-4xl">
            <div className="space-y-6">
              <Link
                href={"/blog" as Route}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {t("blog.post.backToBlog")}
              </Link>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDateFromLabel(post.publishedLabel)}
                  </span>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                  {post.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Hero Image */}
        <section className="border-b border-border/60 py-section bg-gradient-to-b from-surface/20 to-background">
          <Container className="max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-accent/20 to-accent/5 shadow-soft">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </Container>
        </section>

        {/* Content */}
        <section className="py-section">
          <Container className="max-w-4xl">
            <article className="prose prose-invert max-w-none">
              <MarkdownContent content={post.content} />
            </article>

            {/* Author Info */}
            <div className="mt-16 pt-12 border-t border-border/60">
              <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6">
                <div className="rounded-full bg-accent/10 p-3">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("blog.post.authorBio")}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-12 border-t border-border/60">
              <div className="grid gap-6 md:grid-cols-2">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}` as Route}
                    className="group flex items-center gap-4 rounded-xl border border-border/60 bg-surface/80 p-4 transition-all hover:border-accent/70 hover:bg-surface"
                  >
                    <div className="flex-shrink-0">
                      <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-1">{t("blog.post.prevArticle")}</p>
                      <p className="font-heading text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                        {prevPost.title}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}` as Route}
                    className="group flex items-center gap-4 rounded-xl border border-border/60 bg-surface/80 p-4 transition-all hover:border-accent/70 hover:bg-surface md:ml-auto"
                  >
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-xs text-muted-foreground mb-1">{t("blog.post.nextArticle")}
                      </p>
                      <p className="font-heading text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                        {nextPost.title}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                ) : null}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href={"/blog" as Route}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  {t("blog.post.backToList")}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

// Generate static params for all posts
export async function generateStaticParams(): Promise<Array<{ readonly slug: string }>> {
  const posts = getAllPosts("ru");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
