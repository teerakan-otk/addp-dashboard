import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * GET
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
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
 * UPDATE
 * ----------------------------------------
 */
export async function PUT(
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

  const body = await req.json();

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_containers: body.maxContainers,
        database: body.databaseEnabled,
      }),
    });

    if (!res.ok)
      return NextResponse.json(
        { message: "Something went wrong. Try again later" },
        { status: res.status },
      );

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/*
 * ----------------------------------------
 * DELETE
 * ----------------------------------------
 */
export async function DELETE(
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
    const res = await fetch(`${process.env.FLASK_API_URL}/api/v1/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok)
      return NextResponse.json(
        { message: "Something went wrong. Try again later" },
        { status: res.status },
      );

    return NextResponse.json({ status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
