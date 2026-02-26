import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();

  // Get access token from cookie
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Missing Authorization Header" },
      { status: 401 },
    );
  }

  // Get container id from params
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Missing required params." },
      { status: 400 },
    );
  }

  try {
    // Call Flask API containers endpoint
    const res = await fetch(
      `${process.env.FLASK_API_URL}/containers/${id}`,
      {
        method: "GET",
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