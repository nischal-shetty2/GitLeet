import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Initialize the CORS middleware
const cors = Cors({
  // Specify allowed origins or use true to allow any origin (not recommended for production)
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://git-leet.vercel.app", "https://gitleet.tech"]
      : true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours in seconds
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: (result: Error | unknown) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: Error | unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Set security headers middleware
export async function setSecurityHeaders(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  // Set Content-Security-Policy with Safari compatibility
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.vercel-insights.com; object-src 'none';"
  );

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection in browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Prevent embedding in iframes (clickjacking protection)
  res.setHeader("X-Frame-Options", "DENY");

  // Control browser caching
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 minutes
  } else {
    res.setHeader("Cache-Control", "no-store, max-age=0");
  }
}

// Apply all security middleware
export const withSecurity =
  <T>(
    handler: (
      req: NextApiRequest,
      res: NextApiResponse<T>
    ) => Promise<void> | void
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<T | { error: string }>) => {
    try {
      // Run the CORS middleware
      await runMiddleware(req, res, cors);

      // Set security headers
      await setSecurityHeaders(req, res);

      // Call the handler
      return handler(req, res);
    } catch (err) {
      console.error("Security middleware error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
