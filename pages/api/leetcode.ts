import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { withRateLimit } from "../../lib/middleware/rateLimit";
import { withSecurity } from "../../lib/middleware/security";

interface LeetCodeResponse {
  data: {
    matchedUser: {
      submissionCalendar: string;
    };
  };
}

interface ErrorResponse {
  error: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeetCodeResponse | ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query ($username: String!) {
            matchedUser(username: $username) {
              submissionCalendar
            }
          }
        `,
        variables: { username },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 8000, // Extended timeout for high load
        maxBodyLength: 1024 * 500, // Limit response size
        validateStatus: (status) => status < 500, // Only reject on server errors
      }
    );

    // Validate response data format
    if (!response.data?.data?.matchedUser?.submissionCalendar) {
      return res
        .status(404)
        .json({ error: "No data found for this LeetCode user" });
    }

    res.status(200).json(response.data);
  } catch (error: unknown) {
    console.error(
      "LeetCode API error:",
      error instanceof Error ? error.message : error
    );

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response?.status || 500;
      const message =
        status === 404
          ? "LeetCode user not found"
          : status === 429
          ? "LeetCode API rate limit exceeded - please try again later"
          : "Failed to fetch LeetCode data";

      return res.status(status).json({ error: message });
    } else if (error instanceof Error && "request" in error) {
      // The request was made but no response was received
      console.error("Network error or timeout:", error.message);
      return res
        .status(504)
        .json({ error: "LeetCode API timeout or network error" });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Unexpected LeetCode API error:", error);
      res.status(500).json({
        error: "Failed to fetch LeetCode data. Please try again later.",
      });
    }
  }
}

// Apply rate limit of 20 requests per minute per IP
const rateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: "Too many LeetCode data requests, please try again later.",
};

// Export the handler with security middleware and rate limiting
export default withSecurity(withRateLimit(handler, rateLimitOptions));
