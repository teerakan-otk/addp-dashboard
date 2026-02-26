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

  // Get user ID from params
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 },
    );
  }

  try {
    // Call Flask API users endpoint
    const res = await fetch(`${process.env.FLASK_API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

export async function PUT(
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

  // Get user ID from params
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 },
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
    // Call Flask API users endpoint
    const res = await fetch(`${process.env.FLASK_API_URL}/users/${id}`, {
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

    // Handle 204 response
    if (res.status === 204) {
      return NextResponse.json(
        { message: "User updated successfully" },
        { status: 200 }
      );
    }

    // Parse response body
    let data: any;

    // Handle non-JSON response
    try {
      data = await res.json();
    } catch {
      // Ignore JSON parse errors (could be empty body)
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

export async function DELETE(
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

  // Get user ID from params
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 },
    );
  }

  try {
    // Call Flask API users endpoint
    const res = await fetch(`${process.env.FLASK_API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle 204 response
    if (res.status === 204) {
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    }

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
    return NextResponse.json({ status: res.status });
  } catch {
    // Handle network errors
    return NextResponse.json(
      { message: "Service Unavailable" },
      { status: 503 },
    );
  }
}