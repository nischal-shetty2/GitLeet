import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Initialize the CORS middleware
const cors = Cors({
  // Specify allowed origins or use true to allow any origin (not recommended for production)
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",") || ["https://yourdomain.com"]
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
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Set security headers middleware
export async function setSecurityHeaders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set strict Content-Security-Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; object-src 'none';"
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

// Validate API key if used
export function validateApiKey(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  // If API key validation is needed in the future
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  // Skip validation if not in production or API key is not set
  if (!validApiKey || process.env.NODE_ENV !== "production") {
    return true;
  }

  if (apiKey !== validApiKey) {
    res.status(401).json({ error: "Unauthorized: Invalid API key" });
    return false;
  }

  return true;
}

// Apply all security middleware
export const withSecurity =
  (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Run the CORS middleware
      await runMiddleware(req, res, cors);

      // Set security headers
      await setSecurityHeaders(req, res);

      // Validate API key if needed
      if (!validateApiKey(req, res)) {
        return;
      }

      // Call the handler
      return handler(req, res);
    } catch (err) {
      console.error("Security middleware error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
