"use client";

import { SessionProvider } from "next-auth/react";
import { HabitProvider } from "../context/HabitContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HabitProvider>
        {children}
      </HabitProvider>
    </SessionProvider>
  );
}
