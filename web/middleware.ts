import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /admin routes
    if (path.startsWith("/admin")) {
        // Skip login page
        if (path === "/admin/login") {
            return NextResponse.next();
        }

        // Check for auth cookie
        const authCookie = request.cookies.get("auth");
        if (!authCookie) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
