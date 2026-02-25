import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * GET PROFILE STATUS
 * ----------------------------------------
 */

export async function GET(req: Request) {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is required." },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok)
      return NextResponse.json(data || { message: "Internal server error" }, {
        status: res.status,
      });

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Service unvailable" },
      { status: 503 },
    );
  }
}
