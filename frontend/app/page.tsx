"use client";
import React, { useState } from "react";
import { TopHeader } from "@/components/ui/TopHeader";

const mockEvents = [
  {
    id: 1,
    year: 1904,
    title:
      "اهدای اولین نشان‌های ورزشی به دانشجویان سال آخر دانشگاه شیکاگو با حرف اختصاصی C.",
    category: "فوتبال",
  },
  {
    id: 2,
    year: 1922,
    title: "تیم گرین‌بی پکرز رسماً به لیگ NFL بازگشت.",
    category: "فوتبال آمریکایی",
  },
  {
    id: 3,
    year: 1929,
    title:
      "کالین گریگوری بریتانیایی تنها عنوان گرند اسلم خود را در استرالیا کسب کرد.",
    category: "تنیس",
  },
  {
    id: 4,
    year: 1939,
    title:
      "جان برومویچ با پیروزی قاطع، قهرمان مسابقات انفرادی استرالیا شد.",
    category: "تنیس",
  },
];

const tabs = [
  { key: "events", label: "رویدادها" },
  { key: "birthdays", label: "تولدها" },
  { key: "deaths", label: "درگذشتگان" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <main dir="rtl" className="bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
      <TopHeader />
        {/* Tabs */}
        <div className="flex gap-10 border-b border-gray-200 mb-12">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pb-4 text-sm font-black tracking-wide ${activeTab === t.key
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-900"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Timeline */}
          <section className="lg:col-span-8 space-y-8">
            {mockEvents.map((event) => (
              <article
                key={event.id}
                className="grid grid-cols-[80px_1fr] gap-6 border-b border-gray-100 pb-8"
              >
                {/* Year */}
                <div className="text-2xl font-black tabular-nums text-gray-900">
                  {event.year}
                </div>

                {/* Text */}
                <div>
                  <p className="text-gray-900 leading-relaxed font-medium">
                    {event.title}
                  </p>

                  <span className="inline-block mt-3 text-xs font-bold tracking-widest uppercase text-gray-400">
                    {event.category}
                  </span>
                </div>
              </article>
            ))}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">

            {/* Today Highlight */}
            <div>
              <h3 className="text-sm font-black tracking-widest uppercase mb-4 border-r-4 border-otd-yellow pr-3">
                ویژه امروز
              </h3>
              <p className="text-gray-700 leading-relaxed">
                سال ۱۹۸۶ — مایک تایسون جوان‌ترین قهرمان تاریخ بوکس سنگین‌وزن شد و
                مسیر جدیدی در این ورزش ترسیم کرد.
              </p>
            </div>

            {/* Newsletter */}
            <div className="border-t border-gray-200 pt-8">
              <h4 className="font-black text-lg mb-3">
                دریافت رویدادهای تاریخی
              </h4>
              <p className="text-gray-500 text-sm mb-6">
                مهم‌ترین لحظات تاریخ ورزش را هر روز در ایمیل خود دریافت کنید.
              </p>
              <button className="border border-gray-900 px-6 py-3 rounded-full font-black text-sm">
                عضویت در خبرنامه
              </button>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}