import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HabitProvider } from "../context/HabitContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gamified Habit Tracker",
  description: "Level up your life by maintaining consistency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <HabitProvider>
          {children}
        </HabitProvider>
      </body>
    </html>
  );
}
