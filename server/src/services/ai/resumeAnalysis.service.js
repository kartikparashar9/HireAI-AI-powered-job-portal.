import { generateAIResponse } from "./ai.service.js";
import { RESUME_ANALYSIS_SYSTEM_PROMPT } from "./prompt.service.js";
import ApiError from "../../utils/ApiError.js";

const analyzeResume = async (resumeText) => {
  if (!resumeText?.trim()) {
    throw new ApiError(400, "Resume text is required for analysis");
  }

  const userPrompt = `
Analyze the following resume:

--- RESUME START ---

${resumeText}

--- RESUME END ---
`;

  const rawResponse = await generateAIResponse({
    systemPrompt: RESUME_ANALYSIS_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.1,
  });

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch {
    throw new ApiError(502, "AI returned an invalid resume analysis format");
  }

  return parsedResponse;
};

export { analyzeResume };