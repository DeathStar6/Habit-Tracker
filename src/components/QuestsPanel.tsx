"use client";

import { useState } from "react";
import { useHabits } from "../context/HabitContext";
import { CopyPlus, CheckCircle, Sparkles, TrendingUp } from "lucide-react";

export default function QuestsPanel() {
  const { quests, addQuest, completeQuest } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("100");

  const incompleteQuests = (quests || []).filter(q => !q.isComplete);
  const completeQuests = (quests || []).filter(q => q.isComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addQuest(title, parseInt(reward));
      setTitle("");
      setShowForm(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Sparkles className="text-yellow-500" />
            Epic Quests
          </h2>
          <p className="text-muted-foreground text-sm">One-off milestones for massive XP bounties.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary/10 text-primary hover:bg-primary/20 p-2 rounded-xl transition-colors"
        >
          <CopyPlus size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-secondary/30 rounded-2xl border border-secondary">
          <div className="flex gap-2">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="E.g. Run a 5k Marathon"
              className="flex-1 rounded-xl px-4 py-2 bg-background border outline-none focus:border-primary text-sm"
              maxLength={40}
              required
            />
            <select 
              value={reward} 
              onChange={e => setReward(e.target.value)}
              className="rounded-xl px-2 py-2 bg-background border outline-none font-bold text-sm text-yellow-600 dark:text-yellow-400"
            >
              <option value="50">+50 XP</option>
              <option value="100">+100 XP</option>
              <option value="250">+250 XP</option>
              <option value="500">+500 XP</option>
            </select>
          </div>
          <button type="submit" className="w-full mt-3 bg-primary text-primary-foreground py-2 rounded-xl font-bold text-sm shadow-md hover:bg-primary/90">
            Accept Quest
          </button>
        </form>
      )}

      <div className="space-y-3">
        {incompleteQuests.length === 0 && !showForm && (
          <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-xl">
            No active quests. Time to set a big goal!
          </div>
        )}
        
        {incompleteQuests.map((q) => (
          <div key={q.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-transparent hover:border-secondary transition-all group">
            <div>
              <p className="font-bold">{q.title}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold tracking-wide mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> +{q.xpReward} XP BOUNTY
              </p>
            </div>
            <button 
              onClick={() => completeQuest(q.id)}
              className="px-4 py-2 bg-background border shadow-sm text-sm font-bold rounded-xl hover:bg-green-500 hover:text-white hover:border-green-600 transition-colors flex items-center gap-2 group-hover:scale-105 active:scale-95"
            >
              Complete
            </button>
          </div>
        ))}
      </div>

      {completeQuests.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Completed Quests</h3>
          <div className="space-y-2 opacity-60">
             {completeQuests.slice(-3).map(q => (
               <div key={q.id} className="flex justify-between items-center text-sm p-2">
                 <span className="flex items-center gap-2 line-through"><CheckCircle size={14}/> {q.title}</span>
                 <span className="font-bold text-yellow-600">+{q.xpReward}</span>
               </div>
             ))}
          </div>
        </div>
      )}

    </div>
  );
}
