"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { calculateStreaks } from "@/lib/calculateStreaks";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "./ui/loadingOverlay";
import { useGitHubData, useLeetCodeData } from "./UseData";
import { Header } from "./Header";
import { GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { InputForm } from "./InputForm";
import { LeetcodeLogo } from "./ui/logo";
import { LeetCodeHeatmap } from "./LeetCodeHeatmap";

const ActivityDashboard = () => {
  const [githubUsername, setGithubUsername] = useState("nischal-shetty2");
  const [leetcodeUsername, setLeetcodeUsername] = useState("nischal_shetty");
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);

  // Custom hooks for data fetching with username state
  const github: GitHubDataHook = useGitHubData(githubUsername);
  const leetcode: LeetCodeDataHook = useLeetCodeData(leetcodeUsername);

  // Handle errors with toast notifications and retry logic
  useEffect(() => {
    if (github.error) {
      toast({
        title: "GitHub Error",
        description: github.error,
        variant: "destructive",
        action:
          github.error.includes("rate limit") ||
          github.error.includes("timeout") ? (
            <button
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded"
              onClick={() => {
                setIsRetrying(true);
                setTimeout(() => {
                  github.fetchData(githubUsername);
                  setIsRetrying(false);
                }, 3000);
              }}
              disabled={isRetrying}>
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          ) : undefined,
      });
    }

    if (leetcode.error) {
      toast({
        title: "LeetCode Error",
        description: leetcode.error,
        variant: "destructive",
        action:
          leetcode.error.includes("rate limit") ||
          leetcode.error.includes("timeout") ? (
            <button
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded"
              onClick={() => {
                setIsRetrying(true);
                setTimeout(() => {
                  leetcode.fetchData(leetcodeUsername);
                  setIsRetrying(false);
                }, 3000);
              }}
              disabled={isRetrying}>
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          ) : undefined,
      });
    }
  }, [
    github,
    github.error,
    leetcode,
    leetcode.error,
    toast,
    githubUsername,
    leetcodeUsername,
    isRetrying,
  ]);

  const isLoading = github.loading || leetcode.loading || isRetrying;

  // Improved combined data calculation with proper date normalization
  const getCombinedData = () => {
    // Defensive copies of data arrays
    const githubActivities = github.data ? [...github.data] : [];
    const leetcodeActivities = leetcode.data ? [...leetcode.data] : [];

    const allActivities = [...githubActivities, ...leetcodeActivities];

    // Early return if no data
    if (allActivities.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalContributions: 0,
        averagePerDay: 0,
        bestDay: { date: "", count: 0 },
      };
    }

    // ...existing code for processing...
    const activityMap = new Map<string, number>();
    allActivities.forEach((activity) => {
      try {
        if (!activity.date) {
          console.warn("Activity with missing date found");
          return;
        }

        // Handle date strings directly if they're already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(activity.date)) {
          activityMap.set(
            activity.date,
            (activityMap.get(activity.date) || 0) + activity.count
          );
          return;
        }

        // Create a new Date object for other formats
        const date = new Date(activity.date);

        if (!isNaN(date.getTime())) {
          // Format date consistently to avoid timezone issues
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateStr = `${year}-${month}-${day}`;

          activityMap.set(
            dateStr,
            (activityMap.get(dateStr) || 0) + activity.count
          );
        }
      } catch (err) {
        console.error("Invalid date format:", err, "for date:", activity.date);
      }
    });

    // Convert to array format for streak calculation
    const deduplicatedActivities = Array.from(activityMap.entries())
      .map(([date, count]) => ({ date, count }))
      // Sort by date for better processing
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return calculateStreaks(deduplicatedActivities);
  };

  const combinedData = getCombinedData();

  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-6 md:space-y-8">
        <Header />

        <section aria-label="User inputs">
          <h2 className="sr-only">Enter GitHub and LeetCode Usernames</h2>
          <InputForm
            github={github}
            githubUsername={githubUsername}
            leetcode={leetcode}
            leetcodeUsername={leetcodeUsername}
            setGithubUsername={setGithubUsername}
            setLeetcodeUsername={setLeetcodeUsername}
          />
        </section>

        <section aria-label="Activity visualization">
          <Card className="relative">
            <CardHeader className="pb-2 sm:pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <CardTitle className="text-lg sm:text-xl">
                  Activity Heatmap
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <LeetcodeLogo />
                    <span className="text-sm text-muted-foreground">Style</span>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-500 ring-1 ring-inset ring-yellow-600/20">
                    Beta
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingOverlay />
              ) : (
                <div className="flex justify-center">
                  <div className="flex w-full">
                    <div className="flex flex-col w-full justify-center items-center overflow-x-auto">
                      <div className="min-w-fit">
                        <LeetCodeHeatmap github={github} leetcode={leetcode} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-label="Activity statistics">
          <h2 className="sr-only">Coding Statistics and Streaks</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <StatsCard
              key="current-streak"
              title="Current Streak"
              value={`${combinedData.currentStreak} days`}
              helpText="Combined streak on GitHub and LeetCode"
            />
            <StatsCard
              key="longest-streak"
              title="Longest Streak"
              value={`${combinedData.longestStreak} days`}
              helpText="Longest combined streak on GitHub and LeetCode"
            />
            <StatsCard
              key="total-activity"
              title="Total Activity"
              value={combinedData.totalContributions}
              helpText="Contribution on GitHub and submissions on LeetCode"
            />
            <StatsCard
              key="average-per-day"
              title="Average Per Day"
              value={combinedData.averagePerDay.toFixed(1)}
              helpText="Average contributions + submissions"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ActivityDashboard;
