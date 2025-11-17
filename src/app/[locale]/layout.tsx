import type { ReactElement } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  Inter,
  JetBrains_Mono as JetBrainsMono,
  Manrope,
} from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const jetBrainsMono = JetBrainsMono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
  variable: "--font-mono",
});

export function generateStaticParams(): Array<{ locale: string }> {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  readonly children: React.ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps): Promise<ReactElement> {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <div lang={locale} className={`${inter.variable} ${manrope.variable} ${jetBrainsMono.variable} font-sans antialiased scroll-smooth bg-background text-foreground`}>
      <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#main-content">
            Перейти к основному контенту
          </a>
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}

