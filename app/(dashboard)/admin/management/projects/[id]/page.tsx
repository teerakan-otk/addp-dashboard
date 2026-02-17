import type { Metadata } from "next";
import { ViewProject } from "./_components/view-project";

export const metadata: Metadata = {
  title: "View Project",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ViewProject id={id} />;
}
