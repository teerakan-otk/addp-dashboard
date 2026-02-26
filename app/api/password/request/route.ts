import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(req: Request) {
  const cookieStore = await cookies();

  // Parse request body
  const body = await req.json();
  if (!body) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Call Flask API password/request endpoint
    const res = await fetch(
      `${process.env.FLASK_API_URL}/password/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: body.username,
        }),
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
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Handle network errors
    return NextResponse.json(
      { message: "Service Unavailable" },
      { status: 503 },
    );
  }
}
