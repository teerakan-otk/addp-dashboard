import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* --------------------------------------------------
 * Route constants
 * -------------------------------------------------- */

// Public authentication-related routes
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/password"];

// Default landing pages per role
const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  user: "/user/dashboard",
} as const;

type Role = keyof typeof ROLE_DASHBOARD;

/* --------------------------------------------------
 * JWT configuration (Edge-compatible)
 * -------------------------------------------------- */

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const redirect = (path: string, req: NextRequest) =>
  NextResponse.redirect(new URL(path, req.url));

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    const exp = payload.exp * 1000; // convert to ms
    return Date.now() > exp;
  } catch {
    return true; // invalid token = treat as expired
  }
}

/* --------------------------------------------------
 * Proxy / Middleware
 * -------------------------------------------------- */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("access_token")?.value;
  const requestToken = req.cookies.get("request_token")?.value;
  const verifyToken = req.cookies.get("verify_token")?.value;

  /* --------------------------------------------------
   * Reset-password flow guard (unauth only)
   * -------------------------------------------------- */

  if (!accessToken) {
    if (pathname === "/auth/password/verify" && !requestToken) {
      return redirect("/auth/password/request", req);
    }

    if (pathname === "/auth/password/new" && !verifyToken) {
      return redirect("/auth/password/verify", req);
    }
  }

  /* --------------------------------------------------
   * Unauthenticated access
   * -------------------------------------------------- */

  if (!accessToken) {
    if (!isAuthRoute(pathname)) {
      return redirect("/auth/login", req);
    }

    return NextResponse.next();
  }

  /* --------------------------------------------------
   * JWT verification & role extraction
   * -------------------------------------------------- */

  let role: Role;

  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);

    if (typeof payload.role !== "string") {
      throw new Error("Role missing in token");
    }

    const rawRole = payload.role.toLowerCase();

    if (!(rawRole in ROLE_DASHBOARD)) {
      throw new Error("Invalid role");
    }

    role = rawRole as Role;
  } catch {
    const res = redirect("/auth/login", req);
    res.cookies.delete("access_token");
    return res;
  }

  /* --------------------------------------------------
   * Prevent authenticated users from auth pages
   * -------------------------------------------------- */

  if (isAuthRoute(pathname)) {
    return redirect(ROLE_DASHBOARD[role], req);
  }

  /* --------------------------------------------------
   * Role-based access control
   * -------------------------------------------------- */

  if (pathname.startsWith("/admin") && role !== "admin") {
    return redirect("/forbidden", req);
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return redirect("/forbidden", req);
  }

  if (isTokenExpired(accessToken)) {
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("access_token");
    return response;
  }

  return NextResponse.next();
}

/* --------------------------------------------------
 * Matcher
 * -------------------------------------------------- */

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
