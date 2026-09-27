import { GoogleGenAI } from "@google/genai";
import env from "./env.js";

const geminiApiKey = env.ai.apiKey;

if (!geminiApiKey) {
  console.warn(
    "GEMINI_API_KEY is not configured. AI features will be unavailable.",
  );
}

const gemini = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
    })
  : null;

const AI_MODEL = process.env.AI_MODEL || "gemini-2.5-flash-lite";

export { gemini, AI_MODEL };
