"use client";
import React, { useState, useEffect, memo, useMemo } from "react";
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

// Memoizing sub-components to avoid unnecessary re-renders
const MemoizedLeetCodeHeatmap = memo(LeetCodeHeatmap);
const MemoizedStatsCard = memo(StatsCard);
const MemoizedInputForm = memo(InputForm);

const ActivityDashboard = () => {
  const [githubUsername, setGithubUsername] = useState("nischal-shetty2");
  const [leetcodeUsername, setLeetcodeUsername] = useState("nischal_shetty");
  const { toast } = useToast();

  // Custom hooks for data fetching with username state
  const github: GitHubDataHook = useGitHubData(githubUsername);
  const leetcode: LeetCodeDataHook = useLeetCodeData(leetcodeUsername);

  // Handle errors with toast notifications
  useEffect(() => {
    if (github.error) {
      toast({
        title: "GitHub Error",
        description: github.error,
        variant: "destructive",
      });
    }
    if (leetcode.error) {
      toast({
        title: "LeetCode Error",
        description: leetcode.error,
        variant: "destructive",
      });
    }
  }, [github.error, leetcode.error, toast]);

  const isLoading = github.loading || leetcode.loading;

  // Improved combined data calculation with proper date normalization
  const combinedData = useMemo(() => {
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

    // Normalize all dates and merge counts by date
    const activityMap = new Map<string, number>();
    allActivities.forEach((activity) => {
      try {
        // Ensure consistent date format across all activities
        const date = new Date(activity.date);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split("T")[0];
          const count = activity.count;
          activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + count);
        }
      } catch (err) {
        console.error("Invalid date format:", activity.date);
      }
    });

    // Convert to array format for streak calculation
    const deduplicatedActivities = Array.from(activityMap.entries())
      .map(([date, count]) => ({ date, count }))
      // Sort by date for better processing
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return calculateStreaks(deduplicatedActivities);
  }, [github.data, leetcode.data]);

  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-6 md:space-y-8">
        <Header />

        <section aria-label="User inputs">
          <h2 className="sr-only">Enter GitHub and LeetCode Usernames</h2>
          <MemoizedInputForm
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
                        <MemoizedLeetCodeHeatmap
                          github={github}
                          leetcode={leetcode}
                        />
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
            <MemoizedStatsCard
              title="Current Streak"
              value={`${combinedData.currentStreak} days`}
              helpText="Combined streak on GitHub and LeetCode"
            />
            <MemoizedStatsCard
              title="Longest Streak"
              value={`${combinedData.longestStreak} days`}
              helpText="Longest combined streak on GitHub and LeetCode"
            />
            <MemoizedStatsCard
              title="Total Activity"
              value={combinedData.totalContributions}
              helpText="Contribution on GitHub and submissions on LeetCode combined"
            />
            <MemoizedStatsCard
              title="Average Per Day"
              value={combinedData.averagePerDay.toFixed(1)}
              helpText="Average of contributions and submissions on GitHub + LeetCode"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ActivityDashboard;
