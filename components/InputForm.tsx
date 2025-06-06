import { Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { LeetcodeLogo } from "./ui/logo";
import { useEffect, useState } from "react";

interface InputFormTypes {
  githubUsername: string;
  setGithubUsername: (username: string) => void;
  leetcodeUsername: string;
  setLeetcodeUsername: (username: string) => void;
  github: GitHubDataHook;
  leetcode: LeetCodeDataHook;
}

export const InputForm = ({
  githubUsername,
  setGithubUsername,
  leetcodeUsername,
  setLeetcodeUsername,
  github,
  leetcode,
}: InputFormTypes) => {
  const [localGithubUsername, setLocalGithubUsername] =
    useState(githubUsername);
  const [localLeetcodeUsername, setLocalLeetcodeUsername] =
    useState(leetcodeUsername);
  const isLoading = github.loading || leetcode.loading;

  // Reset local state when parent state changes
  useEffect(() => {
    setLocalGithubUsername(githubUsername);
  }, [githubUsername]);

  useEffect(() => {
    setLocalLeetcodeUsername(leetcodeUsername);
  }, [leetcodeUsername]);

  const handleSearch = () => {
    // Clear previous errors and data to avoid stale data persistence
    github.setError(null);
    leetcode.setError(null);

    setGithubUsername(localGithubUsername);
    setLeetcodeUsername(localLeetcodeUsername);

    if (!localGithubUsername) {
      github.setData([]);
    } else {
      github.setData([]);
      github.fetchData(localGithubUsername);
    }

    if (!localLeetcodeUsername) {
      leetcode.setData([]);
    } else {
      leetcode.setData([]);
      leetcode.fetchData(localLeetcodeUsername);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Preload API call when user likely intends to search
  const handleUsernameInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    platform: "github" | "leetcode"
  ) => {
    const username = e.target.value;

    if (platform === "github") {
      setLocalGithubUsername(username);
      // Preload GitHub API when username is at least 3 chars
      if (username.length >= 3) {
        const link = document.head.querySelector(
          `link[rel="prefetch"][href*="/api/github?username=${encodeURIComponent(
            username
          )}"]`
        );
        if (!link) {
          const newLink = document.createElement("link");
          newLink.rel = "prefetch";
          newLink.href = `/api/github?username=${encodeURIComponent(username)}`;
          document.head.appendChild(newLink);
        }
      }
    } else {
      setLocalLeetcodeUsername(username);
      // Preload LeetCode API when username is at least 3 chars
      if (username.length >= 3) {
        const link = document.head.querySelector(
          `link[rel="prefetch"][href*="/api/leetcode?username=${encodeURIComponent(
            username
          )}"]`
        );
        if (!link) {
          const newLink = document.createElement("link");
          newLink.rel = "prefetch";
          newLink.href = `/api/leetcode?username=${encodeURIComponent(
            username
          )}`;
          document.head.appendChild(newLink);
        }
      }
    }
  };

  useEffect(() => {
    // Only fetch on initial mount if we have usernames
    if (localGithubUsername || localLeetcodeUsername) {
      handleSearch();
    }
    // Only run on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="transform transition-all duration-300 hover:shadow-lg">
      <CardContent className="space-y-6 pt-5 mt-5">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-3 group">
            <label
              htmlFor="github-username"
              className="text-sm font-medium flex items-center gap-2">
              GitHub Username
            </label>
            <div className="relative">
              <Input
                id="github-username"
                placeholder="Enter GitHub username"
                value={localGithubUsername}
                onChange={(e) => handleUsernameInput(e, "github")}
                onKeyDown={handleKeyPress}
                aria-describedby="github-desc"
                autoComplete="username"
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Github
                className="w-5 h-5 absolute left-3 top-2 text-muted-foreground"
                aria-hidden="true"
              />
              {github.error && (
                <p className="text-destructive text-xs mt-1 animate-pulse">
                  {github.error}
                </p>
              )}
            </div>
            <p id="github-desc" className="text-xs text-muted-foreground">
              Enter your GitHub username to track commit activity
            </p>
          </div>

          <div className="flex-1 space-y-3 group">
            <label
              htmlFor="leetcode-username"
              className="text-sm font-medium flex items-center gap-2">
              LeetCode Username
            </label>
            <div className="relative">
              <Input
                id="leetcode-username"
                placeholder="Enter LeetCode username"
                value={localLeetcodeUsername}
                onChange={(e) => {
                  handleUsernameInput(e, "leetcode");
                }}
                onKeyDown={handleKeyPress}
                aria-describedby="leetcode-desc"
                autoComplete="username"
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="absolute left-3 top-2 w-5 h-5 text-muted-foreground">
                <LeetcodeLogo />
              </div>
              {leetcode.error && (
                <p className="text-destructive text-xs mt-1 animate-pulse">
                  {leetcode.error}
                </p>
              )}
            </div>
            <p id="leetcode-desc" className="text-xs text-muted-foreground">
              Enter your LeetCode username to track problem-solving activity
            </p>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          className="w-full sm:ml-auto sm:block transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:shadow-md hover:shadow-primary/20"
          disabled={isLoading}
          aria-busy={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </div>
          ) : (
            "Search Profiles"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
