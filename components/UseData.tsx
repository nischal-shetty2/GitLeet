import {
  transformGitHubData,
  transformLeetCodeData,
} from "@/lib/transformData";
import { ActivityData } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useGitHubData = (username: string) => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedUsernameRef = useRef<string>("");

  // Clear error when username changes
  useEffect(() => {
    if (username !== lastFetchedUsernameRef.current) {
      setError(null);
    }
  }, [username]);

  const fetchData = async (overrideUsername?: string) => {
    const usernameToFetch = overrideUsername || username;

    if (!usernameToFetch) return;

    // Reset state for new fetch
    setLoading(true);
    setError(null);
    setData([]);

    try {
      // Store the username we're currently fetching to handle race conditions
      const fetchingUsername = usernameToFetch;
      lastFetchedUsernameRef.current = usernameToFetch;

      const response = await axios.get(`/api/github`, {
        params: { username: usernameToFetch },
      });

      // If the username changed during fetch, discard this result
      if (fetchingUsername !== lastFetchedUsernameRef.current) {
        return;
      }

      // One more check to ensure username didn't change during processing
      if (fetchingUsername === lastFetchedUsernameRef.current) {
        setData(transformGitHubData(response.data));
      }
    } catch (err) {
      // Only set error if we're still interested in this username
      if (usernameToFetch === lastFetchedUsernameRef.current) {
        const errorMessage =
          axios.isAxiosError(err) && err.response
            ? `GitHub API error: ${
                err.response.status === 404
                  ? "invalid username"
                  : "GitHub API rate limit exceeded"
              }`
            : "Failed to fetch GitHub data";

        setError(errorMessage);
        setData([]);
      }
    } finally {
      // Only update loading state if we're still interested in this username
      if (usernameToFetch === lastFetchedUsernameRef.current) {
        setLoading(false);
      }
    }
  };

  return { data, setData, loading, error, setError, fetchData };
};

export const useLeetCodeData = (username: string) => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedUsernameRef = useRef<string>("");

  // Clear error when username changes
  useEffect(() => {
    if (username !== lastFetchedUsernameRef.current) {
      setError(null);
    }
  }, [username]);

  const fetchData = async (overrideUsername?: string) => {
    const usernameToFetch = overrideUsername || username;

    if (!usernameToFetch) return;

    // Reset state for new fetch
    setLoading(true);
    setError(null);
    setData([]);

    try {
      // Store the username we're currently fetching to handle race conditions
      const fetchingUsername = usernameToFetch;
      lastFetchedUsernameRef.current = usernameToFetch;

      const response = await axios.get(`/api/leetcode`, {
        params: { username: usernameToFetch },
      });

      // If the username changed during fetch, discard this result
      if (fetchingUsername !== lastFetchedUsernameRef.current) {
        return;
      }

      // One more check to ensure username didn't change during processing
      if (fetchingUsername === lastFetchedUsernameRef.current) {
        setData(transformLeetCodeData(response.data));
      }
    } catch (err) {
      // Only set error if we're still interested in this username
      if (usernameToFetch === lastFetchedUsernameRef.current) {
        const errorMessage =
          axios.isAxiosError(err) && err.response
            ? `LeetCode API error: ${
                err.response.status === 404
                  ? "invalid username"
                  : "LeetCode API rate limit exceeded"
              }`
            : err instanceof Error
            ? err.message
            : "Failed to fetch LeetCode data";

        setError(errorMessage);
        setData([]);
      }
    } finally {
      // Only update loading state if we're still interested in this username
      if (usernameToFetch === lastFetchedUsernameRef.current) {
        setLoading(false);
      }
    }
  };

  return { data, setData, loading, error, setError, fetchData };
};
