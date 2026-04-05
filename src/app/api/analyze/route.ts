import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "API key is missing. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const { habits, level, currentStreak, activeAvatar } = data;

    // We build a context prompt based on the user's current gamified state
    const prompt = `
You are an encouraging, gamified AI coach for a habit tracker app.

Here is the user's current status:
- Level: ${level}
- Current Streak: ${currentStreak} days
- Active Avatar: ${activeAvatar}
- Habits:
${habits.map((h: any) => `  - ${h.icon} ${h.name} (Difficulty: ${h.difficulty})`).join("\n")}

Please provide a brief, personalized analysis (around 3 to 4 sentences).
Highlight their consistency, acknowledge any cool habits they have, and give them a motivating boost to keep grinding for XP and leveling up. Be concise, punchy, and use a friendly, encouraging tone. Avoid markdown formatting like asterisks or bold text, just plain text is fine.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insights: text });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Please try again." },
      { status: 500 }
    );
  }
}
