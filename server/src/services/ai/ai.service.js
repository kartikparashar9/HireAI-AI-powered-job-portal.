import ApiError from "../../utils/ApiError.js";

import { gemini, AI_MODEL } from "../../config/ai.js";

const generateAIResponse = async ({ systemPrompt, userPrompt }) => {
  if (!gemini) {
    throw new ApiError(503, "AI service is not configured");
  }

  try {
    const prompt = `
SYSTEM INSTRUCTIONS:

${systemPrompt}

USER REQUEST:

${userPrompt}
`;

    const response = await gemini.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
    });

    const content = response.text;

    if (!content?.trim()) {
      throw new ApiError(502, "AI service returned an empty response");
    }

    return content.trim();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Gemini AI service error:", error);

    throw new ApiError(502, "Failed to generate AI response");
  }
};

export { generateAIResponse };