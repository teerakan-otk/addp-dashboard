import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(req: Request) {
  const cookieStore = await cookies();

  // Get request token from cookie
  const token = cookieStore.get("request_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Missing Authorization Header" },
      { status: 401 },
    );
  }

  // Parse request body
  const body = await req.json();
  if (!body) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Call Flask API password/verify endpoint
    const res = await fetch(
      `${process.env.FLASK_API_URL}/password/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: body.otp,
      }),
    });
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

    // Set verify token
    cookieStore.set("verify_token", data.token?.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.token?.expires,
    });

    // Delete request token
    cookieStore.delete("request_token");

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
