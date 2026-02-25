import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ message: "Missing body" }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/database`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: body.action }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data || { message: "Internal server error" }, {
        status: res.status,
      });
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Unexpected server error" },
      { status: 500 },
    );
  }
}
