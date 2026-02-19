import type { Metadata } from "next";

import { Profile } from "./_components/profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <Profile />;
}
