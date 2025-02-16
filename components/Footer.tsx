"use client";
import { Github } from "lucide-react";
import { useTheme } from "next-themes";

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
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            © Gitleet™ By -{" "}
            <a className=" text-blue-800 underline" href="https://zreo.xyz">
              Nischal Shetty
            </a>
          </div>

          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="mailto:nischal.shetty02@gmail.com"
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } hover:underline ${
                    isDark ? "hover:text-gray-100" : "hover:text-gray-900"
                  } transition-colors`}>
                  Contact Me
                </a>
              </li>
              <li>
                <a href="#" aria-label="GitHub">
                  <Github
                    className={`w-5 h-5 rounded-sm transition duration-200 ${
                      isDark
                        ? "hover:bg-gray-700"
                        : "hover:bg-white hover:invert"
                    }`}
                  />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${isDark ? "hover:text-gray-100" : "hover:text-gray-900"}`}
                  aria-label="Twitter/X">
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
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
