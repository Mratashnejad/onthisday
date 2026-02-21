import Link from "next/link";
import { notFound } from "next/navigation";
import { SportEventType, SportEventDetailDocument } from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";

type SportEventDetailPageProps = {
  idParam: string;
  title: string;
  backHref: string;
  backLabel: string;
};

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

function personLabel(firstname: string, lastname: string | null | undefined): string {
  return `${firstname} ${lastname ?? ""}`.trim();
}

export async function SportEventDetailPage({
  idParam,
  title,
  backHref,
  backLabel,
}: SportEventDetailPageProps) {
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id) || id <= 0) {
    notFound();
  }

  const data = await executeGraphql(SportEventDetailDocument, { id });
  const event = data.sportEvent;

  if (!event) {
    notFound();
  }

  const headline = event.headline ?? "رویداد بدون عنوان";
  const description = event.fullDescription ?? headline;
  const participantLines = event.participants.map((participant) => {
    const baseName = participant.person
      ? personLabel(participant.person.firstname, participant.person.lastname)
      : participant.team?.name ?? "مشارکت‌کننده نامشخص";
    const note = participant.performanceNote ? ` - ${participant.performanceNote}` : "";
    return `${baseName} (${participant.role})${note}`;
  });

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f7f9] text-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#0088cc]">{title}</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{headline}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {event.year}/{event.month}/{event.day} • {getEventTypeLabel(event.type)}
            </p>
          </div>
          <Link
            href={backHref}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            {backLabel}
          </Link>
        </div>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <section>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <img
                src={event.mediaUrl || `https://picsum.photos/seed/detail-${event.id}/1200/700`}
                alt={headline}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">توضیحات</h2>
            <p className="mt-3 text-sm leading-8 text-gray-700">{description}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">ورزش</h3>
              <p className="mt-2 text-sm text-gray-700">{event.sport?.name ?? "نامشخص"}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">رقابت</h3>
              <p className="mt-2 text-sm text-gray-700">{event.competition?.name ?? "ثبت نشده"}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">مکان</h3>
              <p className="mt-2 text-sm text-gray-700">
                {[event.location?.name, event.location?.city, event.location?.country]
                  .filter(Boolean)
                  .join(" - ") || "ثبت نشده"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">شناسه رویداد</h3>
              <p className="mt-2 text-sm text-gray-700">#{event.id}</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900">مشارکت‌کنندگان</h3>
            {participantLines.length ? (
              <ul className="mt-3 space-y-2">
                {participantLines.map((line, index) => (
                  <li
                    key={`${event.id}-participant-${index}`}
                    className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">شرکت‌کننده‌ای ثبت نشده است.</p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900">منبع / رسانه</h3>
            <a
              href={event.mediaUrl || `https://picsum.photos/seed/detail-${event.id}/1200/700`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex text-sm text-blue-600 hover:underline"
            >
              مشاهده تصویر
            </a>
          </section>
        </article>
      </div>
    </main>
  );
}
