"use client";

import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { useHabits } from "../context/HabitContext";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "../lib/utils";
import { Difficulty } from "../lib/types";

const emojis = ["💧", "📖", "🏃", "🧘", "🥗", "🎸", "💸", "🧹", "💊", "🛏️"];
const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  hard: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function TrackerGrid() {
  const { habits, records, addHabit, toggleHabit, deleteHabit, resetWeek, reorderHabits } = useHabits();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "💧", difficulty: "easy" as Difficulty });

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handleCreate = () => {
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setIsAdding(false);
      setNewHabit({ name: "", icon: "💧", difficulty: "easy" as Difficulty });
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border mt-6">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Weekly Quests
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Conquer your week</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={resetWeek}
            className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-bold hover:bg-destructive/20 transition-colors"
          >
            Reset Week
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            <Plus size={18} /> Add Habit
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_repeat(7,60px)] gap-2 mb-4">
            <div className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Habit</div>
            {weekDays.map((date) => (
              <div key={date.toString()} className="text-center">
                <div className="text-xs text-muted-foreground font-bold uppercase">
                  {format(date, "EEE")}
                </div>
                <div className={cn(
                  "text-sm font-medium w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1",
                  format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                )}>
                  {format(date, "d")}
                </div>
              </div>
            ))}
          </div>

          <Reorder.Group axis="y" values={habits.map(h => h.id)} onReorder={reorderHabits} as="div">
            <AnimatePresence>
              {habits.map((habit) => (
                <Reorder.Item 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileDrag={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)", zIndex: 50 }}
                  key={habit.id}
                  value={habit.id}
                  as="div"
                  className="grid grid-cols-[1fr_repeat(7,60px)] gap-2 items-center mb-3 group p-2 hover:bg-secondary/40 rounded-xl transition-colors cursor-grab active:cursor-grabbing bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shadow-inner">
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{habit.name}</h3>
                      <div className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded border mt-1 inline-block", difficultyColors[habit.difficulty])}>
                        {habit.difficulty}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-2 cursor-pointer"
                    >
                    <Trash2 size={16} />
                  </button>
                </div>

                {weekDays.map((date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const isCompleted = records[dateStr]?.includes(habit.id);
                  const isFuture = date > new Date();

                  return (
                    <div key={dateStr} className="flex justify-center">
                      <button
                        disabled={isFuture}
                        onClick={() => toggleHabit(habit.id, dateStr)}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2",
                          isFuture ? "opacity-30 cursor-not-allowed border-dashed border-border" :
                          isCompleted ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" : "bg-card border-border hover:border-primary/50"
                        )}
                      >
                        {isCompleted && <CheckCircle2 size={24} className="fill-white text-primary" />}
                      </button>
                    </div>
                  );
                })}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {habits.length === 0 && !isAdding && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
              <p>No quests yet. Create one to begin your journey!</p>
            </div>
          )}

          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 border rounded-xl bg-secondary/30 flex gap-4 items-end"
            >
              <div className="flex-1">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Habit Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newHabit.name}
                  onChange={e => setNewHabit({...newHabit, name: e.target.value})}
                  className="w-full bg-background border px-3 py-2 rounded-lg text-sm"
                  placeholder="e.g. Drink Water"
                />
              </div>
              <div className="w-24">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Icon</label>
                <div className="relative">
                  <select 
                    value={newHabit.icon}
                    onChange={e => setNewHabit({...newHabit, icon: e.target.value})}
                    className="w-full bg-background border px-3 py-2 rounded-lg text-sm appearance-none"
                  >
                    {emojis.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="w-32">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Difficulty</label>
                <select 
                  value={newHabit.difficulty}
                  onChange={e => setNewHabit({...newHabit, difficulty: e.target.value as Difficulty})}
                  className="w-full bg-background border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="easy">Easy (+5 XP)</option>
                  <option value="medium">Medium (+10 XP)</option>
                  <option value="hard">Hard (+20 XP)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
