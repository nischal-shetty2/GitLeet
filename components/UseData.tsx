import {
  transformGitHubData,
  transformLeetCodeData,
} from "@/lib/transformData";
import { ActivityData } from "@/lib/types";
import { useState } from "react";

export const useGitHubData = (username: string) => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github?username=${username}`);
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

      const jsonData = await response.json();
      setData(transformGitHubData(jsonData));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch GitHub data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, setData, loading, error, fetchData };
};

export const useLeetCodeData = (username: string) => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leetcode?username=${username}`);
      if (!response.ok)
        throw new Error(`LeetCode API error: ${response.status}`);

      const jsonData = await response.json();
      setData(transformLeetCodeData(jsonData));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch LeetCode data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, setData, loading, error, fetchData };
};
