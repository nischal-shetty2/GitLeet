import { Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { LeetcodeLogo } from "./ui/logo";
import { useEffect } from "react";

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
  const handleSearch = () => {
    if (!githubUsername) github.setData([]);
    if (!leetcodeUsername) leetcode.setData([]);
    if (githubUsername) github.fetchData();
    if (leetcodeUsername) leetcode.fetchData();
  };
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Usernames</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">GitHub Username</label>
            <div className="flex gap-2 items-center">
              <Github className="w-5 h-5" />
              <Input
                placeholder="Enter GitHub username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">LeetCode Username</label>
            <div className="flex gap-2 items-center">
              <LeetcodeLogo />
              <Input
                placeholder="Enter LeetCode username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={github.loading || leetcode.loading}
          className="w-full mt-4">
          {github.loading || leetcode.loading ? "Loading..." : "Search"}
        </Button>
      </CardContent>
    </Card>
  );
};
