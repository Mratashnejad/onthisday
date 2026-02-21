import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حریم خصوصی | در این روز",
  description: "جزئیات سیاست حریم خصوصی پروژه در این روز",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <section className="rounded-3xl border border-brand-navy/14 bg-white/75 p-6 shadow-[0_26px_60px_-50px_rgba(16,39,63,0.6)] md:p-10">
        <h1 className="display-fa text-4xl text-brand-navy md:text-5xl">حریم خصوصی</h1>

        <p className="mt-6 leading-8 text-brand-ink/90">
          این وب‌سایت اطلاعات کاربری شخصی را برای پروفایل‌سازی ذخیره نمی‌کند.
          داده‌هایی که در صفحه مشاهده می‌کنید فقط داده‌های آرشیوی تاریخ ورزش هستند.
        </p>

        <p className="mt-4 leading-8 text-brand-ink/85">
          هرگونه ثبت لاگ یا اطلاعات فنی مربوط به زیرساخت سرور، تابع تنظیمات
          بک‌اند و سیاست‌های نگه‌داری شما است.
        </p>
      </section>
    </main>
  );
}
