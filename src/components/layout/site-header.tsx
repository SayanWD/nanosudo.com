"use client";

// Responsive site header with navigation and CTA.
import { useState } from "react";
import type { ReactElement } from "react";
import { useTranslations } from 'next-intl';

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/routing";
import { Container } from "./container";

const NAV_LINKS: Array<{ readonly href: string; readonly labelKey: string }> = [];

const BRIEF_ROUTE = "/brief";

/**
 * Logo text component
 * Shows "Sayan Roor" with first letters capitalized
 */
function AnimatedLogoText(): ReactElement {
  return (
    <span className="inline-block font-heading normal-case tracking-tight">
      Sayan Roor
    </span>
  );
}

export function SiteHeader(): ReactElement {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavigate = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-surface/60 backdrop-blur-xl transition-colors duration-200">
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href="/"
          className="group relative flex items-center font-heading text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          <AnimatedLogoText />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => {
            const className = "relative normal-case transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full";
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={className}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href={BRIEF_ROUTE}
            className="btn-accent hidden items-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold normal-case border-2 shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
          >
            {t('common.cta.submitRequest')}
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-surface hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            aria-label="Меню"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">Меню</span>
            <svg
              aria-hidden
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>
      <div
        id="mobile-navigation"
        className={cn(
          "border-t border-border/40 bg-surface/80 backdrop-blur-xl transition-all duration-300 md:hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => {
            const className = "rounded-lg px-3 py-2 text-sm font-medium normal-case text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigate}
                className={className}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
          <div className="mt-2 flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href={BRIEF_ROUTE}
              onClick={handleNavigate}
              className="btn-accent flex-1 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold normal-case border-2 shadow-soft transition-all hover:bg-accent/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('common.cta.submitRequest')}
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
