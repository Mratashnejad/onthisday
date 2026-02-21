import Link from "next/link";
import { executeGraphql } from "@/lib/graphql-client";
import { SportEventsPageDocument, type SportEventsPageQuery } from "@/gql/graphql";

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

function toFaNumber(value: number): string {
  return faNumberFormatter.format(value);
}

async function loadData(day: number, month: number): Promise<{ data: SportEventsPageQuery | null; error: string | null }> {
  try {
    const data = await executeGraphql(SportEventsPageDocument, { day, month, sportSlug: null });
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "خطا در دریافت داده‌ها",
    };
  }
}

export default async function SportsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedDate = getSelectedMonthDay(resolvedSearchParams);
  const { data, error } = await loadData(selectedDate.day, selectedDate.month);

  const sports = data?.sports ?? [];
  const events = data?.sportEvents ?? [];

  const eventsBySport = new Map<number, typeof events>();
  for (const event of events) {
    const sportId = event.sport?.id;
    if (!sportId) {
      continue;
    }

    const group = eventsBySport.get(sportId) ?? [];
    group.push(event);
    eventsBySport.set(sportId, group);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f7f9] text-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-black text-gray-900 md:text-4xl">
            ورزش‌ها در تاریخ {getDateLabel(selectedDate)}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            وضعیت رویدادهای هر رشته و مرور سریع اتفاقات این روز
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sports.map((sport) => {
            const sportEvents = eventsBySport.get(sport.id) ?? [];
            const featured = sportEvents[sportEvents.length - 1];
            const image = featured?.mediaUrl || sport.iconUrl || `https://picsum.photos/seed/sport-${sport.id}/900/500`;

            return (
              <article
                key={sport.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="h-36 w-full bg-gray-100">
                  <img src={image} alt={sport.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="space-y-3 p-4">
                  <h2 className="text-lg font-black text-gray-900">{sport.name}</h2>
                  <p className="line-clamp-2 text-xs leading-6 text-gray-600">
                    {sport.description || "بدون توضیح"}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-brand-navy/10 px-2 py-1 font-bold text-brand-navy">
                      {toFaNumber(sportEvents.length)} رویداد امروز
                    </span>
                    <Link
                      href={`/?day=${selectedDate.day}&month=${selectedDate.month}&sport=${sport.slug}`}
                      className="font-semibold text-brand-cyan hover:underline"
                    >
                      نمایش رویدادها
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-gray-900">آخرین رویدادهای ورزشی این روز</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {events.slice(0, 12).map((event) => (
              <Link
                key={event.id}
                href={`/sports/${event.id}`}
                className="group flex gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 transition hover:border-brand-cyan/40 hover:bg-white"
              >
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={event.mediaUrl || `https://picsum.photos/seed/event-${event.id}/600/360`}
                    alt={event.headline ?? "رویداد"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-cyan">
                    {event.sport?.name ?? "ورزش"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
                    {event.headline ?? "رویداد بدون عنوان"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
