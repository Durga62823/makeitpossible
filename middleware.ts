import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const role = (user as any)?.role || "EMPLOYEE";

  // If user is trying to access root or auth pages, let them through
  if (pathname === "/" || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Role-based dashboard redirect
  if (pathname === "/dashboard") {
    // User accessing generic dashboard - redirect to their role-specific dashboard
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (role === "MANAGER" || role === "LEAD") {
      return NextResponse.redirect(new URL("/manager", req.url));
    }
    // EMPLOYEE stays on /dashboard
    return NextResponse.next();
  }

  // Prevent non-admins from accessing admin pages
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Prevent non-managers/leads from accessing manager pages
  if (
    pathname.startsWith("/manager") &&
    role !== "MANAGER" &&
    role !== "LEAD"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/manager/:path*",
    "/projects/:path*",
    "/settings/:path*",
  ],
};
