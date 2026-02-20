import { cookies } from "next/headers";

export async function getUser(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.FLASK_API_URL}/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return undefined;
  return res.json();
}
