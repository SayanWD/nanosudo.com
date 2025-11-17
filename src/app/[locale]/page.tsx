'use client';

import type { ReactElement } from "react";
import { motion, useSpring, useMotionValueEvent, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Code, 
  Link2, 
  Zap, 
  BarChart3, 
  Shield, 
  FileText, 
  CreditCard, 
  Eye,
  CheckCircle2,
  TrendingUp,
  Gauge,
  ArrowRight,
  MessageCircle,
  DollarSign,
  UserCheck,
  Rocket,
  Handshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { FlipCard } from "@/components/flip-card";
import { TechnologiesMarquee } from "@/components/technologies-marquee";
import { getFeaturedProjects, type PortfolioProject } from "@/lib/portfolio-data";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Adaptive viewport settings for mobile and desktop
// Use amount instead of negative margins for better mobile compatibility
// amount: 0.2 means trigger when 20% of element is visible
const getViewportSettings = (amount = 0.2): { once: true; amount: number } => ({ once: true, amount });

function HeroSection(): ReactElement {
  const t = useTranslations();
  return (
    <section className="relative py-section overflow-hidden">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center items-center">
          <motion.div
            className="space-y-8 text-balance"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div className="space-y-4" variants={fadeInUp}>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                {t("home.hero.subtitle")}
              </p>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                {t.rich("home.hero.title", {
                  highlight: (chunks) => <span className="text-accent">{chunks}</span>,
                })}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {t("home.hero.description")}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start"
              variants={fadeInUp}
            >
              <Link
                href="/brief"
                className="btn-accent inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-semibold uppercase tracking-wide border-2 shadow-soft transition hover:bg-accent/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("common.cta.cost")}
              </Link>
              <a
                href="#process"
                className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-4 text-base font-semibold uppercase tracking-wide text-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("common.cta.howIWork")}
              </a>
            </motion.div>
          </motion.div>

          {/* Photo section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-2xl border border-border/60 bg-surface/80 p-4 lg:p-6 shadow-soft overflow-hidden">
              <motion.div
                className="aspect-square relative rounded-xl overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 max-w-[300px] mx-auto lg:max-w-none"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src="/Sayan_Roor_Web_Dev.jpg"
                  alt="Sayan Roor - Full-stack разработчик"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 300px, 400px"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Typewriter text component that types out text character by character
 */
type TypewriterTextProps = {
  readonly text: string;
  readonly speed?: number; // milliseconds per character
  readonly delay?: number; // delay before starting
  readonly showCursor?: boolean;
};

function TypewriterText({ 
  text, 
  speed = 30, 
  delay = 0,
  showCursor = true 
}: TypewriterTextProps): ReactElement {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, getViewportSettings(0.2));

  useEffect(() => {
    if (!isInView) return;

    const startTyping = (): void => {
      setIsTyping(true);
      setDisplayedText('');
      let currentIndex = 0;

      const typeChar = (): void => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
        }
      };

      setTimeout(typeChar, delay);
    };

    startTyping();
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className="inline font-mono">
      {displayedText}
      {showCursor && isTyping && (
        <span className="inline-block w-[2px] h-4 bg-accent ml-0.5 align-middle typewriter-cursor" />
      )}
    </span>
  );
}

/**
 * Animated number component that counts from 0 to target
 */
function AnimatedNumber({ 
  value
}: { 
  readonly value: string;
}): ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, getViewportSettings(0.2));
  
  // Parse value to extract number and suffix
  const match = value.match(/^([\d.]+)(.*)$/);
  
  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const [display, setDisplay] = useState(0);

  const numStr = match?.[1] ?? '';
  const suffix = match?.[2] ?? '';
  const targetNum = match ? parseFloat(numStr) : 0;
  const hasDecimals = numStr.includes('.');
  const decimalPlaces = hasDecimals ? (numStr.split('.')[1]?.length ?? 1) : 0;

  useEffect(() => {
    if (isInView && match) {
      spring.set(targetNum);
    }
  }, [isInView, targetNum, spring, match]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (match) {
      if (hasDecimals) {
        setDisplay(parseFloat(latest.toFixed(decimalPlaces)));
      } else {
        setDisplay(Math.round(latest));
      }
    }
  });

  // If value doesn't match pattern, return as-is
  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  // Format number (preserve decimals if original had them)
  const formattedNum = hasDecimals 
    ? display.toFixed(decimalPlaces) 
    : display.toString();

  return <span ref={ref}>{formattedNum}{suffix}</span>;
}

