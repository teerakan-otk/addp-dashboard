import { EditUserForm } from "@/features/users/components/edit-user-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditUserForm id={id} />;
}
