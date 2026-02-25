import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * LOGOUT
 * ----------------------------------------
 */
export async function POST() {
  const cookieStore = await cookies();

  try {
    cookieStore.delete("sidebar_state");
    cookieStore.delete("access_token");

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
