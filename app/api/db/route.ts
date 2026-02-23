import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/db`, {
      method: "POST",
      headers: {
        authorization: `bearer ${token}`,
        "content-type": "application/json",
      },
    });

    if (!res.ok) {
      let data;

      try {
        data = await res.json();
      } catch {}
      return NextResponse.json(data || { message: "Internal server error" }, {
        status: res.status,
      });
    }

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Unexpected server error" },
      { status: 500 },
    );
  }
}
