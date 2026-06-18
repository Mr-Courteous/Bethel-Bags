import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") && 
                         !req.nextUrl.pathname.startsWith("/admin/login");

    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow admin/login without token
        if (req.nextUrl.pathname === "/admin/login") return true;
        // Admin routes need valid session (role check happens above)
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        // Account routes need session
        if (req.nextUrl.pathname.startsWith("/account")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
