import type { NextApiRequest, NextApiResponse } from "next";
import { withRateLimit } from "../../lib/middleware/rateLimit";
import { withSecurity } from "../../lib/middleware/security";
import axios from "axios";
import { responseCache } from "@/lib/cache";

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: string;
            }[];
          }[];
        };
      };
    };
  };
}

interface ErrorResponse {
  error: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubResponse | ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  // Set basic response headers
  res.setHeader("Content-Type", "application/json");

  // Add CORS headers for Safari
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // Generate cache key
  const cacheKey = `github:${username}`;

  // Check if we have a fresh cached response
  const cachedData = responseCache.get<GitHubResponse>(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const query = `
      query ($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    // Ensure GitHub token exists - use fallback for development
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.error("GitHub token is not configured");

      // Try to use cached data if available
      const cacheKey = `github:${username}`;
      const cachedData = responseCache.get<GitHubResponse>(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      return res.status(500).json({ error: "Server configuration error" });
    }

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await axios.post(
      "https://api.github.com/graphql",
      { query, variables: { login: username } },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        timeout: 8000, // Extended timeout for high load
        maxBodyLength: 1024 * 500, // Limit response size
        validateStatus: (status) => status < 500, // Only reject on server errors
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    // Validate response data format
    if (!response.data?.data?.user?.contributionsCollection) {
      // Try to use cached data if response is invalid
      const cachedData = responseCache.get<GitHubResponse>(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      return res
        .status(404)
        .json({ error: "No valid data found for this user" });
    }

    // Cache the response for future requests - storing for 1 hour
    responseCache.set(cacheKey, response.data, 60 * 60 * 1000);

    res.status(200).json(response.data);
  } catch (error: unknown) {
    console.error(
      "GitHub API error:",
      error instanceof Error ? error.message : error
    );

    // Try to use cache if available on error
    const cachedData = responseCache.get<GitHubResponse>(cacheKey);
    if (cachedData) {
      console.log("Using cached GitHub data due to API error");
      return res.status(200).json(cachedData);
    }

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response?.status || 500;
      const message =
        status === 404
          ? "GitHub user not found"
          : status === 403
          ? "GitHub API rate limit exceeded"
          : status === 429
          ? "Too many requests, please try again later"
          : "Failed to fetch GitHub data";

      return res.status(status).json({ error: message });
    } else if (error instanceof Error && "request" in error) {
      // The request was made but no response was received
      console.error("Network error or timeout:", error.message);
      return res
        .status(504)
        .json({ error: "GitHub API timeout or network error" });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Unexpected GitHub API error:", error);
      res.status(500).json({
        error: "Failed to fetch GitHub data. Please try again later.",
      });
    }
  }
}

// Apply rate limit of 30 requests per minute per IP
const rateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: "Too many GitHub contribution requests, please try again later.",
};

// Export the handler with security middleware and rate limiting
export default withSecurity(withRateLimit(handler, rateLimitOptions));
