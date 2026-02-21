import Link from "next/link";
import { executeGraphql } from "@/lib/graphql-client";
import { SportEventType, SportEventsPageDocument, type SportEventsPageQuery } from "@/gql/graphql";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

type MonthDay = {
  day: number;
  month: number;
};

const faDateFormatter = new Intl.DateTimeFormat("fa-IR", {
  month: "long",
  day: "numeric",
});

const faMonthFormatter = new Intl.DateTimeFormat("fa-IR", {
  month: "long",
});

const faWeekdayFormatter = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
});

const faNumberFormatter = new Intl.NumberFormat("fa-IR");

function parseSingleValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function parseIntValue(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function isValidMonthDay(input: MonthDay): boolean {
  if (input.month < 1 || input.month > 12 || input.day < 1 || input.day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(2024, input.month - 1, input.day));
  return date.getUTCMonth() === input.month - 1 && date.getUTCDate() === input.day;
}

function getTodayMonthDay(): MonthDay {
  const today = new Date();
  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
  };
}

function getSelectedMonthDay(searchParams: SearchParams | undefined): MonthDay {
  const fallback = getTodayMonthDay();

  if (!searchParams) {
    return fallback;
  }

  const day = parseIntValue(parseSingleValue(searchParams.day));
  const month = parseIntValue(parseSingleValue(searchParams.month));

  if (day == null || month == null) {
    return fallback;
  }

  const candidate = { day, month };
  return isValidMonthDay(candidate) ? candidate : fallback;
}

function getDateLabel(date: MonthDay): string {
  const base = new Date(Date.UTC(2024, date.month - 1, date.day));
  return faDateFormatter.format(base);
}

function getMonthLabel(month: number): string {
  const base = new Date(Date.UTC(2024, month - 1, 1));
  return faMonthFormatter.format(base);
}

function getWeekdayLabel(date: MonthDay): string {
  const base = new Date(Date.UTC(2024, date.month - 1, date.day));
  return faWeekdayFormatter.format(base);
}

function toFaNumber(value: number): string {
  return faNumberFormatter.format(value);
}

function getDaysInMonth(month: number): number {
  return new Date(Date.UTC(2024, month, 0)).getUTCDate();
}

function clampDayToMonth(day: number, month: number): number {
  return Math.min(day, getDaysInMonth(month));
}

function shiftMonthDay(date: MonthDay, offset: number): MonthDay {
  const base = new Date(Date.UTC(2024, date.month - 1, date.day));
  base.setUTCDate(base.getUTCDate() + offset);

  return {
    day: base.getUTCDate(),
    month: base.getUTCMonth() + 1,
  };
}

function buildPageHref(date: MonthDay, sportSlug: string | null): string {
  const query = new URLSearchParams({
    day: String(date.day),
    month: String(date.month),
  });

  if (sportSlug) {
    query.set("sport", sportSlug);
  }

  return `/?${query.toString()}`;
}

function buildMonthHref(month: number, day: number, sportSlug: string | null): string {
  return buildPageHref(
    {
      day: clampDayToMonth(day, month),
      month,
    },
    sportSlug,
  );
}

function getEventTypeLabel(type: SportEventType): string {
  switch (type) {
    case SportEventType.Achievement:
      return "افتخار";
    case SportEventType.MatchResult:
      return "نتیجه بازی";
    case SportEventType.Retirement:
      return "خداحافظی";
    case SportEventType.Transfer:
      return "انتقال";
    case SportEventType.WorldRecord:
      return "رکورد جهانی";
    case SportEventType.Scandal:
      return "حاشیه";
    case SportEventType.Other:
    default:
      return "سایر";
  }
}

async function loadSportEvents(
  day: number,
  month: number,
  sportSlug: string | null,
): Promise<{ data: SportEventsPageQuery | null; error: string | null }> {
  try {
    const data = await executeGraphql(SportEventsPageDocument, {
      day,
      month,
      sportSlug,
    });
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در دریافت داده از GraphQL";
    return { data: null, error: message };
  }
}

