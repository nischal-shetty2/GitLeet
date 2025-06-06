import { NextResponse, NextRequest } from "next/server";

const CACHE_TIME = {
  STATIC: 31536000, // 1 year in seconds
  IMAGES: 2592000, // 30 days in seconds
  FONTS: 31536000, // 1 year in seconds
  JSON: 3600, // 1 hour in seconds
  HTML: 3600, // 1 hour in seconds
};

// Add content-specific caching headers based on path and content
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.pathname;

  // Add security headers for better SEO and rankings
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Define cache-control headers based on content type
  if (url.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
    // Images
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIME.IMAGES}, stale-while-revalidate=86400`
    );
  } else if (url.match(/\.(js|css)$/)) {
    // Static assets
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIME.STATIC}, stale-while-revalidate=86400`
    );
  } else if (url.match(/\.(woff|woff2|ttf|otf)$/)) {
    // Fonts
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIME.FONTS}, stale-while-revalidate=86400`
    );
  } else if (url.match(/\.json$/)) {
    // JSON data
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIME.JSON}, stale-while-revalidate=60`
    );
  } else if (url.startsWith("/api/github") || url.startsWith("/api/leetcode")) {
    // API responses with dynamic caching
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=600, stale-while-revalidate=1800"
    );

    // Add SEO-friendly headers for API responses
    response.headers.set("X-Robots-Tag", "noindex");
  } else if (!url.match(/\.[a-zA-Z0-9]+$/)) {
    // HTML pages (URLs without file extensions)
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIME.HTML}, stale-while-revalidate=300`
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
    "/api/:path*", // Include API routes in middleware processing
  ],
};
