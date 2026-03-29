"use client";

import { useHabits } from "../context/HabitContext";
import { Trophy, CheckCircle, ShieldCheck, Flame, Star } from "lucide-react";

export default function AchievementPanel() {
  const { achievements } = useHabits();

  const allAchievements = [
    {
      id: "First Step",
      title: "First Step",
      desc: "Complete your first habit",
      icon: <Star size={24} className="text-yellow-500" />
    },
    {
      id: "Consistency King",
      title: "Consistency King",
      desc: "7-day streak of all habits",
      icon: <ShieldCheck size={24} className="text-blue-500" />
    },
    {
      id: "Grinder",
      title: "Grinder",
      desc: "30-day streak of all habits",
      icon: <Flame size={24} className="text-orange-500" />
    },
    {
      id: "Perfect Week",
      title: "Perfect Week",
      desc: "All habits completed for 7 days",
      icon: <CheckCircle size={24} className="text-green-500" />
    }
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border mt-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-500" /> Achievements
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {allAchievements.map((ach) => {
          const unlocked = achievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${
                unlocked 
                  ? "border-primary bg-primary/5" 
                  : "border-muted bg-secondary/50 grayscale opacity-60"
              }`}
            >
              <div className={`p-3 rounded-full mb-3 ${unlocked ? "bg-card shadow-sm" : "bg-muted"}`}>
                {ach.icon}
              </div>
              <h3 className="font-bold text-sm mb-1">{ach.title}</h3>
              <p className="text-xs text-muted-foreground">{ach.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
