import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * LOGIN
 * ----------------------------------------
 */
export async function POST(req: Request) {
  const cookieStore = await cookies();

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ message: "Missing body" }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    });

    const data = await res.json();

    if (!res.ok)
      return NextResponse.json(data || { message: "Internal server error" }, {
        status: res.status,
      });

    cookieStore.set("access_token", data.token?.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: data.token?.expires,
    });

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Service unvailable" },
      { status: 503 },
    );
  }
}
