import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما | On This Day",
  description:
    "آشنایی با پروژه On This Day، آرشیو تاریخ ورزش و رویدادهای ماندگار",
};

export default function AboutPage() {
  return (
    <main className="bg-white RTL">
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-black mb-8">درباره On This Day</h1>

        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          <strong>On This Day</strong> پروژه‌ای مستقل برای ثبت، آرشیو و روایت
          مهم‌ترین لحظات تاریخ ورزش است؛ از تولد اسطوره‌ها تا رکوردهایی که مسیر
          ورزش جهان را تغییر داده‌اند.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-black mb-3">ماموریت ما</h2>
            <p className="text-gray-600 leading-relaxed">
              ارائه‌ی دقیق‌ترین و معتبرترین آرشیو روزانه از تاریخ ورزش، با تمرکز
              بر کیفیت محتوا و تجربه کاربری.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black mb-3">چرا این پروژه؟</h2>
            <p className="text-gray-600 leading-relaxed">
              تاریخ ورزش فقط عدد و نتیجه نیست؛ داستان انسان‌ها، اراده‌ها و
              لحظاتی است که الهام‌بخش نسل‌ها شده‌اند.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}