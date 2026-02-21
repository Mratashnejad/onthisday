import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "در این روز | تاریخ ورزش",
  description: "آرشیو تاریخ ورزش جهان",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
