"use client";

import { useHabits } from "../context/HabitContext";
import { TrendingUp, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsPanel() {
  const { level, xp, xpToNextLevel, xpProgress, currentStreak, longestStreak } = useHabits();

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="text-primary" /> Player Stats
        </h2>
        <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
          Level {level}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm font-medium">
          <span>{xp} XP</span>
          <span className="text-muted-foreground">{xpToNextLevel} XP to Next Level</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-xl font-bold">{currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
            <p className="text-xl font-bold">{longestStreak} <span className="text-sm font-normal text-muted-foreground">days</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
