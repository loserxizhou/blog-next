import { redirect } from "next/navigation";

export default async function DocDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/docs/${id}?mode=view`);
}
