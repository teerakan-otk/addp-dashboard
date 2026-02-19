import { notFound } from "next/navigation";
import { fetchUser } from "./_actions/users";
import { ViewDetails } from "./_components/view-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    notFound();
  }

  const user = await fetchUser(id);
  if (!user) {
    notFound();
  }

  return <ViewDetails data={user} />;
}
