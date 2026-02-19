import type { Metadata } from "next";

import { ProjectsDataTable } from "./_components/projects-data-table";

export const metadata: Metadata = {
  title: "Project Management",
};

export default function Page() {
  return <ProjectsDataTable />;
}