/* ----- منطق شما بدون تغییر باقی مانده ----- */
/* (همه توابع بالا دست نخورده هستند) */

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedDate = getSelectedMonthDay(resolvedSearchParams);
  const sportSlugValue = parseSingleValue(resolvedSearchParams?.sport);
  const selectedSportSlug =
    sportSlugValue && sportSlugValue.trim().length > 0 ? sportSlugValue.trim().toLowerCase() : null;

  const { data, error } = await loadSportEvents(selectedDate.day, selectedDate.month, selectedSportSlug);

  const events = data?.sportEvents ?? [];
  const sports = data?.sports ?? [];
  const previousDate = shiftMonthDay(selectedDate, -1);
  const nextDate = shiftMonthDay(selectedDate, 1);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const monthDays = Array.from({ length: getDaysInMonth(selectedDate.month) }, (_, index) => index + 1);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f7f9] text-gray-800">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        {/* =========================
            HEADER SECTION
        ========================== */}
        <div className="mb-14 border-b border-gray-200 pb-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Date Block */}
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-20 flex-col items-center justify-center rounded-2xl bg-[#f0d44f] text-white shadow-md">
                <span className="text-4xl font-extrabold">{toFaNumber(selectedDate.day)}</span>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  رویدادهای ورزشی در <span className="text-[#0088cc]">{getDateLabel(selectedDate)}</span>
                </h1>

                <p className="mt-3 text-sm text-gray-500">{getWeekdayLabel(selectedDate)} — آرشیو تاریخ ورزش جهان</p>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm text-sm">
              <Link
                href={buildPageHref(previousDate, selectedSportSlug)}
                className="px-5 py-3 hover:bg-gray-50 transition"
              >
                روز قبل
              </Link>

              <Link
                href={buildPageHref(getTodayMonthDay(), selectedSportSlug)}
                className="border-x border-gray-200 bg-gray-50 px-5 py-3 font-semibold"
              >
                امروز
              </Link>

              <Link href={buildPageHref(nextDate, selectedSportSlug)} className="px-5 py-3 hover:bg-gray-50 transition">
                روز بعد
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-[#1b2b42] px-4 py-5 text-white md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold text-3xl font-black text-brand-navy">
                  {toFaNumber(selectedDate.day)}
                </div>
                <div>
                  <p className="text-xs font-black tracking-wider text-brand-gold">تقویم ماهانه</p>
                  <h2 className="mt-1 text-2xl font-black">
                    {getMonthLabel(selectedDate.month)} | {getWeekdayLabel(selectedDate)}
                  </h2>
                </div>
              </div>

              <div className="flex overflow-hidden rounded-xl border border-white/20 bg-white/5 text-xs">
                <Link href={buildPageHref(previousDate, selectedSportSlug)} className="px-4 py-2.5 transition hover:bg-white/10">
                  روز قبل
                </Link>
                <Link
                  href={buildPageHref(getTodayMonthDay(), selectedSportSlug)}
                  className="border-x border-white/20 bg-brand-gold px-4 py-2.5 font-bold text-brand-navy"
                >
                  امروز
                </Link>
                <Link href={buildPageHref(nextDate, selectedSportSlug)} className="px-4 py-2.5 transition hover:bg-white/10">
                  روز بعد
                </Link>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 px-4 py-4 md:px-6">
            <p className="mb-3 text-xs font-black tracking-wider text-slate-500">ماه‌ها</p>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <Link
                  key={month}
                  href={buildMonthHref(month, selectedDate.day, selectedSportSlug)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    month === selectedDate.month
                      ? "bg-brand-navy text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {getMonthLabel(month)}
                </Link>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 md:px-6">
            <p className="mb-3 text-xs font-black tracking-wider text-slate-500">
              روزهای ماه {getMonthLabel(selectedDate.month)}
            </p>
            <div className="grid grid-cols-7 gap-2 sm:grid-cols-10 md:grid-cols-12">
              {monthDays.map((day) => (
                <Link
                  key={day}
                  href={buildPageHref({ day, month: selectedDate.month }, selectedSportSlug)}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                    day === selectedDate.day
                      ? "bg-brand-gold text-brand-navy"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-brand-cyan/60 hover:text-brand-cyan"
                  }`}
                >
                  {toFaNumber(day)}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-slate-200 text-center text-xs font-bold">
            <Link href={buildPageHref(selectedDate, selectedSportSlug)} className="px-2 py-3 text-slate-800 transition hover:bg-slate-50">
              رویدادها ({toFaNumber(events.length)})
            </Link>
            <Link href={`/birthdays?day=${selectedDate.day}&month=${selectedDate.month}`} className="border-x border-slate-200 px-2 py-3 text-slate-700 transition hover:bg-slate-50">
              تولدها
            </Link>
            <Link href={`/deaths?day=${selectedDate.day}&month=${selectedDate.month}`} className="px-2 py-3 text-slate-700 transition hover:bg-slate-50">
              درگذشتگان
            </Link>
          </div>
        </section>

        {/* =========================
            CONTENT GRID
        ========================== */}
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* =========================
              EVENTS LIST
          ========================== */}
          <div className="space-y-12">
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                خطا در اتصال به بک‌اند: {error}
              </div>
            )}

            {!error && events.length === 0 && (
              <p className="text-sm text-gray-500">
                برای تاریخ {getDateLabel(selectedDate)} هنوز رویدادی ثبت نشده است.
              </p>
            )}

            {events.map((event) => {
              const headline = event.headline ?? event.fullDescription ?? "رویداد بدون عنوان";

              return (
                <article
                  key={event.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl"
                >
                  {/* Year Watermark */}
                  <div className="absolute left-10 top-10 text-7xl font-extrabold text-gray-100 transition group-hover:text-gray-200">
                    {toFaNumber(event.year)}
                  </div>

                  <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
                    <div className="h-52 overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={event.mediaUrl || `https://picsum.photos/seed/home-event-${event.id}/1200/700`}
                        alt={headline}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>

                    {/* Sport Label */}
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0088cc]">
                      {event.sport?.name ?? "ورزش عمومی"}
                    </p>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">{headline}</h3>

                    {/* Description */}
                    <p className="text-sm leading-8 text-gray-600">{event.fullDescription || headline}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{getEventTypeLabel(event.type)}</span>
                      <span>•</span>
                      <span>{toFaNumber(event.year)}</span>
                    </div>

                    <div>
                      <Link
                        href={`/sports/${event.id}`}
                        className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        مشاهده جزئیات
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* =========================
              SIDEBAR
          ========================== */}
          <aside className="sticky top-28 h-fit rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-gray-900">فیلتر بر اساس ورزش</h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link
                href={buildPageHref(selectedDate, null)}
                className={`rounded-xl px-4 py-2 transition ${
                  !selectedSportSlug ? "bg-[#0088cc] text-white font-semibold" : "hover:bg-gray-100"
                }`}
              >
                همه ورزش‌ها
              </Link>

              {sports.map((sport) => (
                <Link
                  key={sport.id}
                  href={buildPageHref(selectedDate, sport.slug)}
                  className={`rounded-xl px-4 py-2 transition ${
                    selectedSportSlug === sport.slug ? "bg-[#0088cc] text-white font-semibold" : "hover:bg-gray-100"
                  }`}
                >
                  {sport.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
