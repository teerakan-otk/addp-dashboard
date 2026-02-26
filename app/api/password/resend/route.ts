import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST() {
  const cookieStore = await cookies();

  // Get request token from cookie
  const token = cookieStore.get("request_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Missing Authorization Header" },
      { status: 401 },
    );
  }

  try {
    // Call Flask API password/resend endpoint
    const res = await fetch(
      `${process.env.FLASK_API_URL}/password/resend`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Parse response body
    let data: any;

    // Handle non-JSON response
    try {
      data = await res.json();
    } catch {
      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
    }

    // Handle non-OK response
    if (!res.ok) {
      return NextResponse.json(data || { message: "Internal Server Error" }, {
        status: res.status,
      });
    }

    // Set request token
    cookieStore.set("request_token", data.token?.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.token?.expires,
    });

    // Return success response
    return NextResponse.json({ status: res.status });
  } catch {
    // Handle network errors
    return NextResponse.json(
      { message: "Service Unavailable" },
      { status: 503 },
    );
  }
}
