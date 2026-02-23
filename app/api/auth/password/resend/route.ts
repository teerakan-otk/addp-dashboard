import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * RESEND OTP
 * ----------------------------------------
 */
export async function POST() {
  const cookieStore = await cookies();

  const token = cookieStore.get("request_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is required." },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.FLASK_API_URL}/api/auth//password/resend`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    // If failed, just return
    if (!res.ok)
      return NextResponse.json(
        data || "Something went wrong. Try again later",
        { status: res.status },
      );

    // remove old token and set new token
    cookieStore.set("request_token", data.token?.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/password",
      maxAge: data.token?.expires,
    });

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
