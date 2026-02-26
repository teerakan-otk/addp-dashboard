import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  try {
    // Delete cookies
    cookieStore.delete("sidebar_state");
    cookieStore.delete("access_token");

    // Return success response
    return NextResponse.json({ status: 200 });
  } catch {
    // Handle network errors
    return NextResponse.json(
      { message: "Service Unavailable" },
      { status: 503 },
    );
  }
}