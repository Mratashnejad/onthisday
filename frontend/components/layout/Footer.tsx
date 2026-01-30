"use client";
import React from "react";
import Link from "next/link";
export function Footer() {
  return (
    <footer dir="rtl" className="bg-white border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-8 py-20">

        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Brand */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-otd-blue rounded-xl flex items-center justify-center">
                <span className="font-black text-lg text-otd-blue">LOGO</span>
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">
                  ON THIS <span className="text-otd-yellow">DAY</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[3px] text-gray-400">
                  Sports History Archive
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              <strong>On This Day</strong> یک آرشیو مستقل از مهم‌ترین
              لحظات تاریخ ورزش است؛ جایی برای ثبت رکوردها، تولد
              اسطوره‌ها و رویدادهایی که مسیر ورزش جهان را تغییر داده‌اند.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black tracking-widest uppercase mb-6">
              دسترسی‌ها
            </h4>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-black tracking-widest uppercase mb-6">
              خبرنامه
            </h4>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              مهم‌ترین رویدادهای تاریخی ورزش را هر روز
              به‌صورت خلاصه در ایمیل خود دریافت کنید.
            </p>

            <div className="flex border border-gray-300 rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 px-5 py-3 text-sm outline-none"
              />
              <button className="px-6 font-black text-sm border-r border-gray-300">
                عضویت
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-gray-500">
          <p className="font-bold tracking-wide">
            © 2026 ON THIS DAY · SPORTS HISTORY
          </p>

          <div className="flex gap-8 font-bold uppercase tracking-wider">
            <Link href="/privacy" className="hover:text-otd-yellow transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-otd-yellow transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-otd-yellow transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}