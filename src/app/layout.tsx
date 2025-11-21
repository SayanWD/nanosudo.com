import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}

