"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { StarGithub } from "./ui/starGithub";
import Image from "next/image";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between items-center">
      <Image
        alt="GitLeet"
        width={115}
        height={100}
        src={"/gitleet.jpg"}
        className="rounded-md contrast-200"
      />
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          className="border"
          size="icon"
          onClick={() =>
            setTheme(!theme || theme === "dark" ? "light" : "dark")
          }>
          {theme === "dark" ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </Button>
        <StarGithub />
      </div>
    </div>
  );
};
