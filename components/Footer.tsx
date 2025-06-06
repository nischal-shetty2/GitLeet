"use client";
import { Github } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t mt-auto ${
        isDark
          ? "bg-zinc-900/50 border-zinc-800"
          : "bg-white/50 backdrop-blur-sm"
      }`}>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div
            className={`text-center md:text-left ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
            <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm font-medium mb-1">
              © {currentYear}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold">
                Gitleet™
              </span>
              By{" "}
              <Link
                href="https://zreo.xyz"
                className="relative group inline-flex items-center"
                target="_blank"
                rel="noopener noreferrer">
                <span className="bg-gradient-to-r from-blue-600 dark:from-blue-400 to-blue-500 dark:to-blue-300 bg-clip-text text-transparent transition-all">
                  Nischal Shetty
                </span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Your <strong>GitHub</strong> commits and <strong>LeetCode</strong>{" "}
              submissions in one dashboard
            </p>
          </div>

          <nav className="w-full md:w-auto" aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6">
              <li>
                <Link
                  href="mailto:nischal.shetty02@gmail.com"
                  className={`text-sm ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  } relative group transition-colors`}
                  aria-label="Contact via Email">
                  <span>Contact Me</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/nischal-shetty2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit GitHub Repository"
                  className="group">
                  <Github
                    size={20}
                    className={`transition-all duration-300 ${
                      isDark
                        ? "text-zinc-400 group-hover:text-zinc-100"
                        : "text-zinc-600 group-hover:text-zinc-900"
                    }`}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/NischalShetty02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 group`}
                  aria-label="Twitter/X Profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    className={`transition-all duration-300 ${
                      isDark
                        ? "text-zinc-400 group-hover:text-zinc-100"
                        : "text-zinc-600 group-hover:text-zinc-900"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 512 512">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
