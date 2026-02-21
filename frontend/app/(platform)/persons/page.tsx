import Link from "next/link";
import { executeGraphql } from "@/lib/graphql-client";
import { PersonsPageDocument, PersonalStatus, type PersonsPageQuery } from "@/gql/graphql";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

type PersonGroup = "all" | "players" | "others";

function parseSingleValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function parseStatus(
  rawStatus: string | null,
): { gqlStatus: PersonalStatus | null; queryValue: "all" | "active" | "retired" | "deceased" } {
  switch ((rawStatus ?? "").toLowerCase()) {
    case "active":
      return { gqlStatus: PersonalStatus.Active, queryValue: "active" };
    case "retired":
      return { gqlStatus: PersonalStatus.Retired, queryValue: "retired" };
    case "deceased":
      return { gqlStatus: PersonalStatus.Deceased, queryValue: "deceased" };
    default:
      return { gqlStatus: null, queryValue: "all" };
  }
}

function parseGroup(rawGroup: string | null): PersonGroup {
  switch ((rawGroup ?? "").toLowerCase()) {
    case "players":
      return "players";
    case "others":
      return "others";
    default:
      return "all";
  }
}

function statusLabel(status: PersonalStatus): string {
  switch (status) {
    case PersonalStatus.Active:
      return "فعال";
    case PersonalStatus.Retired:
      return "بازنشسته";
    case PersonalStatus.Deceased:
      return "درگذشته";
    default:
      return "نامشخص";
  }
}

function statusClass(status: PersonalStatus): string {
  switch (status) {
    case PersonalStatus.Active:
      return "bg-emerald-100 text-emerald-700";
    case PersonalStatus.Retired:
      return "bg-amber-100 text-amber-700";
    case PersonalStatus.Deceased:
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function fullName(person: PersonsPageQuery["persons"][number]): string {
  return `${person.firstname} ${person.lastname ?? ""}`.trim();
}

function isPlayer(person: PersonsPageQuery["persons"][number]): boolean {
  const title = person.title ?? "";

  return (
    title.includes("بازیکن")
    || title.includes("قهرمان")
    || title.includes("ستاره")
    || (person.sports.length > 0 && !title.includes("مربی") && !title.includes("داور") && !title.includes("تحلیل"))
  );
}

function withGroupFilter(
  persons: PersonsPageQuery["persons"],
  group: PersonGroup,
): PersonsPageQuery["persons"] {
  if (group === "players") {
    return persons.filter(isPlayer);
  }

  if (group === "others") {
    return persons.filter((person) => !isPlayer(person));
  }

  return persons;
}

export default async function PersonsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const rawStatus = parseSingleValue(resolvedSearchParams?.status);
  const rawGroup = parseSingleValue(resolvedSearchParams?.group);
  const { gqlStatus, queryValue } = parseStatus(rawStatus);
  const groupValue = parseGroup(rawGroup);

  const data = await executeGraphql(PersonsPageDocument, { status: gqlStatus });
  const persons = withGroupFilter(data.persons, groupValue);
  const playersCount = data.persons.filter(isPlayer).length;
  const othersCount = data.persons.length - playersCount;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f7f9] text-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-black text-gray-900 md:text-4xl">افراد و چهره‌های ورزشی</h1>
          <p className="mt-2 text-sm text-gray-500">
            بازیکن‌ها، مربی‌ها و چهره‌های ورزشی ثبت‌شده در پایگاه داده
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 text-sm">
          <Link
            href={`/persons${groupValue === "all" ? "" : `?group=${groupValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              queryValue === "all" ? "bg-brand-navy text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            همه
          </Link>
          <Link
            href={`/persons?status=active${groupValue === "all" ? "" : `&group=${groupValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              queryValue === "active" ? "bg-emerald-600 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            فعال
          </Link>
          <Link
            href={`/persons?status=retired${groupValue === "all" ? "" : `&group=${groupValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              queryValue === "retired" ? "bg-amber-500 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            بازنشسته
          </Link>
          <Link
            href={`/persons?status=deceased${groupValue === "all" ? "" : `&group=${groupValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              queryValue === "deceased" ? "bg-rose-600 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            درگذشته
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 text-sm">
          <Link
            href={`/persons${queryValue === "all" ? "" : `?status=${queryValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              groupValue === "all" ? "bg-brand-cyan text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            همه دسته‌ها
          </Link>
          <Link
            href={`/persons?group=players${queryValue === "all" ? "" : `&status=${queryValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              groupValue === "players" ? "bg-brand-cyan text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            بازیکن‌ها ({playersCount})
          </Link>
          <Link
            href={`/persons?group=others${queryValue === "all" ? "" : `&status=${queryValue}`}`}
            className={`rounded-full px-4 py-2 font-semibold ${
              groupValue === "others" ? "bg-brand-cyan text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            سایر ({othersCount})
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {persons.map((person) => (
            <article
              key={person.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="h-52 bg-gray-100">
                <img
                  src={person.profileImageUrl || `https://picsum.photos/seed/person-${person.id}/900/600`}
                  alt={fullName(person)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-black text-gray-900">{fullName(person)}</h2>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass(person.status)}`}>
                    {statusLabel(person.status)}
                  </span>
                </div>

                <p className="text-sm font-semibold text-brand-cyan">{person.title || "ورزشکار"}</p>
                <p className="text-xs text-gray-500">{person.nationality || "ملیت ثبت نشده"}</p>

                <div className="flex flex-wrap gap-1 text-xs">
                  {person.sports.map((sport) => (
                    <span
                      key={`${person.id}-sport-${sport.id}`}
                      className="rounded-full bg-brand-navy/10 px-2 py-1 font-semibold text-brand-navy"
                    >
                      {sport.name}
                    </span>
                  ))}
                </div>

                <p className="line-clamp-3 text-sm leading-7 text-gray-600">
                  {person.biography || "برای این فرد توضیحی ثبت نشده است."}
                </p>

                <div className="text-xs text-gray-500">
                  <span>تولد: {new Date(person.birthDate).toLocaleDateString("fa-IR")}</span>
                  {person.deathDate ? (
                    <span> | درگذشت: {new Date(person.deathDate).toLocaleDateString("fa-IR")}</span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
