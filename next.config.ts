import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Optimize for reliability under load
  poweredByHeader: false, // Remove the X-Powered-By header
  compress: true, // Enable compression for better performance

  // Avoid hydration issues during high load
  reactStrictMode: true,

  // Performance optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

export default nextConfig;
