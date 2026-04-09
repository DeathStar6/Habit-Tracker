"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { User, LogOut, Check, X, Edit2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePanel() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setIsEditing(false);
        await update({ name }); // Trigger NextAuth session update if supported, or just reflect locally
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <User className="text-primary w-6 h-6" />
        <h2 className="text-xl font-bold">Profile</h2>
      </div>

      <div className="flex flex-col gap-1 w-full bg-secondary/30 p-4 rounded-xl">
        <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Email</div>
        <div className="font-medium truncate">{session.user.email}</div>
      </div>

      <div className="flex flex-col gap-1 w-full bg-secondary/30 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Name</div>
          {!isEditing && (
            <button onClick={() => { setIsEditing(true); setName(session.user?.name || ""); }} className="text-muted-foreground hover:text-primary transition-colors">
              <Edit2 size={16} />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="flex-1 bg-background border px-2 py-1 rounded outline-none focus:border-primary"
              autoFocus
            />
            <button onClick={handleSave} disabled={isLoading} className="text-green-500 hover:bg-green-500/20 p-1 rounded transition-colors">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            </button>
            <button onClick={() => setIsEditing(false)} disabled={isLoading} className="text-destructive hover:bg-destructive/20 p-1 rounded transition-colors">
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="font-medium text-lg truncate">{session.user?.name || "Player 1"}</div>
        )}
      </div>

      <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-2 w-full py-2.5 rounded-xl border border-destructive/30 text-destructive font-semibold hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Log Out
      </button>

    </div>
  );
}
