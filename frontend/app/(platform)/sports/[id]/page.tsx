import { SportEventDetailPage } from "@/components/platform/SportEventDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SportsEventDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <SportEventDetailPage
      idParam={id}
      title="جزئیات رویداد ورزشی"
      backHref="/"
      backLabel="بازگشت به رویدادها"
    />
  );
}
