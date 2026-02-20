import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDefaultMessage } from "@/lib/utils";

/*
 * ----------------------------------------
 * GET ALL USERS
 * ----------------------------------------
 */
export async function GET(req: Request) {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is required." },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/users`, {
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
 * CREATE USER
 * ----------------------------------------
 */
// export async function POST(req: Request) {
//   const cookieStore = await cookies();

//   const token = cookieStore.get("access_token")?.value;
//   if (!token) {
//     return NextResponse.json(
//       { message: "Authentication token is required." },
//       { status: 401 },
//     );
//   }

//   const body = await req.json();
//   if (!body) {
//     return NextResponse.json({ message: "Missing body" }, { status: 400 });
//   }

//   try {
//     const res = await fetch(`${process.env.FLASK_API_URL}/api/users`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: body.username,
//         email: body.email,
//         password: body.password,
//         role: body.role,
//         maxContainers: body.maxContainers,
//         database: body.database,
//       }),
//     });

//     const data = await res.json();
//     if (!res.ok)
//       return NextResponse.json(
//         data || { message: "Something went wrong. Try again later" },
//         { status: res.status },
//       );

//     return NextResponse.json({ status: res.status });
//   } catch {
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value; // Fixed typo: access_toke -> access_token
    const body = await req.json();

    const res = await fetch(`${process.env.FLASK_API_URL}/api/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // 1. Safely handle empty or non-JSON responses
    const contentType = res.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }

    // 2. Handle non-OK responses (400s, 500s)
    if (!res.ok) {
      const errorMessage =
        data?.error?.message || data?.message || getDefaultMessage(res.status);

      return NextResponse.json(
        { message: errorMessage },
        { status: res.status },
      );
    }

    // 3. Success case
    return NextResponse.json(data || { success: true }, { status: res.status });
  } catch (error) {
    // 4. Handle Network timeouts or JSON parsing errors
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Could not connect to the backend service." },
      { status: 503 },
    );
  }
}
