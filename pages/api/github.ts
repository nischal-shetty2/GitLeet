import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { withRateLimit } from "../../lib/middleware/rateLimit";
import { withSecurity } from "../../lib/middleware/security";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
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

    // Ensure GitHub token exists
    if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
      console.error("GitHub token is not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const response = await axios.post(
      "https://api.github.com/graphql",
      { query, variables: { login: username } },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 5000, // 5 second timeout
      }
    );

    // Validate response data format
    if (!response.data?.data?.user?.contributionsCollection) {
      return res
        .status(404)
        .json({ error: "No valid data found for this user" });
    }

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("GitHub API error:", error.message || error);

    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status || 500;
      const message =
        status === 404
          ? "GitHub user not found"
          : status === 403
          ? "GitHub API rate limit exceeded"
          : "Failed to fetch GitHub data";

      return res.status(status).json({ error: message });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(504).json({ error: "GitHub API timeout" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: "Failed to fetch GitHub data" });
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
