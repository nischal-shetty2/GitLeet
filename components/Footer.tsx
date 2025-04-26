"use client";
import { Github } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t mt-auto ${
        isDark ? "bg-zinc-900 border-zinc-700" : "bg-white"
      }`}>
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div
            className={`text-center md:text-left text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            } mb-2 md:mb-0`}>
            <p>
              © {new Date().getFullYear()} Gitleet™ By -{" "}
              <Link
                href="https://zreo.xyz"
                className="text-blue-800 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer">
                Nischal Shetty
              </Link>
            </p>
            <p className="text-xs mt-1">
              Track your GitHub and LeetCode contributions in one place
            </p>
          </div>

          <nav className="w-full md:w-auto" aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6">
              <li>
                <Link
                  href="mailto:nischal.shetty02@gmail.com"
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } hover:underline ${
                    isDark ? "hover:text-gray-100" : "hover:text-gray-900"
                  } transition-colors`}
                  aria-label="Contact via Email">
                  Contact Me
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/nischal-shetty2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit GitHub Repository">
                  <Github
                    className={`w-7 h-7 p-0.5 rounded-sm transition duration-200 ${
                      isDark
                        ? "hover:bg-gray-700"
                        : "hover:bg-white hover:invert"
                    }`}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/NischalShetty02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${isDark ? "hover:text-gray-100" : "hover:text-gray-900"}`}
                  aria-label="Twitter/X Profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    className={`transition duration-200 ${
                      isDark ? "invert hover:invert-0" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 512 512"
                    id="twitter">
                    <g clipPath="url(#clip0_84_15697)">
                      <rect width="512" height="512" fill="#000" rx="60"></rect>
                      <path
                        fill="#fff"
                        d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_84_15697">
                        <rect width="512" height="512" fill="#fff"></rect>
                      </clipPath>
                    </defs>
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
