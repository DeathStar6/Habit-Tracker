"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, MessageSquare } from "lucide-react";
import { useHabits } from "../context/HabitContext";

export default function AIAnalysisPanel() {
  const { level, currentStreak, activeAvatar, habits } = useHabits();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          currentStreak,
          activeAvatar,
          habits: habits.map(h => ({ name: h.name, icon: h.icon, difficulty: h.difficulty })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch insights.");
      }
      setInsight(data.insights);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        AI Coach
      </div>
      
      {!insight && !isLoading && !error && (
        <p className="text-sm text-muted-foreground">
          Get personalized insights and motivation based on your current progress!
        </p>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {insight && (
        <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-sm leading-relaxed relative">
          <MessageSquare className="w-4 h-4 text-muted-foreground absolute top-4 right-4 opacity-30" />
          {insight}
        </div>
      )}

      <button
        onClick={handleFetchInsights}
        disabled={isLoading || habits.length === 0}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors text-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {insight ? "Refresh Insights" : "Get AI Insights"}
          </>
        )}
      </button>

      {habits.length === 0 && (
        <p className="text-xs text-center text-muted-foreground mt-[-8px]">
          Add some habits first!
        </p>
      )}
    </div>
  );
}
