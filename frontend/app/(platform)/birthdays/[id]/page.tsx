import { SportEventDetailPage } from "@/components/platform/SportEventDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BirthdayDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <SportEventDetailPage
      idParam={id}
      title="جزئیات تولد ورزشی"
      backHref="/birthdays"
      backLabel="بازگشت به تولدها"
    />
  );
}
