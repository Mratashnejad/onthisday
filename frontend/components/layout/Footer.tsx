import Link from "next/link";

export function Footer() {
  const navLinks = [
    { name: "صفحه اصلی", href: "/" },
    { name: "امروز", href: "/today" },
    { name: "رویدادها", href: "/" },
    { name: "تولدها", href: "/birthdays" },
    { name: "درگذشتگان", href: "/deaths" },
    { name: "افراد", href: "/persons" },
    { name: "ورزش‌ها", href: "/sports" },
  ];

  const infoLinks = [
    { name: "درباره پروژه", href: "/about" },
    { name: "حریم خصوصی", href: "/privacy" },
    { name: "شرایط استفاده", href: "/terms" },
    { name: "ورود مدیریت", href: "/admin/login" },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0b1222] via-[#0d1628] to-[#090f1d]">
      <div className="absolute left-1/2 top-0 h-px w-full max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="display-fa text-2xl font-black text-white md:text-3xl">
              تقویم رویدادهای ورزشی جهان
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              جست‌وجو در تاریخ، مرور رخدادها، زادروزها و درگذشتگان ورزش در نمایی یکپارچه و فارسی.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-200">
              رویدادها
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-200">
              تولدها
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-200">
              درگذشتگان
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-brand-gold">
              ناوبری سریع
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-brand-gold">
              دسته‌بندی‌ها
            </h4>
            <div className="flex flex-wrap gap-2">
              {["فوتبال", "بسکتبال", "والیبال", "تنیس", "کشتی", "المپیک"].map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                >
                  {name}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              پایگاه داده این پروژه به‌صورت پیوسته با داده‌های جدید فارسی تکمیل می‌شود تا مرور تاریخ ورزش برای کاربران
              فارسی‌زبان دقیق‌تر و سریع‌تر باشد.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-brand-gold">
              اطلاعات و پشتیبانی
            </h4>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              {infoLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-xs text-brand-paper">
              برای ویرایش داده‌ها از بخش مدیریت استفاده کنید.
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
          <div>© ۲۰۲۶ «در این روز» — مرجع آنلاین تاریخ ورزش جهان</div>
          <div className="text-slate-400">Today In Sports History | Persian Edition</div>
        </div>
      </div>
    </footer>
  );
}
