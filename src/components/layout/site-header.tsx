"use client";

// Responsive site header with navigation and CTA.
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import type { ReactElement } from "react";

import { cn } from "@/lib/cn";
import { Container } from "./container";

const NAV_LINKS: Array<{ readonly href: string; readonly label: string }> = [
  { href: "#services", label: "Услуги" },
  { href: "#process", label: "Процесс" },
  { href: "#portfolio", label: "Кейсы" },
  { href: "#contact", label: "Контакты" },
];

const HOME_ROUTE = "/" as Route;
const BRIEF_ROUTE = "/brief" as Route;

export function SiteHeader(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavigate = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <div className="border-border/70 bg-surface/70 backdrop-blur-xl transition-colors duration-200">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href={HOME_ROUTE}
          className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-soft">
            SR
          </span>
          <span>Sayan Roor</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={BRIEF_ROUTE}
            className="hidden items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
          >
            Заполнить бриф
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            aria-label="Меню"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">Меню</span>
            <svg
              aria-hidden
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>
      <div
        id="mobile-navigation"
        className={cn(
          "border-t border-border/70 bg-surface/95 backdrop-blur-xl transition-[max-height,opacity] duration-200 md:hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-4 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavigate}
              className="text-sm font-semibold text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={BRIEF_ROUTE}
            onClick={handleNavigate}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Заполнить бриф
          </Link>
        </Container>
      </div>
    </div>
  );
}
