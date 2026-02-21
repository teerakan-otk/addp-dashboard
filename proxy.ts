import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* --------------------------------------------------
 * Route Configuration
 * -------------------------------------------------- */

const AUTH_ROUTES = ["/login", "/register", "/password"];

const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  user: "/user/dashboard",
} as const;

type Role = keyof typeof ROLE_DASHBOARD;

/* --------------------------------------------------
 * JWT Configuration (Edge Compatible)
 * -------------------------------------------------- */

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

const redirect = (path: string, req: NextRequest) =>
  NextResponse.redirect(new URL(path, req.url));

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

/* --------------------------------------------------
 * Middleware
 * -------------------------------------------------- */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;

  /* ---------------------------------------------
   * 1️⃣ No token → only allow auth routes
   * --------------------------------------------- */

  if (!token) {
    if (!isAuthRoute(pathname)) {
      return redirect("/login", req);
    }

    return NextResponse.next();
  }

  /* ---------------------------------------------
   * 2️⃣ Verify JWT (also checks expiration)
   * --------------------------------------------- */

  let role: Role;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (typeof payload.role !== "string") {
      throw new Error("Missing role");
    }

    const normalizedRole = payload.role.toLowerCase();

    if (!(normalizedRole in ROLE_DASHBOARD)) {
      throw new Error("Invalid role");
    }

    role = normalizedRole as Role;
  } catch {
    const res = redirect("/login", req);
    res.cookies.delete("access_token");
    return res;
  }

  /* ---------------------------------------------
   * 3️⃣ Prevent auth users from visiting:
   *    - auth pages
   *    - forbidden page
   * --------------------------------------------- */

  if (isAuthRoute(pathname) || pathname === "/forbidden") {
    return redirect(ROLE_DASHBOARD[role], req);
  }

  /* ---------------------------------------------
   * 4️⃣ Role-Based Access Control
   * --------------------------------------------- */

  if (pathname.startsWith("/admin") && role !== "admin") {
    return redirect("/forbidden", req);
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return redirect("/forbidden", req);
  }

  /* ---------------------------------------------
   * 5️⃣ Allow request
   * --------------------------------------------- */

  return NextResponse.next();
}

/* --------------------------------------------------
 * Matcher
 * -------------------------------------------------- */

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
