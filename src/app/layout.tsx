import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono as JetBrainsMono,
  Manrope,
} from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://nanosudo.com"),
  title: {
    default: "Sayan Roor — Full-stack разработчик Next.js",
    template: "%s | Sayan Roor",
  },
  description:
    "Full-stack разработчик из Алматы. Создаю быстрые сайты и веб-приложения на Next.js, TypeScript и Supabase с измеримым результатом для бизнеса.",
  keywords: [
    "Next.js разработчик",
    "Full-stack разработка",
    "TypeScript",
    "Almaty web developer",
    "Sayan Roor",
  ],
  authors: [{ name: "Sayan Roor", url: "https://nanosudo.com" }],
  creator: "Sayan Roor",
  publisher: "Sayan Roor",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://nanosudo.com",
    title: "Sayan Roor — Full-stack разработчик Next.js",
    description:
      "Профессиональный портфолио сайт: кейсы, процесс работы и интерактивный бриф. Создаю продукты, которые загружаются за секунды и конвертируют лиды.",
    siteName: "nanosudo.com",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayan Roor — Full-stack разработчик Next.js",
    description:
      "Создаю сайты и веб-приложения, которые приносят результат. Специализация: Next.js, TypeScript, Supabase.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  const fontVariables = `${inter.variable} ${manrope.variable} ${jetBrainsMono.variable}`;

  return (
    <html
      lang="ru"
      className="scroll-smooth bg-background text-foreground"
      suppressHydrationWarning
    >
      <body className={`${fontVariables} font-sans antialiased`}>
        <a className="skip-link" href="#main-content">
          Перейти к основному контенту
        </a>
        {children}
      </body>
    </html>
  );
}
