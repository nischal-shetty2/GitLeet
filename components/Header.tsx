"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { StarGithub } from "./ui/starGithub";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 sm:gap-0">
      <Link href="/" aria-label="Gitleet Home">
        <Image
          alt="Gitleet - GitHub & LeetCode Activity Tracker"
          width={115}
          height={50}
          src="/gitleet.jpg"
          className="rounded-md contrast-125 shadow-sm"
          priority
          sizes="(max-width: 768px) 115px, 115px"
        />
      </Link>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          className="border"
          size="icon"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          onClick={() =>
            setTheme(!theme || theme === "dark" ? "light" : "dark")
          }>
          {theme === "dark" ? (
            <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </Button>
        <StarGithub />
      </div>
    </div>
  );
};
