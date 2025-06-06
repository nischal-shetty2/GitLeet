import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Optimize for reliability under load
  poweredByHeader: false, // Remove the X-Powered-By header
  compress: true, // Enable compression for better performance  // Avoid hydration issues during high load
  reactStrictMode: false, // Disable strict mode to prevent double renders

  // Performance optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Images optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Enable Static Site Generation where possible
  output: "standalone",

  // Cache optimization
  onDemandEntries: {
    // Period (in milliseconds) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
};

export default nextConfig;
