import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Middleware Token:", token); // Debugging: Check token data

  // If no token or accessToken is missing, redirect to login
  if (!token || !token.accessToken) {
    const loginUrl = new URL("/auth/signin", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
