import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  icons: {
    icon: "/Nanosudo_logo_favicon.png",
    shortcut: "/Nanosudo_logo_favicon.png",
    apple: "/Nanosudo_logo_dark.png",
  },
};

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html suppressHydrationWarning data-theme="dark">
      <head>
        <meta name="apple-mobile-web-app-title" content="Nano Sudo" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-for-app/apple-icon.png" />
        <link rel="icon" href="/favicon-for-app/favicon.ico" />
        <link rel="mask-icon" href="/favicon-for-app/icon0.svg" color="#000000" />
        <link rel="manifest" href="/favicon-for-app/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NC3L984P"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NC3L984P');
          `}
        </Script>

        {/* Google tag (gtag.js) - GA4 */}
        <Script
          id="ga4-base"
          src="https://www.googletagmanager.com/gtag/js?id=G-L02KBFS5DK"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L02KBFS5DK');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}

