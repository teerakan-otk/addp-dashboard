import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  // Get access token from cookie
  const token = cookieStore.get("access_token")?.value;
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
    // Call Flask API database endpoint
    const res = await fetch(`${process.env.FLASK_API_URL}/database`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: body.action }),
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