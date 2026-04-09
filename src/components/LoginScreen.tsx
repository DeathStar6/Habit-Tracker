"use client";

import { signIn } from "next-auth/react";
import { Sparkles, Target, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Log in
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
          setIsLoading(false);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        // Sign up
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "An error occurred during signup.");
          setIsLoading(false);
          return;
        }

        // Auto login after successful signup
        const signInRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.error) {
          setError(signInRes.error);
          setIsLoading(false);
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card rounded-3xl shadow-xl border p-8 flex flex-col items-center text-center"
      >
        
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <Target size={32} />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Habit Tracker</h1>
        <p className="text-muted-foreground mb-6">
          Level up your life, one habit at a time. Track your daily quests, build streaks, and unlock epic avatars!
        </p>

        {error && (
          <div className="w-full bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center justify-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mb-6">
          {!isLogin && (
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl border bg-background/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 rounded-xl border bg-background/50 focus:ring-2 focus:ring-primary outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 rounded-xl border bg-background/50 focus:ring-2 focus:ring-primary outline-none transition-all"
          />
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 group overflow-hidden py-3 bg-primary text-primary-foreground font-bold border border-primary/20 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 placeholder:blur-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Log In" : "Sign Up")}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="font-semibold text-primary hover:underline transition-all"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>

      </motion.div>
    </div>
  );
}
