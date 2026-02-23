import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * GET Container by id
 * ----------------------------------------
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Missing required parameter." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.FLASK_API_URL}/api/v1/containers/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();
    if (!res.ok)
      return NextResponse.json(
        data || "Something went wrong. Try again later",
        { status: res.status },
      );

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/*
 * ----------------------------------------
 * UPDATE PROJECT BY ID
 * ----------------------------------------
 */

/*
 * ----------------------------------------
 * DELETE PROJECT BY ID
 * ----------------------------------------
 */
