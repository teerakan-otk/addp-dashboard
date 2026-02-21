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
    const res = await fetch(`${process.env.FLASK_API_URL}/api/profile`, {
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

/*
 * ----------------------------------------
 * CHANGE PASSWORD
 * ----------------------------------------
 */

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const body = await req.json();

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: body.oldPassword,
        new_password: body.cNewPassword,
      }),
    });

    let data: any;

    if (!res.ok) {
      try {
        data = await res.json();
      } catch {}

      return NextResponse.json(data || { message: "Internal server error" }, {
        status: res.status,
      });
    }

    cookieStore.delete("access_token");

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Service unvailable" },
      { status: 503 },
    );
  }
}
