import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  icons: {
    icon: "/Nano_sudo_logo_dark.png",
    shortcut: "/Nano_sudo_logo_dark.png",
    apple: "/Nano_sudo_logo_dark.png",
  },
};

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html suppressHydrationWarning data-theme="dark">
      <body>{children}</body>
    </html>
  );
}

