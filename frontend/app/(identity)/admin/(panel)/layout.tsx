'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const adminNavItems = [
  { name: "داشبورد", href: "/admin" },
  { name: "ورزش‌ها", href: "/admin/sports" },
  { name: "مکان‌ها", href: "/admin/locations" },
  { name: "رقابت‌ها", href: "/admin/competitions" },
  { name: "تیم‌ها", href: "/admin/teams" },
  { name: "اشخاص", href: "/admin/persons" },
  { name: "رویدادها", href: "/admin/events" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 text-gray-800">

      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-gray-900">
            پنل مدیریت سایت
          </h1>

          <Link
            href="/"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            بازگشت به سایت
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-l bg-white lg:block">
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-md px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
