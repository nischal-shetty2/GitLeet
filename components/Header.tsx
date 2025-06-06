"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { StarGithub } from "./ui/starGithub";
import Image from "next/image";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full relative z-10">
      <div className="w-full px-4 sm:px-6 bg-gradient-to-r from-background to-card">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center gap-4">
            <div className="relative">
              <Image
                alt="Gitleet - GitHub & LeetCode Activity Tracker"
                width={115}
                height={50}
                src="/gitleet.jpg"
                className="rounded-md contrast-125 shadow-sm hover:shadow-md transition-all duration-300"
                priority
                sizes="(max-width: 768px) 115px, 115px"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-5 w-5 sm:h-5 sm:w-5" />
                )}
              </Button>
              <StarGithub />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
