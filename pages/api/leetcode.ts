"use server";
import type { NextApiRequest, NextApiResponse } from "next";

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
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
                    query ($username: String!) {
                        matchedUser(username: $username) {
                            submissionCalendar
                        }
                    }
                `,
        variables: { username },
      }),
    });

    const data: LeetCodeResponse = await response.json();
    console.log("lc");
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
}
