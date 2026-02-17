import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * VERIFY OTP
 * ----------------------------------------
 */
export async function POST(req: Request) {
  const cookieStore = await cookies();

  const token = cookieStore.get("request_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is required." },
      { status: 401 },
    );
  }

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ message: "Missing body" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${process.env.FLASK_API_URL}/api/v1/auth//password/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: body.otp,
        }),
      },
    );

    const data = await res.json();

    // If failed, just return
    if (!res.ok)
      return NextResponse.json(
        data || "Something went wrong. Try again later",
        { status: res.status },
      );

    // set new token
    cookieStore.set("verify_token", data.token?.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.token?.expires,
    });

    // revoke request token
    cookieStore.delete("request_token");

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
