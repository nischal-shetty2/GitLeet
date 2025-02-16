"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { HeatmapGrid } from "./HeatmapGrid";
import { calculateStreaks } from "@/lib/calculateStreaks";
import { days } from "@/lib/calendarUtils";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "./ui/loadingOverlay";
import { useGitHubData, useLeetCodeData } from "./UseData";
import { MonthLabels } from "./MonthLabels";
import { Header } from "./Header";
import { GitHubDataHook, LeetCodeDataHook } from "@/lib/types";
import { InputForm } from "./InputForm";
import { Switch } from "./ui/switch";
import { Github } from "lucide-react";
import { LeetcodeLogo } from "./ui/logo";

const ActivityDashboard = () => {
  const [platform, setPlatform] = useState<"github" | "leetcode">("leetcode");
  const [timeRange, setTimeRange] = useState<number>(new Date().getFullYear());
  const [githubUsername, setGithubUsername] = useState("nischal-shetty2");
  const [leetcodeUsername, setLeetcodeUsername] = useState("nischal_shetty");
  const { toast } = useToast();

  const github: GitHubDataHook = useGitHubData(githubUsername);
  const leetcode: LeetCodeDataHook = useLeetCodeData(leetcodeUsername);

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
  }, [github.error, leetcode.error]);

  const isLoading = github.loading || leetcode.loading;

  const combinedData = React.useMemo(() => {
    const allActivities = [...github.data, ...leetcode.data];

    const activityMap = new Map<string, number>();
    allActivities.forEach((activity) => {
      const dateStr = activity.date;
      const count = activity.count;
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + count);
    });

    const deduplicatedActivities = Array.from(activityMap.entries()).map(
      ([date, count]) => ({ date, count })
    );

    return calculateStreaks(deduplicatedActivities);
  }, [github.data, leetcode.data, timeRange]);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <Header />
        <InputForm
          github={github}
          githubUsername={githubUsername}
          leetcode={leetcode}
          leetcodeUsername={leetcodeUsername}
          setGithubUsername={setGithubUsername}
          setLeetcodeUsername={setLeetcodeUsername}
        />

        <Card className="relative">
          <CardHeader>
            <div className=" flex justify-between items-">
              <CardTitle>Activity Heatmap</CardTitle>

              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <Switch
                  checked={platform === "leetcode"}
                  onCheckedChange={(checked) =>
                    setPlatform(checked ? "leetcode" : "github")
                  }
                />
                <LeetcodeLogo />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingOverlay />
            ) : (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 pt-5 text-sm text-gray-500">
                    {days.map((day, i) => (
                      <div key={day} className="h-3 flex items-center">
                        {i % 2 === 0 && day}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <MonthLabels />
                    <HeatmapGrid
                      github={github}
                      leetcode={leetcode}
                      platform={platform}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Current Streak"
            value={`${combinedData.currentStreak} days`}
            helpText="Combined streak on GitHub and LeetCode"
          />
          <StatsCard
            title="Longest Streak"
            value={`${combinedData.longestStreak} days`}
            helpText="Longest combined streak on GitHub and LeetCode"
          />
          <StatsCard
            title="Total Activity"
            value={combinedData.totalContributions}
            helpText="Contribution on github and submissions on leetcode combined"
          />
          <StatsCard
            title="Average Per Day"
            value={combinedData.averagePerDay.toFixed(1)}
            helpText="Average of Contributions and submissions on Github + Leetcode"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
