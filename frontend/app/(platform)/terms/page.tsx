import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "قوانین استفاده | در این روز",
  description: "قوانین استفاده از آرشیو تاریخ ورزش در این روز",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <section className="rounded-3xl border border-brand-navy/14 bg-white/75 p-6 shadow-[0_26px_60px_-50px_rgba(16,39,63,0.6)] md:p-10">
        <h1 className="display-fa text-4xl text-brand-navy md:text-5xl">
          قوانین استفاده
        </h1>

        <p className="mt-6 leading-8 text-brand-ink/90">
          استفاده از داده‌های این وب‌سایت به معنی پذیرش قوانین داخلی پروژه شما
          برای انتشار، استناد و بازنشر محتوا است.
        </p>

        <p className="mt-4 leading-8 text-brand-ink/85">
          منبع داده‌ها API GraphQL بک‌اند است و مسئولیت صحت نهایی داده‌ها مطابق
          سیاست مدیریتی دیتابیس پروژه با شما خواهد بود.
        </p>
      </section>
    </main>
  );
}
