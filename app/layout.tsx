import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gitleet - GitHub & LeetCode Activity Tracker in One Dashboard",
  description: "Combine and track your GitHub contributions and LeetCode submissions in a single dashboard. Visualize your coding activity, streaks, and progress across both platforms.",
  keywords: ["GitHub tracker", "LeetCode tracker", "coding activity", "developer dashboard", "GitHub contributions", "LeetCode submissions", "coding streaks", "programming activity", "developer analytics", "code tracking"],
  authors: [{ name: "Nischal Shetty" }],
  openGraph: {
    title: "Gitleet - GitHub & LeetCode Activity Tracker in One Dashboard",
    description: "Combine and track your GitHub contributions and LeetCode submissions in a single dashboard. Visualize your coding activity across platforms.",
    url: "https://gitleet.vercel.app",
    siteName: "Gitleet",
    images: [
      {
        url: "/gitleet.jpg",
        width: 1200,
        height: 630,
        alt: "Gitleet - GitHub & LeetCode Activity Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitleet - GitHub & LeetCode Activity Tracker",
    description: "Track your GitHub and LeetCode activity in one place",
    images: ["/gitleet.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://gitleet.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
