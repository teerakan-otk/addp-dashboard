import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * UPDATE NEW PASSWORD
 * ----------------------------------------
 */
export async function POST(req: Request) {
  const cookieStore = await cookies();

  const token = cookieStore.get("verify_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is required." },
      { status: 401 },
    );
  }

  const body = await req.json();

  try {
    const res = await fetch(
      `${process.env.FLASK_API_URL}/api/v1/password/new`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: body.password,
        }),
      },
    );

    const data = await res.json();
    if (!res.ok)
      return NextResponse.json(data || { message: "Internal server error" }, {
        status: res.status,
      });

    // revoke verify token
    cookieStore.delete("verify_token");

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Service unvailable" },
      { status: 503 },
    );
  }
}
