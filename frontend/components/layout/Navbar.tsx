"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mainNavItems = [
  { name: "امروز", href: "/" },
  { name: "تولدها", href: "/birthdays" },
  { name: "درگذشتگان", href: "/deaths" },
  { name: "ورزش‌ها", href: "/sports" },
  { name: "افراد", href: "/persons" },
  { name: "درباره", href: "/about" },
];

const utilityNavItems = [
  { name: "حریم خصوصی", href: "/privacy" },
  { name: "پنل مدیریت", href: "/admin/login" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0b1222] shadow-xl shadow-black/35 border-b border-brand-gold/25"
          : "bg-[#0b1222]/95 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-brand-navy/90 via-[#15243a]/90 to-brand-navy/90">
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-2 text-xs text-slate-100 md:flex md:px-10">
          <p className="text-slate-100/95">مرجع فارسی رویدادهای تاریخ ورزش جهان</p>
          <div className="flex items-center gap-5">
            {utilityNavItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-slate-100/90 transition-colors hover:text-brand-gold">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-gold/90 to-amber-300/85 text-brand-navy shadow-md shadow-brand-gold/20">
            <span className="text-base font-black">۲۴</span>
          </div>
          <div className="display-fa text-2xl font-bold tracking-tight text-white">
            در این <span className="text-brand-gold">روز</span>
            <p className="mt-0.5 text-[11px] font-medium text-slate-200">
              تقویم تاریخ ورزش
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-white/20 bg-white/[0.08] p-1 md:flex">
          {mainNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-brand-gold text-brand-navy shadow"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((previous) => !previous)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white md:hidden"
          aria-label="منوی ناوبری"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl leading-none">{mobileOpen ? "×" : "≡"}</span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#0b1222]/95 px-4 pb-5 pt-3 md:hidden">
          <div className="grid gap-2">
            {mainNavItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-gold text-brand-navy"
                      : "bg-white/[0.04] text-slate-200 hover:bg-white/[0.1]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {utilityNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
