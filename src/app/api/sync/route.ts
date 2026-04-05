import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id;
  const state = await req.json();

  // Upsert settings
  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      spentXp: state.spentXp || 0,
      unlockedAvatars: JSON.stringify(state.unlockedAvatars || ["👨‍🚀"]),
      activeAvatar: state.activeAvatar || "👨‍🚀",
      unlockedThemes: JSON.stringify(state.unlockedThemes || ["light"]),
      activeTheme: state.activeTheme || "light",
    },
    create: {
      userId,
      spentXp: state.spentXp || 0,
      unlockedAvatars: JSON.stringify(state.unlockedAvatars || ["👨‍🚀"]),
      activeAvatar: state.activeAvatar || "👨‍🚀",
      unlockedThemes: JSON.stringify(state.unlockedThemes || ["light"]),
      activeTheme: state.activeTheme || "light",
    }
  });

  // Sync Habits
  for (let index = 0; index < state.habits.length; index++) {
    const h = state.habits[index];
    
    // Check if habit exists globally (to avoid random ID clash globally if it happens, but we'll try/catch)
    try {
      await prisma.habit.upsert({
        where: { id: h.id },
        update: {
          name: h.name,
          icon: h.icon,
          difficulty: h.difficulty,
          orderIndex: index,
        },
        create: {
          id: h.id,
          userId,
          name: h.name,
          icon: h.icon,
          difficulty: h.difficulty,
          createdAt: h.createdAt || new Date().toISOString().split('T')[0],
          orderIndex: index,
        }
      });
    } catch(e) {
      console.error("Habit sync error", e);
    }
  }
  
  // Find deleted habits
  const currentHabitIds = state.habits.map((h: any) => h.id);
  if (currentHabitIds.length > 0) {
    await prisma.habit.deleteMany({
      where: { userId, id: { notIn: currentHabitIds } }
    });
  } else {
    await prisma.habit.deleteMany({ where: { userId } });
  }

  // Sync Records
  await prisma.record.deleteMany({ where: { userId } });
  
  const recordsToInsert = [];
  for (const dateStr of Object.keys(state.records)) {
    for (const habitId of state.records[dateStr]) {
      if (currentHabitIds.includes(habitId)) {
        recordsToInsert.push({
          userId,
          habitId,
          date: dateStr
        });
      }
    }
  }
  
  if (recordsToInsert.length > 0) {
    await prisma.record.createMany({
      data: recordsToInsert
    });
  }

  // Sync Quests
  if (state.quests) {
    for (const q of state.quests) {
      try {
        await prisma.quest.upsert({
          where: { id: q.id },
          update: {
            title: q.title,
            xpReward: q.xpReward,
            isComplete: q.isComplete,
          },
          create: {
            id: q.id,
            userId,
            title: q.title,
            xpReward: q.xpReward,
            isComplete: q.isComplete,
          }
        });
      } catch(e) { }
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized", settings: null, habits: [], records: {} }, { status: 401 });
  
  const userId = session.user.id;

  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const habits = await prisma.habit.findMany({ where: { userId }, orderBy: { orderIndex: 'asc' } });
  const records = await prisma.record.findMany({ where: { userId } });
  const quests = await prisma.quest.findMany({ where: { userId } });

  const formattedRecords: Record<string, string[]> = {};
  for (const r of records) {
    if (!formattedRecords[r.date]) formattedRecords[r.date] = [];
    formattedRecords[r.date].push(r.habitId);
  }

  return NextResponse.json({
    settings: {
       spentXp: settings?.spentXp || 0,
       unlockedAvatars: settings?.unlockedAvatars ? JSON.parse(settings.unlockedAvatars) : ["👨‍🚀"],
       activeAvatar: settings?.activeAvatar || "👨‍🚀",
       unlockedThemes: settings?.unlockedThemes ? JSON.parse(settings.unlockedThemes) : ["light"],
       activeTheme: settings?.activeTheme || "light",
    },
    habits: habits.map(h => ({
      id: h.id,
      name: h.name,
      icon: h.icon,
      difficulty: h.difficulty,
      createdAt: h.createdAt
    })),
    records: formattedRecords,
    quests: quests.map(q => ({
      id: q.id,
      title: q.title,
      xpReward: q.xpReward,
      isComplete: q.isComplete
    }))
  });
}
