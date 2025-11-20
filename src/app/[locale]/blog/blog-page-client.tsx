'use client';

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllPosts, getExcerpt, type BlogPost, type AppLocale } from "@/lib/blog-data";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function PostCard({ post }: { readonly post: BlogPost }): ReactElement {
  const t = useTranslations();
  const excerpt = getExcerpt(post);

  return (
    <motion.article
      className="group relative rounded-2xl border border-border/60 bg-surface/80 overflow-hidden shadow-soft transition-all hover:-translate-y-2 hover:border-accent/70 hover:shadow-lg"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      <Link
        href={`/blog/${post.slug}` as Route}
        className="block"
        aria-label={t("blog.list.readPostAria", { title: post.title })}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedLabel}
              </span>
            </div>
            <h3 className="font-heading text-xl md:text-2xl leading-tight group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {excerpt}
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 overflow-x-auto">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap flex-shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all pt-2">
            {t("blog.list.readMore")}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function BlogPageClient(): ReactElement {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const posts = getAllPosts(locale);

  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="border-b border-border/60 py-section bg-surface/40">
          <Container className="max-w-4xl">
            <motion.div
              className="space-y-8 text-balance text-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
                variants={fadeInUp}
              >
                {t("blog.list.label")}
              </motion.p>
              <motion.h1
                className="font-heading text-4xl md:text-5xl lg:text-6xl"
                variants={fadeInUp}
              >
                {t("blog.list.title")}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                {t("blog.list.description")}
              </motion.p>
            </motion.div>
          </Container>
        </section>

        {/* Posts Grid */}
        <section className="py-section">
          <Container>
            {posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{t("blog.list.empty")}</p>
              </div>
            )}
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
