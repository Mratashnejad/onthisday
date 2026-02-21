import Link from "next/link";
import { executeGraphql } from "@/lib/graphql-client";
import { SportEventsPageDocument, type SportEventsPageQuery } from "@/gql/graphql";

type SearchParams = Record<string, string | string[] | undefined>;

type MonthDay = {
  day: number;
  month: number;
};

type DatedEventListPageProps = {
  searchParams: SearchParams | undefined;
  mode: "birthday" | "death";
};

const faDateFormatter = new Intl.DateTimeFormat("fa-IR", {
  month: "long",
  day: "numeric",
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

function getTodayMonthDay(): MonthDay {
  const today = new Date();
  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
  };
}

function isValidMonthDay(input: MonthDay): boolean {
  if (input.month < 1 || input.month > 12 || input.day < 1 || input.day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(2024, input.month - 1, input.day));
  return date.getUTCMonth() === input.month - 1 && date.getUTCDate() === input.day;
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

  return `?${query.toString()}`;
}

function toFaNumber(value: number): string {
  return faNumberFormatter.format(value);
}

function isBirthdayEvent(event: SportEventsPageQuery["sportEvents"][number]): boolean {
  const headline = event.headline ?? "";
  return (
    event.slug.startsWith("fa-birthday-")
    || event.slug.startsWith("fa-birthday-plus-")
    || headline.includes("زادروز")
    || headline.includes("تولد")
  );
}

function isDeathEvent(event: SportEventsPageQuery["sportEvents"][number]): boolean {
  const headline = event.headline ?? "";
  return (
    event.slug.startsWith("fa-death-")
    || event.slug.startsWith("fa-death-plus-")
    || headline.includes("درگذشت")
    || headline.includes("سالروز")
  );
}

async function loadData(
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
    return {
      data: null,
      error: error instanceof Error ? error.message : "خطا در دریافت داده‌ها",
    };
  }
}

export async function DatedEventListPage({ searchParams, mode }: DatedEventListPageProps) {
  const selectedDate = getSelectedMonthDay(searchParams);
  const selectedSportSlug = parseSingleValue(searchParams?.sport)?.trim().toLowerCase() || null;
  const { data, error } = await loadData(selectedDate.day, selectedDate.month, selectedSportSlug);

  const previousDate = shiftMonthDay(selectedDate, -1);
  const nextDate = shiftMonthDay(selectedDate, 1);
  const sports = data?.sports ?? [];
  const rawEvents = data?.sportEvents ?? [];

  const filteredEvents = rawEvents
    .filter((event) => (mode === "birthday" ? isBirthdayEvent(event) : isDeathEvent(event)))
    .sort((a, b) => a.year - b.year);

  const title = mode === "birthday" ? "تولدهای ورزشی در این روز" : "درگذشتگان ورزش در این روز";
  const description =
    mode === "birthday"
      ? "تولد بازیکن‌ها، قهرمان‌ها و چهره‌های ماندگار ورزش"
      : "سالروز درگذشت چهره‌های اثرگذار ورزش جهان";
  const detailBase = mode === "birthday" ? "/birthdays" : "/deaths";

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f7f9] text-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 md:text-4xl">{title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                {description} - {getDateLabel(selectedDate)}
              </p>
            </div>
            <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-sm">
              <Link href={buildPageHref(previousDate, selectedSportSlug)} className="px-5 py-3 transition hover:bg-gray-50">
                روز قبل
              </Link>
              <Link
                href={buildPageHref(getTodayMonthDay(), selectedSportSlug)}
                className="border-x border-gray-200 bg-gray-50 px-5 py-3 font-semibold"
              >
                امروز
              </Link>
              <Link href={buildPageHref(nextDate, selectedSportSlug)} className="px-5 py-3 transition hover:bg-gray-50">
                روز بعد
              </Link>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            {filteredEvents.length === 0 && !error ? (
              <p className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
                موردی برای این تاریخ پیدا نشد.
              </p>
            ) : null}

            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <div className="h-52 bg-gray-100 md:h-full">
                    <img
                      src={event.mediaUrl || `https://picsum.photos/seed/${mode}-${event.id}/900/600`}
                      alt={event.headline ?? "رویداد"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-cyan">
                        {event.sport?.name ?? "ورزش"}
                      </p>
                      <span className="rounded-full bg-brand-navy/10 px-2 py-1 text-xs font-bold text-brand-navy">
                        {toFaNumber(event.year)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {event.headline ?? "بدون عنوان"}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-7 text-gray-600">
                      {event.fullDescription ?? event.headline ?? ""}
                    </p>
                    <Link
                      href={`${detailBase}/${event.id}`}
                      className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      مشاهده جزئیات
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="sticky top-28 h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-gray-900">فیلتر ورزش</h3>
            <div className="space-y-2 text-sm">
              <Link
                href={buildPageHref(selectedDate, null)}
                className={`block rounded-xl px-4 py-2.5 transition ${
                  !selectedSportSlug ? "bg-brand-cyan text-white font-semibold" : "hover:bg-gray-100"
                }`}
              >
                همه ورزش‌ها
              </Link>
              {sports.map((sport) => (
                <Link
                  key={sport.id}
                  href={buildPageHref(selectedDate, sport.slug)}
                  className={`block rounded-xl px-4 py-2.5 transition ${
                    selectedSportSlug === sport.slug
                      ? "bg-brand-cyan text-white font-semibold"
                      : "hover:bg-gray-100"
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
