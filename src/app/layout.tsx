import type { ReactNode } from "react";

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}


