export interface ActivityData {
  date: string;
  count: number;
}

export interface GitHubJsonData {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
            }[];
          }[];
        };
      };
    };
  };
  errors?: [
    {
      message: string;
    }
  ];
}

export interface LeetCodeJsonData {
  data: {
    matchedUser: {
      submissionCalendar: string;
    };
  };
}

export interface GitHubDataHook {
  data: ActivityData[];
  setData: React.Dispatch<React.SetStateAction<ActivityData[]>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchData: (username?: string) => Promise<void>;
  isFromCache: boolean;
}

export interface LeetCodeDataHook {
  data: ActivityData[];
  setData: React.Dispatch<React.SetStateAction<ActivityData[]>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchData: (username?: string) => Promise<void>;
  isFromCache: boolean;
}
