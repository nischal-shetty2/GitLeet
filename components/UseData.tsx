import {
  transformGitHubData,
  transformLeetCodeData,
} from "@/lib/transformData";
import { ActivityData, GitHubJsonData, LeetCodeJsonData } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { responseCache } from "@/lib/cache";

export const useGitHubData = (username: string) => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const lastFetchedUsernameRef = useRef<string>("");

  // Clear error when username changes
  useEffect(() => {
    if (username !== lastFetchedUsernameRef.current) {
      setError(null);
      setIsFromCache(false);
    }
  }, [username]);

  const fetchData = async (overrideUsername?: string) => {
    const usernameToFetch = overrideUsername || username;

    if (!usernameToFetch) return;

    // Reset state for new fetch
    setLoading(true);
    setError(null);
    setData([]);
    setIsFromCache(false);

    try {
      // Store the username we're currently fetching to handle race conditions
      const fetchingUsername = usernameToFetch;
      lastFetchedUsernameRef.current = usernameToFetch;

      // Check cache first
      const cacheKey = `github:${usernameToFetch}`;
      const cachedData = responseCache.get<GitHubJsonData>(cacheKey);

      if (cachedData) {
        // Use cached data if available
        setData(transformGitHubData(cachedData));
        setIsFromCache(true);
      }

      // Always attempt to fetch fresh data, even if we have cache
      const response = await axios.get(`/api/github`, {
        params: { username: usernameToFetch },
      });

      // If the username changed during fetch, discard this result
      if (fetchingUsername !== lastFetchedUsernameRef.current) {
        return;
      }

      // Cache the successful response
      responseCache.set(cacheKey, response.data);
      setIsFromCache(false);

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
                  : err.response.status === 429
                  ? "GitHub API rate limit exceeded - please try again later"
                  : "GitHub API service unavailable"
              }`
            : axios.isAxiosError(err) && err.code === "ECONNABORTED"
            ? "Request timed out - server may be under heavy load"
            : "Failed to fetch GitHub data - please try again later";

        setError(errorMessage);

        // Try to use cache if API call failed
        const cacheKey = `github:${usernameToFetch}`;
        const cachedData = responseCache.get<GitHubJsonData>(cacheKey);

        if (cachedData) {
          setData(transformGitHubData(cachedData));
          setIsFromCache(true);
          setError((error) =>
            error ? `${error} (showing cached data)` : null
          );
        } else {
          setData([]);
        }
      }
    } finally {
      // Only update loading state if we're still interested in this username
      if (usernameToFetch === lastFetchedUsernameRef.current) {
        setLoading(false);
      }
    }
  };

  return { data, setData, loading, error, setError, fetchData, isFromCache };
};

export const useLeetCodeData = (username: string) => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const lastFetchedUsernameRef = useRef<string>("");

  // Clear error when username changes
  useEffect(() => {
    if (username !== lastFetchedUsernameRef.current) {
      setError(null);
      setIsFromCache(false);
    }
  }, [username]);

  const fetchData = async (overrideUsername?: string) => {
    const usernameToFetch = overrideUsername || username;

    if (!usernameToFetch) return;

    // Reset state for new fetch
    setLoading(true);
    setError(null);
    setData([]);
    setIsFromCache(false);

    try {
      // Store the username we're currently fetching to handle race conditions
      const fetchingUsername = usernameToFetch;
      lastFetchedUsernameRef.current = usernameToFetch;

      // Check cache first
      const cacheKey = `leetcode:${usernameToFetch}`;
      const cachedData = responseCache.get<LeetCodeJsonData>(cacheKey);

      if (cachedData) {
        // Use cached data if available
        setData(transformLeetCodeData(cachedData));
        setIsFromCache(true);
      }

      const response = await axios.get(`/api/leetcode`, {
        params: { username: usernameToFetch },
      });

      // If the username changed during fetch, discard this result
      if (fetchingUsername !== lastFetchedUsernameRef.current) {
        return;
      }

      // Cache the successful response
      responseCache.set(cacheKey, response.data);
      setIsFromCache(false);

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
                  : err.response.status === 429
                  ? "LeetCode API rate limit exceeded - please try again later"
                  : "LeetCode API service unavailable"
              }`
            : axios.isAxiosError(err) && err.code === "ECONNABORTED"
            ? "Request timed out - server may be under heavy load"
            : err instanceof Error
            ? `Error: ${err.message}`
            : "Failed to fetch LeetCode data - please try again later";

        setError(errorMessage);

        // Try to use cache if API call failed
        const cacheKey = `leetcode:${usernameToFetch}`;
        const cachedData = responseCache.get<LeetCodeJsonData>(cacheKey);

        if (cachedData) {
          setData(transformLeetCodeData(cachedData));
          setIsFromCache(true);
          setError((error) =>
            error ? `${error} (showing cached data)` : null
          );
        } else {
          setData([]);
        }
      }
    } finally {
      // Only update loading state if we're still interested in this username
      if (usernameToFetch === lastFetchedUsernameRef.current) {
        setLoading(false);
      }
    }
  };

  return { data, setData, loading, error, setError, fetchData, isFromCache };
};
