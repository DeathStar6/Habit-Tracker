"use client";

import { signIn } from "next-auth/react";
import { Sparkles, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-xl border p-8 flex flex-col items-center text-center">
        
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Target size={32} />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Habit Tracker</h1>
        <p className="text-muted-foreground mb-8">
          Level up your life, one habit at a time. Track your daily quests, build streaks, and unlock epic avatars!
        </p>

        <div className="flex flex-col gap-4 w-full mb-8">
          <div className="flex items-center gap-3 text-sm text-left font-medium bg-secondary/50 p-3 rounded-xl">
            <Zap className="w-5 h-5 text-yellow-500" />
            Earn XP and Level Up naturally
          </div>
          <div className="flex items-center gap-3 text-sm text-left font-medium bg-secondary/50 p-3 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Coach for personalized insights
          </div>
        </div>

        <button 
          onClick={() => signIn('google')}
          className="w-full relative group overflow-hidden pl-4 pr-6 py-3 bg-white text-black font-bold border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
        >
          <div className="w-5 h-5 relative flex-shrink-0">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
          </div>
          Continue with Google
        </button>

      </div>
    </div>
  );
}
