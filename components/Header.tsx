import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">GitLeet</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};
