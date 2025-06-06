import { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "express-rate-limit";

interface RateLimitOptions {
  windowMs?: number; // Milliseconds - how long to keep records of requests
  max?: number; // Maximum number of requests per windowMs
  message?: string; // Error message sent to user when max is exceeded
  keyGenerator?: (req: NextApiRequest) => string; // Function to generate keys
}

// Create a rate limiter instance with default options
export const createRateLimiter = ({
  windowMs = 60 * 1000, // Default: 1 minute
  max = 10, // Default: 10 requests per window
  message = "Too many requests, please try again later.",
  keyGenerator = (req: NextApiRequest) => {
    // By default, use the IP address as the key to track request counts
    return (
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "unknown-ip"
    );
  },
}: RateLimitOptions = {}) => {
  const limiter = rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (request) => keyGenerator(request as NextApiRequest),
    skip: () => {
      return process.env.NODE_ENV === "development";
    },
    // Handle high load gracefully
    handler: (req, res, next, options) => {
      res.status(429).json({
        error:
          typeof options.message === "object"
            ? options.message.error
            : "Too many requests, please try again later",
        retryAfter: Math.ceil(windowMs / 1000),
        success: false,
      });
    },
  });

  // Return a middleware function for Next.js API routes
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      return limiter(req, res, next);
    } catch (err) {
      // Safety net for any errors in the rate limiting middleware
      console.error("Rate limiter error:", err);
      res.status(429).json({
        error: "Server is currently under heavy load. Please try again later.",
        success: false,
      });
    }
  };
};

// Helper to wrap the API handler with the rate limiter
export const withRateLimit = <T>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<T>
  ) => Promise<void> | void,
  options?: RateLimitOptions
) => {
  const limiter = createRateLimiter(options);

  return async (req: NextApiRequest, res: NextApiResponse<T>) => {
    return new Promise<void>((resolve) => {
      limiter(req, res, () => {
        return resolve(handler(req, res));
      });
    });
  };
};
