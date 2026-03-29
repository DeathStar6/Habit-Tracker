"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Volume2, VolumeX, Flame } from "lucide-react";
import { useHabits } from "../context/HabitContext";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { soundEnabled, toggleSound, currentStreak, activeAvatar } = useHabits();

  useEffect(() => {
    // Check initial theme
    if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      // eslint-disable-next-line
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      // eslint-disable-next-line
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-card shadow-sm border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center text-3xl">
          {activeAvatar}
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent hidden sm:block">
          Habit Quest
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full font-bold">
            <Flame size={18} className="fill-orange-500" />
            <span className="text-sm">{currentStreak}</span>
          </div>
        )}

        <div className="flex bg-muted rounded-full p-1">
          <button
            onClick={toggleSound}
            className="p-2 rounded-full hover:bg-background transition-colors"
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-background transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
