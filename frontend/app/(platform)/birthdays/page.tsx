import { DatedEventListPage } from "@/components/platform/DatedEventListPage";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function BirthdaysPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <DatedEventListPage searchParams={resolvedSearchParams} mode="birthday" />;
}
