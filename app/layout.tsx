import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title:
    "Gitleet - Visualize GitHub & LeetCode Activity Together | Track Coding Progress",
  description:
    "Combine GitHub commits and LeetCode problem-solving in one dashboard. Track your coding streaks, visualize contributions, and analyze your programming journey. Perfect for tech interviews and skill progression tracking.",
  keywords: [
    "GitHub tracker",
    "LeetCode tracker",
    "coding activity dashboard",
    "GitHub contributions visualization",
    "LeetCode submissions tracker",
    "developer portfolio tool",
    "coding streaks",
    "programming activity heatmap",
    "GitHub and LeetCode stats",
    "developer analytics",
    "code commit history",
    "tech interview preparation",
    "programming activity tracker",
    "GitHub commit graph",
    "LeetCode problem tracker",
    "coding consistency tracker",
  ],
  authors: [
    { name: "Nischal Shetty", url: "https://github.com/nischal-shetty2" },
  ],
  metadataBase: new URL("https://gitleet.tech"),
  creator: "Nischal Shetty",
  category: "Technology",
  alternates: {
    canonical: "https://gitleet.tech",
  },
  openGraph: {
    title:
      "Gitleet - GitHub & LeetCode Activity Dashboard | Track Your Coding Journey",
    description:
      "Visualize GitHub and LeetCode contributions in one unified dashboard. Perfect for developers tracking interview prep, daily coding habits, and programming skills progression.",
    url: "https://gitleet.tech",
    siteName: "Gitleet",
    images: [
      {
        url: "/gitleet.jpg",
        width: 1200,
        height: 630,
        alt: "Gitleet - GitHub & LeetCode Activity Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualize GitHub & LeetCode Activity | Gitleet Dashboard",
    description:
      "Track GitHub commits and LeetCode submissions graph in one place.",
    images: ["/gitleet.jpg"],
    creator: "@NischalShetty02",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
      itemScope
      itemType="https://schema.org/WebSite">
      <head>
        <link rel="canonical" href="https://gitleet.tech" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://leetcode.com" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
