"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAdminDashboard } from "@/components/admin/useAdminDashboard";
import {
  AdminFeedback,
  AdminLoading,
  AdminPageHeader,
  primaryButtonClass,
} from "@/components/admin/ui";

const entityLinks = [
  {
    title: "ورزش‌ها",
    description: "مدیریت نوع ورزش‌ها و مشخصات پایه",
    href: "/admin/sports",
    countKey: "sports",
  },
  {
    title: "مکان‌ها",
    description: "مدیریت شهرها، کشورها و محل رویداد",
    href: "/admin/locations",
    countKey: "locations",
  },
  {
    title: "رقابت‌ها",
    description: "مدیریت لیگ‌ها و تورنمنت‌ها",
    href: "/admin/competitions",
    countKey: "competitions",
  },
  {
    title: "تیم‌ها",
    description: "مدیریت تیم‌ها و وابستگی‌ها",
    href: "/admin/teams",
    countKey: "teams",
  },
  {
    title: "اشخاص",
    description: "مدیریت افراد، ورزش‌ها و تیم‌های مرتبط",
    href: "/admin/persons",
    countKey: "persons",
  },
  {
    title: "رویدادها",
    description: "مدیریت رویدادهای تاریخی ورزشی",
    href: "/admin/events",
    countKey: "events",
  },
] as const;

export default function AdminPage() {
  const { dashboard, loading, message, error, logout } = useAdminDashboard();

  const counts = useMemo(
    () => ({
      sports: dashboard?.adminSports.length ?? 0,
      locations: dashboard?.adminLocations.length ?? 0,
      competitions: dashboard?.adminCompetitions.length ?? 0,
      teams: dashboard?.adminTeams.length ?? 0,
      persons: dashboard?.adminPersons.length ?? 0,
      events: dashboard?.adminSportEvents.length ?? 0,
    }),
    [dashboard],
  );

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="داشبورد مدیریت"
        description="برای هر موجودیت وارد صفحه اختصاصی شوید و عملیات CRUD را انجام دهید."
      >
        <button onClick={logout} type="button" className={primaryButtonClass}>
          خروج
        </button>
      </AdminPageHeader>

      <AdminFeedback message={message} error={error} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {entityLinks.map((item) => (
          <article key={item.href} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-gray-900">
              {counts[item.countKey]}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              ورود به صفحه
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
