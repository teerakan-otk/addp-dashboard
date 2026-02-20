import { notFound } from "next/navigation";
import { getUser } from "./_actions/users";
import { ViewUserDetails } from "./_components/view-user-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    notFound();
  }

  const user = await getUser(id);
  if (!user) {
    notFound();
  }

  return <ViewUserDetails data={user} />;
}
