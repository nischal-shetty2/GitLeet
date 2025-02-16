import { Footer } from "@/components/Footer";
import ActivityDashboard from "../components/ActivityDashboard";
import "@/app/globals.css";

export default function Home() {
  return (
    <div>
      <ActivityDashboard />
      <Footer />
    </div>
  );
}
