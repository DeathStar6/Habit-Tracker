"use client";

import { useHabits } from "../context/HabitContext";
import { format, subDays } from "date-fns";

export default function Heatmap() {
  const { records, habits } = useHabits();
  
  // Last 3 months (90 days approx, say 12 weeks = 84 days)
  const today = new Date();
  
  const days = Array.from({ length: 85 }).map((_, i) => {
    const d = subDays(today, 84 - i);
    return format(d, "yyyy-MM-dd");
  });

  // Group into weeks
  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border mt-6">
      <h2 className="text-xl font-bold mb-4">Activity Heatmap</h2>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day) => {
              const completedIds = records[day] || [];
              const totalActive = habits.length;
              const completedActive = habits.filter(h => completedIds.includes(h.id)).length;
              
              let bgClass = "bg-secondary";
              if (totalActive > 0) {
                const ratio = completedActive / totalActive;
                if (ratio > 0.99) bgClass = "bg-primary";
                else if (ratio >= 0.5) bgClass = "bg-primary/60";
                else if (ratio > 0) bgClass = "bg-primary/30";
              } else if (completedIds.length > 0) {
                 bgClass = "bg-primary"; // fallback if habits deleted
              }

              return (
                <div 
                  key={day} 
                  title={`${day}: ${completedActive}/${totalActive} quests`}
                  className={`w-4 h-4 rounded-sm ${bgClass}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center text-xs text-muted-foreground mt-4 justify-end">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-secondary" />
        <div className="w-3 h-3 rounded-sm bg-primary/30" />
        <div className="w-3 h-3 rounded-sm bg-primary/60" />
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
