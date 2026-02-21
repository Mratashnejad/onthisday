import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// تنظیمات Viewport برای نمایش بهتر در موبایل و جلوگیری از زوم ناخواسته
export const viewport: Viewport = {
  themeColor: "#10273f", // رنگ برند نیوی شما
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | آرشیو تاریخ ورزش",
    default: "در این روز | تقویم تاریخ ورزش جهان",
  },
  description: "مرور زنده و لحظه‌ای تمامی اتفاقات، رکوردها و حواشی دنیای ورزش در چنین روزی.",
  keywords: ["ورزش", "تاریخ ورزش", "رویدادهای ورزشی", "در این روز", "فوتبال", "رکورد"],
  authors: [{ name: "Sport History Team" }],
  openGraph: {
    title: "در این روز | آرشیو تاریخ ورزش",
    description: "تاریخ ورق می‌خورد؛ رویدادهای ورزشی امروز را از دست ندهید.",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col antialiased selection:bg-brand-gold/30 selection:text-brand-gold">
      {/* لایه پوششی برای ایجاد نویز ظریف در پس‌زمینه (حس حرفه‌ای) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

      {/* هاله نوری پس‌زمینه برای عمق دادن به صفحه */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-brand-cyan/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-brand-gold/5 blur-[120px]" />
      </div>

      <Navbar />

      {/* کانتینر اصلی با Padding مناسب برای موبایل و دسکتاپ */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
