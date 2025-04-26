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

    // Update parent state with local state
    setGithubUsername(localGithubUsername);
    setLeetcodeUsername(localLeetcodeUsername);

    // Fetch data as needed, reset data arrays to avoid showing stale data
    if (!localGithubUsername) {
      github.setData([]);
    } else {
      github.setData([]);
      github.fetchData();
    }

    if (!localLeetcodeUsername) {
      leetcode.setData([]);
    } else {
      leetcode.setData([]);
      leetcode.fetchData();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
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
    <Card>
      <CardHeader>
        <CardTitle id="usernames-section" className="text-xl">
          Enter Usernames
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Track your GitHub and LeetCode contributions together
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="github-username" className="text-sm font-medium">
              GitHub Username
            </label>
            <div className="flex gap-2 items-center">
              <Github className="w-5 h-5" aria-hidden="true" />
              <Input
                id="github-username"
                placeholder="Enter GitHub username"
                value={localGithubUsername}
                onChange={(e) => setLocalGithubUsername(e.target.value)}
                onKeyDown={handleKeyPress}
                aria-describedby="github-desc"
                autoComplete="username"
              />
            </div>
            <p id="github-desc" className="text-xs text-muted-foreground">
              Enter your GitHub username to view contributions
            </p>
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="leetcode-username" className="text-sm font-medium">
              LeetCode Username
            </label>
            <div className="flex gap-2 items-center">
              <LeetcodeLogo />
              <Input
                id="leetcode-username"
                placeholder="Enter LeetCode username"
                value={localLeetcodeUsername}
                onChange={(e) => setLocalLeetcodeUsername(e.target.value)}
                onKeyDown={handleKeyPress}
                aria-describedby="leetcode-desc"
                autoComplete="username"
              />
            </div>
            <p id="leetcode-desc" className="text-xs text-muted-foreground">
              Enter your LeetCode username to view submissions
            </p>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-4">
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Loading...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
