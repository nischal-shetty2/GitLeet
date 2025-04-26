"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeetCodeResponse | ErrorResponse>
) {
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
      }
    );

    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
    console.error(error);
  }
}
