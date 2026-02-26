import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* -------------------------------------------------- */
/* Route Configuration */
/* -------------------------------------------------- */

const PUBLIC_AUTH_ROUTES = ["/login", "/register"];
const PASSWORD_ROUTES = [
  "/password/request",
  "/password/verify",
  "/password/new",
];

const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  user: "/user/dashboard",
} as const;

type Role = keyof typeof ROLE_DASHBOARD;

/* -------------------------------------------------- */
/* JWT Config */
/* -------------------------------------------------- */

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/* -------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------- */

const redirect = (path: string, req: NextRequest) =>
  NextResponse.redirect(new URL(path, req.url));

const isPublicAuthRoute = (pathname: string) =>
  PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const isPasswordRoute = (pathname: string) =>
  PASSWORD_ROUTES.some((route) => pathname.startsWith(route));

/* -------------------------------------------------- */
/* Proxy */
/* -------------------------------------------------- */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const requestToken = req.cookies.get("request_token")?.value;
  const verifyToken = req.cookies.get("verify_token")?.value;

  /* --------------------------------------------------
   * PASSWORD FLOW PROTECTION (Always evaluate first)
   * -------------------------------------------------- */

  if (pathname.startsWith("/password")) {
    // Logged-in users cannot access password reset
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as Role;
        return redirect(ROLE_DASHBOARD[role], req);
      } catch {
        // ignore invalid token here
      }
    }

    // /password/verify requires request_token
    if (pathname.startsWith("/password/verify")) {
      if (!requestToken) {
        return redirect("/password/request", req);
      }
    }

    // /password/new requires verify_token
    if (pathname.startsWith("/password/new")) {
      if (!verifyToken) {
        return redirect("/password/request", req);
      }
    }

    return NextResponse.next();
  }

  /* --------------------------------------------------
   * No access_token → allow only public auth routes
   * -------------------------------------------------- */

  if (!token) {
    if (!isPublicAuthRoute(pathname)) {
      return redirect("/login", req);
    }
    return NextResponse.next();
  }

  /* --------------------------------------------------
   * Verify JWT
   * -------------------------------------------------- */

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

  /* --------------------------------------------------
   * Prevent logged-in users from visiting auth pages
   * -------------------------------------------------- */

  if (isPublicAuthRoute(pathname) || pathname === "/forbidden") {
    return redirect(ROLE_DASHBOARD[role], req);
  }

  /* --------------------------------------------------
   * Role Protection
   * -------------------------------------------------- */

  if (pathname.startsWith("/admin") && role !== "admin") {
    return redirect("/forbidden", req);
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return redirect("/forbidden", req);
  }

  return NextResponse.next();
}

/* -------------------------------------------------- */
/* Matcher */
/* -------------------------------------------------- */

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
