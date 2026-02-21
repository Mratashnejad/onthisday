import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما | در این روز",
  description: "معرفی پروژه در این روز برای آرشیو تاریخ ورزش",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <section className="rounded-3xl border border-brand-navy/14 bg-white/75 p-6 shadow-[0_26px_60px_-50px_rgba(16,39,63,0.6)] md:p-10">
        <h1 className="display-fa text-4xl text-brand-navy md:text-5xl">درباره پروژه</h1>

        <p className="mt-6 leading-8 text-brand-ink/90">
          <strong>در این روز</strong> یک آرشیو تخصصی برای ثبت اتفاقات مهم تاریخ ورزش
          است. تمرکز پروژه فقط روی داده‌های معتبر، ساختارمند و قابل‌جستجو قرار
          دارد تا هر روز بتوان رویدادهای تاریخی همان روز را دید.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-brand-navy/12 bg-brand-paper/55 p-5">
            <h2 className="mb-2 text-xl font-bold text-brand-navy">ماموریت</h2>
            <p className="leading-8 text-brand-ink/85">
              ارائه یک مرجع روزانه برای تاریخ ورزش جهان با تمرکز بر دقت داده و
              تجربه کاربری ساده و حرفه‌ای.
            </p>
          </article>

          <article className="rounded-2xl border border-brand-navy/12 bg-brand-paper/55 p-5">
            <h2 className="mb-2 text-xl font-bold text-brand-navy">فناوری</h2>
            <p className="leading-8 text-brand-ink/85">
              فرانت‌اند با Next.js و داده‌ها از طریق GraphQL codegen به‌صورت تایپ
              شده مستقیم از بک‌اند خوانده می‌شود.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
