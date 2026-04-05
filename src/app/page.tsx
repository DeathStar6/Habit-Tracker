import Navbar from "../components/Navbar";
import StatsPanel from "../components/StatsPanel";
import TrackerGrid from "../components/TrackerGrid";
import AchievementPanel from "../components/AchievementPanel";
import Heatmap from "../components/Heatmap";
import ShopPanel from "../components/ShopPanel";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import LoginScreen from "../components/LoginScreen";
import QuestsPanel from "../components/QuestsPanel";
import { auth } from "../auth";

const quotes = [
  "Level up one day at a time.",
  "Consistency is your ultimate superpower.",
  "Grind today, shine tomorrow.",
  "Small steps lead to epic loot.",
  "Every habit is a side quest complete."
];

export default async function Home() {
  const session = await auth();
  if (!session) {
    return <LoginScreen />;
  }

  const quote = quotes[new Date().getDay() % quotes.length];

  return (
    <main className="min-h-screen pb-12 bg-transparent text-foreground transition-colors duration-300">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Daily Quests</h1>
            <p className="text-muted-foreground mt-1">
              <span className="italic">&quot;{quote}&quot;</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <StatsPanel />
            <AchievementPanel />
            <AIAnalysisPanel />
            <ShopPanel />
          </div>
          <div className="lg:col-span-2">
            <TrackerGrid />
            <QuestsPanel />
            <Heatmap />
          </div>
        </div>
      </div>
    </main>
  );
}
