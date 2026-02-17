import type { Metadata } from "next";
import { EditProjectForm } from "./_components/edit-project-form";

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProjectForm id={id} />;
}
