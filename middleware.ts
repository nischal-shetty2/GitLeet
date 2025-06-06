import { NextResponse, NextRequest } from "next/server";

// Simplified middleware to avoid hydration issues
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Basic security headers only
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
    "/api/:path*", // Include API routes in middleware processing
  ],
};
