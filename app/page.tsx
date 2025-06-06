import { Footer } from "@/components/Footer";
import ActivityDashboard from "../components/ActivityDashboard";
import "@/app/globals.css";
import { Suspense } from "react";
import { LoadingOverlay } from "@/components/ui/loadingOverlay";

export default function Home() {
  // JSON-LD structured data for better SEO
  function JsonLd() {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Gitleet",
            description:
              "Combine and track your GitHub contributions and LeetCode submissions in a single dashboard.",
            url: "https://gitleet.tech",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            author: {
              "@type": "Person",
              name: "Nischal Shetty",
            },
          }),
        }}
      />
    );
  }

  return (
    <>
      <JsonLd />
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingOverlay />}>
          <ActivityDashboard />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}
