import type { ReactNode } from "react";

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html suppressHydrationWarning data-theme="dark">
      <body>{children}</body>
    </html>
  );
}


