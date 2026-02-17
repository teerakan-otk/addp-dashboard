import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/*
 * ----------------------------------------
 * GET ALL CONTAINERS
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
    const res = await fetch(`${process.env.FLASK_API_URL}/api/containers`, {
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
 * UPLOAD CONTAINER
 * ----------------------------------------
 */
export async function POST(req: Request) {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("access_token")?.value;

  // if (!token) {
  //   return NextResponse.json(
  //     { message: "Authentication token is required." },
  //     { status: 401 },
  //   );
  // }

  // // Detect content type
  // const contentType = req.headers.get("content-type") || "";
  // if (!contentType.includes("multipart/form-data")) {
  //   return NextResponse.json(
  //     { message: `Expected multipart/form-data, but got ${contentType}` },
  //     { status: 400 },
  //   );
  // }

  // try {
  //   // Read multipart form data instead of JSON
  //   const formData = await req.formData();
  //   const forwardForm = new FormData();

  //   const fields = ["containerName", "projectType", "domainName", "port"];
  //   fields.forEach((field) => {
  //     const value = formData.get(field);
  //     if (value) forwardForm.append(field, value);
  //   });

  //   // File
  //   const file = formData.get("file");
  //   if (file) forwardForm.append("file", file);

  //   const res = await fetch(`${process.env.FLASK_API_URL}/api/projects`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: formData,
  //   });

  //   const data = await res.json().catch(() => null);

  //   if (!res.ok) {
  //     return NextResponse.json(data || { message: "Upload failed" }, {
  //       status: res.status,
  //     });
  //   }

  //   return NextResponse.json(data, { status: res.status });
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json(
  //     { message: "Internal server error" },
  //     { status: 500 },
  //   );
  // }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  const formData = await req.formData();
  const forwardForm = new FormData();

  const fields = ["containerName", "projectType", "domainName", "port"];
  fields.forEach((field) => {
    const value = formData.get(field);
    if (value) forwardForm.append(field, value);
  });

  // File
  const file = formData.get("file");
  if (file) forwardForm.append("file", file);

  try {
    const res = await fetch(`${process.env.FLASK_API_URL}/api/projects`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        data || "Something went wrong. Try again later",
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