type StatItem = {
  readonly value: string;
  readonly label: string;
  readonly icon: LucideIcon;
};

type StatsCardProps = {
  readonly stat: StatItem;
};

// Animation variants for stats cards
const statsCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function StatsCard({ stat }: StatsCardProps): ReactElement {
  const Icon = stat.icon;

  return (
    <motion.div
      className="rounded-xl border border-border/60 bg-surface/80 p-6 shadow-soft text-center cursor-pointer overflow-hidden relative"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.2)}
      variants={statsCardVariants}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      }}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-center mb-2">
          <motion.div
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, -10, 10, 0],
              transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1] as const,
              },
            }}
          >
            <Icon className="w-6 h-6 text-accent" />
          </motion.div>
        </div>
        <motion.p
          className="text-2xl md:text-3xl font-heading text-accent mb-1"
          whileHover={{
            scale: 1.1,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1] as const,
            },
          }}
        >
          <AnimatedNumber value={stat.value} />
        </motion.p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  );
}

function StatsSection(): ReactElement {
  const t = useTranslations();
  const stats: Array<StatItem> = [
    { value: '20+', label: t('home.stats.items.successfulProjects'), icon: TrendingUp },
    { value: '95+', label: t('home.stats.items.pageSpeed'), icon: Gauge },
    { value: '1.2с', label: t('home.stats.items.avgLoad'), icon: Zap },
    { value: '12 мес', label: t('home.stats.items.codeWarranty'), icon: Shield },
  ];

  return (
    <section className="border-t border-border/60 py-section bg-surface/40">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.stats.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.stats.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.2)}
          variants={staggerContainer}
        >
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              stat={stat}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function ExpertiseSection(): ReactElement {
  const t = useTranslations();
  const expertise = [
    {
      id: 'dev',
      title: 'Разработка полного цикла',
      description: 'Frontend, Backend, Database, API — весь стек в одних руках. От архитектуры до деплоя.',
      tech: ['Next.js 16', 'TypeScript', 'PostgreSQL'],
      icon: Code,
    },
    {
      id: 'integrations',
      title: 'Интеграции и автоматизация',
      description: 'CRM, 1С, Kaspi API, платежи — связываю все системы в единый рабочий процесс.',
      tech: ['1С интеграция', 'Kaspi API', 'CRM системы'],
      icon: Link2,
    },
    {
      id: 'performance',
      title: 'Производительность и SEO',
      description: 'Скорость загрузки 1-1.5 сек, Core Web Vitals в зелёной зоне. Техническая оптимизация.',
      tech: ['Core Web Vitals', 'SSR/SSG', 'Image Optimization'],
      icon: Zap,
    },
    {
      id: 'marketing',
      title: 'Маркетинг и аналитика',
      description: 'Настройка рекламы, аналитика, A/B тесты — видите полную картину эффективности.',
      tech: ['Google Ads', 'Яндекс.Директ', 'GA4'],
      icon: BarChart3,
    },
  ];

  return (
    <section id="expertise" className="border-t border-border/60 py-section bg-surface/40">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.expertise.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.expertise.title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t("home.expertise.description")}
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {expertise.map((item, index) => (
            <motion.article
              key={index}
              className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-accent/70"
              initial="initial"
              whileInView="animate"
              viewport={getViewportSettings(0.2)}
              variants={fadeInUp}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-accent/10 p-3 flex-shrink-0">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-heading text-xl">{t(`home.expertise.items.${item.id}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">
                    <TypewriterText 
                      text={t(`home.expertise.items.${item.id}.description`)} 
                      speed={15}
                      delay={index * 300}
                      showCursor={true}
                    />
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
             </div>
           </Container>
         </section>
       );
     }

function WhyMeSection(): ReactElement {
  const t = useTranslations();
  const advantages: Array<{
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly benefit: string;
    readonly icon: LucideIcon;
    readonly color: string;
    readonly colorBright: string;
  }> = [
    {
      id: 'direct',
      title: 'Прямая коммуникация',
      description: 'Общаетесь напрямую с разработчиком. Нет менеджеров и задержек — решения принимаются сразу.',
      benefit: 'Задачи решаются в 2-3 раза быстрее',
      icon: MessageCircle,
      color: '#99b9ff', // AZURE - синий
      colorBright: '#b8d1ff',
    },
    {
      id: 'savings',
      title: 'Экономия 40-60%',
      description: 'Один разработчик = без накладных расходов. Платите за работу, а не за офис и маржу агентства.',
      benefit: 'Экспертиза за 40-60% от цены агентства',
      icon: DollarSign,
      color: '#78ffd1', // SPRINGGREEN - бирюзовый
      colorBright: '#a3ffe0',
    },
    {
      id: 'responsibility',
      title: 'Личная ответственность',
      description: 'Пишу код сам = отвечаю за результат. Знаю каждую строчку, быстро исправлю любую проблему.',
      benefit: 'Меньше багов, быстрее поддержка',
      icon: UserCheck,
      color: '#ffb3c2', // FLAMINGO - розовый
      colorBright: '#ffc9d4',
    },
    {
      id: 'speed',
      title: 'Гибкость и скорость',
      description: 'Срочные изменения и новые идеи — обсудим и сделаем за день. Без бюрократии и согласований.',
      benefit: 'Быстрые решения',
      icon: Rocket,
      color: '#f0ffa6', // LIME - лайм
      colorBright: '#f5ffc4',
    },
    {
      id: 'partnership',
      title: 'Долгосрочное партнёрство',
      description: 'В курсе вашего бизнеса, предлагаю улучшения сам. На связи всегда — получаете партнёра.',
      benefit: 'Помогу и после проекта с советом',
      icon: Handshake,
      color: '#c4a5ff', // PURPLE - фиолетовый
      colorBright: '#d9c4ff',
    },
    {
      id: 'transparency',
      title: 'Гарантии и прозрачность',
      description: 'Договор, поэтапная оплата, еженедельные отчёты, доступ к тестовой версии. Гарантия 12 месяцев.',
      benefit: 'Прозрачный процесс без сюрпризов',
      icon: ShieldCheck,
      color: '#ffb366', // CORAL - коралловый/оранжевый
      colorBright: '#ffcc99',
    },
  ];

  return (
    <section id="why-me" className="relative z-10 border-t border-border/60 py-section">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.whyMe.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.whyMe.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.2)}
          variants={staggerContainer}
        >
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <FlipCard
                  front={
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <div 
                        className="rounded-full p-4 flip-card-icon-bg"
                        style={{ 
                          '--icon-bg-color': advantage.colorBright,
                        } as React.CSSProperties}
                      >
                        <Icon className="w-12 h-12 flip-card-icon" />
                      </div>
                      <h3 className="font-heading text-xl text-center text-foreground">{t(`home.whyMe.items.${advantage.id}.title`)}</h3>
                    </div>
                  }
                  back={
                    <div className="space-y-4 h-full">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="rounded-lg p-2 flip-card-icon-bg"
                          style={{ 
                            '--icon-bg-color': advantage.colorBright,
                          } as React.CSSProperties}
                        >
                          <Icon className="w-5 h-5 flip-card-icon" />
                        </div>
                        <h3 className="font-heading text-lg">{t(`home.whyMe.items.${advantage.id}.title`)}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{t(`home.whyMe.items.${advantage.id}.description`)}</p>
                      <div 
                        className="rounded-lg border p-3 mt-auto flip-card-benefit"
                        style={{ 
                          '--benefit-color': advantage.color,
                          '--benefit-bg-color': advantage.colorBright,
                        } as React.CSSProperties}
                      >
                        <p className="text-xs font-semibold flip-card-benefit-text">
                          {t(`home.whyMe.items.${advantage.id}.benefit`)}
                        </p>
                      </div>
                    </div>
                  }
                  className="rounded-2xl"
                  backgroundColor={advantage.color}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

type ProcessStep = {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
  readonly output: string;
  readonly payment?: string;
};

type ProcessStepCardProps = {
  readonly step: ProcessStep;
  readonly t: ReturnType<typeof useTranslations>;
};

function ProcessStepCard({ step, t }: ProcessStepCardProps): ReactElement {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const y = useMotionValue(0);
  const outputOpacity = useTransform(y, [-60, -30, 0], [1, 0.5, 0]);
  const outputScale = useTransform(y, [-60, -30, 0], [1, 0.98, 0.95]);

  useMotionValueEvent(y, "change", (latest) => {
    if (latest < -20) {
      setShowOutput(true);
    } else if (latest > -10 && !isHovered && !isDragged) {
      setShowOutput(false);
    }
  });

  const handleDragEnd = (): void => {
    const currentY = y.get();
    if (currentY < -30) {
      setIsHovered(true);
      setIsDragged(true);
      setShowOutput(true);
    } else {
      setIsHovered(false);
      setIsDragged(false);
      setShowOutput(false);
    }
    y.set(0);
  };

  return (
    <motion.article
      className="group rounded-2xl border border-border/60 bg-surface/80 p-8 shadow-soft transition-all duration-300 hover:border-accent/60 hover:shadow-lg cursor-grab active:cursor-grabbing touch-none"
      variants={fadeInUp}
      drag="y"
      dragConstraints={{ top: -60, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => !isDragged && setIsHovered(true)}
      onMouseLeave={() => !isDragged && setIsHovered(false)}
      style={{ y }}
      whileDrag={{ 
        scale: 1.02,
        boxShadow: "0 20px 60px -20px rgba(0, 0, 0, 0.3)",
        zIndex: 10,
        cursor: "grabbing",
      }}
    >
      <div className="grid gap-6 md:grid-cols-[100px_1fr]">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-4xl font-heading text-accent mb-2">{step.number}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {step.duration}
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-2xl">{step.title}</h3>
          <p className="text-muted-foreground">{t(`home.process.steps.${step.id}.description`)}</p>
          <motion.div
            className="rounded-lg border border-accent/40 bg-accent/10 p-4 overflow-hidden"
            style={{
              opacity: showOutput || isHovered || isDragged ? (isHovered || isDragged ? 1 : outputOpacity) : 0,
              maxHeight: showOutput || isHovered || isDragged ? 300 : 0,
              marginTop: showOutput || isHovered || isDragged ? 12 : 0,
              scale: showOutput || isHovered || isDragged ? (isHovered || isDragged ? 1 : outputScale) : 0.95,
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.4 },
              scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              maxHeight: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              marginTop: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            {(showOutput || isHovered || isDragged) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-sm font-semibold text-accent mb-1">{t("home.process.outputLabel")}</p>
                <p className="text-sm text-muted-foreground">{t(`home.process.steps.${step.id}.output`)}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

function ProcessSection(): ReactElement {
  const t = useTranslations();
  const steps = [
    {
      id: 'consult',
      number: '01',
      title: t('home.process.steps.consult.title'),
      description: 'Разбираю вашу ситуацию, анализирую конкурентов. Озвучиваю примерную стоимость и сроки.',
      duration: t('home.process.steps.consult.duration'),
      output: 'Понимание, что нужно делать. Бесплатно.',
    },
    {
      id: 'scope',
      number: '02',
      title: t('home.process.steps.scope.title'),
      description: 'Детальное ТЗ с прототипами, план разработки, стратегия маркетинга, договор и график платежей.',
      duration: t('home.process.steps.scope.duration'),
      output: 'Полная картина проекта. Если что-то не нравится — меняем до старта.',
      payment: '30% от стоимости',
    },
    {
      id: 'development',
      number: '03',
      title: t('home.process.steps.development.title'),
      description: 'Пишу код, каждую неделю — созвон с отчётом, доступ к тестовой версии, вносим правки по ходу.',
      duration: t('home.process.steps.development.duration'),
      output: 'Видите прогресс. Никаких "чёрных ящиков".',
      payment: '40% по готовности 50% функционала',
    },
    {
      id: 'launch',
      number: '04',
      title: t('home.process.steps.launch.title'),
      description: 'Переносим на боевой сервер, настраиваю аналитику, запускаю рекламу, обучаю вашу команду.',
      duration: t('home.process.steps.launch.duration'),
      output: 'Работающий инструмент + первые заявки',
      payment: '30% после запуска',
    },
    {
      id: 'growth',
      number: '05',
      title: t('home.process.steps.growth.title'),
      description: 'Смотрю аналитику еженедельно, оптимизирую рекламу, предлагаю улучшения, поддержка 24/7.',
      duration: t('home.process.steps.growth.duration'),
      output: 'Стабильный рост продаж',
      payment: 'Абонентка от 80,000₸/мес (если нужна)',
    },
  ];

  return (
    <section id="process" className="border-t border-border/60 py-section bg-surface/40">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.process.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.process.title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t.rich("home.process.description", {
              highlight: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>,
            })}
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.2)}
          variants={staggerContainer}
        >
          {steps.map((step) => (
            <ProcessStepCard
              key={step.id}
              step={step}
              t={t}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

type GuaranteeItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
};

type GuaranteeCardProps = {
  readonly guarantee: GuaranteeItem;
  readonly t: ReturnType<typeof useTranslations>;
};

// Animation variants for guarantee cards
const guaranteeCardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function GuaranteeCard({ guarantee, t }: GuaranteeCardProps): ReactElement {
  const Icon = guarantee.icon;

  return (
    <motion.div
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-soft text-center cursor-pointer overflow-hidden relative"
      initial="initial"
      whileInView="animate"
      viewport={getViewportSettings(0.2)}
      variants={guaranteeCardVariants}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      }}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <motion.div
            className="rounded-lg bg-accent/10 p-3"
            whileHover={{
              scale: 1.1,
              opacity: 0.8,
              transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] as const,
              },
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, -10, 10, 0],
                transition: {
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1] as const,
                },
              }}
            >
              <Icon className="w-8 h-8 text-accent" />
            </motion.div>
          </motion.div>
        </div>
        <motion.h3
          className="font-heading text-lg mb-2"
          whileHover={{ color: 'var(--base-color-accent)' }}
          transition={{ duration: 0.2 }}
        >
          {t(`home.guarantees.items.${guarantee.id}.title`)}
        </motion.h3>
        <p className="text-sm text-muted-foreground">{t(`home.guarantees.items.${guarantee.id}.description`)}</p>
      </div>
    </motion.div>
  );
}

function GuaranteesSection(): ReactElement {
  const t = useTranslations();
  const guarantees: Array<GuaranteeItem> = [
    {
      id: 'warranty',
      title: 'Гарантия',
      description: '12 месяцев бесплатного исправления багов и поддержки',
      icon: Shield,
    },
    {
      id: 'contract',
      title: 'Договор',
      description: 'Работаю с ИП/ТОО, все условия прописаны в договоре',
      icon: FileText,
    },
    {
      id: 'payment',
      title: 'Оплата',
      description: '30% → 40% → 30%. Платите только за выполненную работу',
      icon: CreditCard,
    },
    {
      id: 'process',
      title: 'Процесс',
      description: 'Еженедельные созвоны, доступ к тестовой версии, видите весь прогресс',
      icon: Eye,
    },
  ];

  return (
    <section className="border-t border-border/60 py-section">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.guarantees.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.guarantees.title")}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.2)}
          variants={staggerContainer}
        >
          {guarantees.map((guarantee) => (
            <GuaranteeCard
              key={guarantee.id}
              guarantee={guarantee}
              t={t}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function PortfolioSection(): ReactElement {
  const t = useTranslations();
  const projects = getFeaturedProjects();

  return (
    <section className="border-t border-border/60 py-section">
      <Container className="space-y-12">
        <motion.div
          className="space-y-4 text-balance text-center"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
            variants={fadeInUp}
          >
            {t("home.portfolio.label")}
          </motion.p>
          <motion.h2
            className="font-heading text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            {t("home.portfolio.title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {t("home.portfolio.description")}
          </motion.p>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid gap-6 max-w-2xl w-full">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className="group relative rounded-2xl border border-border/60 bg-surface/80 overflow-hidden shadow-soft transition-all hover:-translate-y-2 hover:border-accent/70 hover:shadow-lg"
                initial="initial"
                whileInView="animate"
                viewport={getViewportSettings(0.2)}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/cases/${project.id}`}
                  className="block"
                  aria-label={t("cases.list.openCaseAria", { title: project.title })}
                >
                  <ProjectCardContent project={project} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {projects.length > 1 && (
          <motion.div
            className="text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
                 <Link
                   href="/cases"
                   className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/80 px-6 py-3 text-sm font-semibold normal-case text-foreground transition-all hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                 >
                  {t("common.cta.viewAllCases")}
                   <ArrowRight className="w-4 h-4" />
                 </Link>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

function ProjectCardContent({ project }: { readonly project: PortfolioProject }): ReactElement {
  return (
    <>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-xl group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function FinalCTASection(): ReactElement {
  const t = useTranslations();
  return (
    <section className="border-t border-border/60 py-section bg-gradient-to-b from-surface/40 to-surface/80">
      <Container className="max-w-4xl">
        <motion.div
          className="space-y-10 text-balance"
          initial="initial"
          whileInView="animate"
          viewport={getViewportSettings(0.1)}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div
            className="space-y-4 text-center"
            variants={fadeInUp}
          >
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground"
              variants={fadeInUp}
            >
              {t("home.finalCta.label")}
            </motion.p>
            <motion.h2
              className="font-heading text-3xl md:text-4xl lg:text-5xl"
              variants={fadeInUp}
            >
              {t("home.finalCta.title")}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {t("home.finalCta.description")}
            </motion.p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {[
              t("home.finalCta.benefits.item1"),
              t("home.finalCta.benefits.item2"),
              t("home.finalCta.benefits.item3"),
              t("home.finalCta.benefits.item4"),
            ].map((text, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/80 p-4 shadow-soft"
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="space-y-4 text-center"
            variants={fadeInUp}
          >
            <motion.p
              className="text-sm text-muted-foreground"
              variants={fadeInUp}
            >
              {t("home.finalCta.subtitle")}
            </motion.p>
            <motion.div
              variants={fadeInUp}
            >
              <Link
                href="/brief"
                className="btn-accent inline-flex items-center justify-center rounded-lg bg-accent px-10 py-5 text-base font-semibold normal-case border-2 shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("common.cta.getFreeConsultation")}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export default function Home(): ReactElement {
  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection />
        <StatsSection />
        <TechnologiesMarquee />
        <ExpertiseSection />
        <WhyMeSection />
        <ProcessSection />
        <GuaranteesSection />
        <PortfolioSection />
        <FinalCTASection />
      </main>
    </SiteShell>
  );
}
