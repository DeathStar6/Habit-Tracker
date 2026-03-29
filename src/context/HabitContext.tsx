"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Habit, DailyRecord, Difficulty } from "../lib/types";
import { format, subDays, startOfWeek, addDays } from "date-fns";
import confetti from "canvas-confetti";

interface HabitState {
  habits: Habit[];
  records: DailyRecord;
  spentXp: number;
  unlockedAvatars: string[];
  activeAvatar: string;
}

interface DerivedStats {
  xp: number;
  coins: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  xpToNextLevel: number;
  xpProgress: number; // 0 to 100
}

interface HabitContextType extends HabitState, DerivedStats {
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  reorderHabits: (newOrderKeys: string[]) => void;
  purchaseItem: (cost: number, itemId: string) => void;
  equipAvatar: (itemId: string) => void;
  resetWeek: () => void;
  toggleSound: () => void;
  soundEnabled: boolean;
}

const defaultState: HabitState = {
  habits: [],
  records: {},
  spentXp: 0,
  unlockedAvatars: ["👨‍🚀"],
  activeAvatar: "👨‍🚀",
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABIT_STORAGE_KEY = "habit-tracker-data";
const SOUND_STORAGE_KEY = "habit-tracker-sound";

const XP_MAP: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 20,
};

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HabitState>(defaultState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(HABIT_STORAGE_KEY);
    if (data) {
      setState({ ...defaultState, ...JSON.parse(data) });
    }
    const soundData = localStorage.getItem(SOUND_STORAGE_KEY);
    if (soundData !== null) {
      setSoundEnabled(soundData === "true");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    }
  }, [soundEnabled, isLoaded]);

  const playSound = (type: "check" | "uncheck" | "levelup" | "bonus") => {
    if (!soundEnabled) return;
    try {
      let typeOsc: OscillatorType = "sine";
      let dur = 100;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === "check") {
        dur = 150;
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
      } else if (type === "uncheck") {
        dur = 150;
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
      } else if (type === "levelup") {
        dur = 400;
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.4);
      } else if (type === "bonus") {
        dur = 300;
        typeOsc = "square";
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      }

      osc.type = typeOsc;
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur / 1000);
      
      osc.start();
      osc.stop(audioCtx.currentTime + dur / 1000);
    } catch (_) {
      // ignore audio errors
    }
  };

  // Derive stats dynamically
  const deriveStats = (): DerivedStats => {
    let xp = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    const achievements = new Set<string>();

    const sortedDates = Object.keys(state.records).sort();
    
    // Check if habit is completed on date
    const allHabitsIds = state.habits.map((h) => h.id);
    
    // Calculate total XP
    sortedDates.forEach((date) => {
      const completedIds = state.records[date] || [];
      if (completedIds.length === 0) return;
      
      // Calculate XP for habits
      completedIds.forEach((id) => {
        const habit = state.habits.find((h) => h.id === id);
        if (habit) {
          xp += XP_MAP[habit.difficulty];
        }
      });

      // Daily bonus?
      const completedActive = allHabitsIds.filter(id => completedIds.includes(id));
      if (state.habits.length > 0 && completedActive.length === state.habits.length) {
        xp += 10;
      }
    });

    // We can also calculate weekly bonuses but it's complex to track historically cleanly.
    // For simplicity, we just check if current week is completely done for the bonus.
    
    // Calculate Streaks
    const today = format(new Date(), "yyyy-MM-dd");
    let tempStreak = 0;
    
    // Iterate from past to present to get longest and current
    const dateList: string[] = [];
    if (sortedDates.length > 0) {
      const firstDateStr = sortedDates[0];
      let curr = new Date(firstDateStr);
      const end = addDays(new Date(), 1); // Go up to today
      while (curr <= end) {
        dateList.push(format(curr, "yyyy-MM-dd"));
        curr = addDays(curr, 1);
      }
    }

    dateList.forEach(date => {
      const completedIds = state.records[date] || [];
      const completedActive = allHabitsIds.filter(id => completedIds.includes(id));
      const hasAllCompleted = state.habits.length > 0 && completedActive.length === state.habits.length;
      
      if (hasAllCompleted) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        
        // Track 7 days perfect week achievement within streak
        if (tempStreak === 7) achievements.add("Consistency King");
        if (tempStreak === 30) achievements.add("Grinder");
      } else {
        if (date < today) {
           // broken streak
           tempStreak = 0;
        }
      }
    });

    // if tempStreak applies to today or yesterday, it's the current streak
    const todayCompletedActive = allHabitsIds.filter(id => (state.records[today] || []).includes(id));
    const yesterdayCompletedActive = allHabitsIds.filter(id => (state.records[format(subDays(new Date(), 1), "yyyy-MM-dd")] || []).includes(id));
    
    const todayAll = state.habits.length > 0 && todayCompletedActive.length === state.habits.length;
    const yesterdayAll = state.habits.length > 0 && yesterdayCompletedActive.length === state.habits.length;

    currentStreak = tempStreak;
    if (!todayAll && !yesterdayAll) {
      currentStreak = 0; // broken
    }
    
    if (currentStreak >= 7) achievements.add("Perfect Week");
    
    // check single habit achievement
    let anyHabitDone = false;
    for(const k of sortedDates) {
      if ((state.records[k] || []).length > 0) anyHabitDone = true;
    }
    if (anyHabitDone) achievements.add("First Step");

    // Level
    let level = 1;
    let xpNeeded = 100 * level;
    let remainingXp = xp;
    while (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      level++;
      xpNeeded = 100 * level;
    }

    return {
      xp,
      coins: Math.max(0, xp - (state.spentXp || 0)),
      level,
      currentStreak,
      longestStreak,
      achievements: Array.from(achievements),
      xpToNextLevel: xpNeeded - remainingXp,
      xpProgress: (remainingXp / xpNeeded) * 100
    };
  };

  const addHabit = (habitOmit: Omit<Habit, "id" | "createdAt">) => {
    const habit: Habit = {
      ...habitOmit,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: format(new Date(), "yyyy-MM-dd"),
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, habit] }));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === id ? { ...h, ...updates } : h))
    }));
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
  };

  const toggleHabit = (id: string, date: string) => {
    setState(prev => {
      const dateRecords = prev.records[date] || [];
      const updatedDateRecords = dateRecords.includes(id)
        ? dateRecords.filter(rId => rId !== id)
        : [...dateRecords, id];
        
      if (!dateRecords.includes(id)) {
         playSound("check");
         // Check for all habits done
         const newCompleted = [...dateRecords, id];
         const allActive = prev.habits.map(h=>h.id);
         const completedActive = allActive.filter(hid => newCompleted.includes(hid));
         if (completedActive.length === allActive.length && allActive.length > 0) {
           confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
           playSound("bonus");
         }
      } else {
         playSound("uncheck");
      }

      return {
        ...prev,
        records: {
          ...prev.records,
          [date]: updatedDateRecords,
        }
      };
    });
  };

  const resetWeek = () => {
    // Clear current week's M-Su dates
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const datesToClear = Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "yyyy-MM-dd"));
    
    setState(prev => {
      const newRec = { ...prev.records };
      datesToClear.forEach(d => {
        delete newRec[d];
      });
      return { ...prev, records: newRec };
    });
  };

  const reorderHabits = (newOrderKeys: string[]) => {
    setState(prev => {
       const mapped = newOrderKeys.map(k => prev.habits.find(h => h.id === k)).filter(Boolean) as Habit[];
       if (mapped.length !== prev.habits.length) return prev;
       return { ...prev, habits: mapped };
    });
  };

  const purchaseItem = (cost: number, itemId: string) => {
    setState(prev => ({
      ...prev,
      spentXp: (prev.spentXp || 0) + cost,
      unlockedAvatars: [...(prev.unlockedAvatars || ["👨‍🚀"]), itemId]
    }));
    playSound("levelup");
  };

  const equipAvatar = (itemId: string) => {
    setState(prev => ({
      ...prev,
      activeAvatar: itemId
    }));
  };

  const toggleSound = () => setSoundEnabled(p => !p);

  const stats = deriveStats();

  // Handle Level Up Animation (simple hack: ref keeping track of level)
  React.useEffect(() => {
    if (!isLoaded) return;
    const prevLv = sessionStorage.getItem("current-level");
    if (prevLv && parseInt(prevLv) < stats.level) {
      playSound("levelup");
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500']
      });
    }
    sessionStorage.setItem("current-level", stats.level.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.level, isLoaded]);

  return (
    <HabitContext.Provider value={{
      ...state,
      ...stats,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabit,
      resetWeek,
      reorderHabits,
      purchaseItem,
      equipAvatar,
      toggleSound,
      soundEnabled
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used within HabitProvider");
  return context;
};
