import { generateAIResponse } from "./ai.service.js";

import { SKILL_GAP_SYSTEM_PROMPT } from "./prompt.service.js";

import ApiError from "../../utils/ApiError.js";

const analyzeSkillGap = async ({ resumeText, job }) => {
  if (!resumeText?.trim()) {
    throw new ApiError(400, "Resume text is required for skill gap analysis");
  }

  if (!job) {
    throw new ApiError(
      400,
      "Job information is required for skill gap analysis",
    );
  }

  const userPrompt = `
Analyze the candidate's skill gap for the following target job.

--- CANDIDATE RESUME START ---

${resumeText}

--- CANDIDATE RESUME END ---

--- TARGET JOB START ---

Title: ${job.title}

Description:
${job.description}

Required Skills:
${(job.skills || []).join(", ")}

Minimum Experience:
${job.experienceMin ?? 0} years

Maximum Experience:
${job.experienceMax ?? 0} years

--- TARGET JOB END ---
`;

  const rawResponse = await generateAIResponse({
    systemPrompt: SKILL_GAP_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.1,
  });

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch {
    throw new ApiError(502, "AI returned an invalid skill gap format");
  }

  if (
    !Array.isArray(parsedResponse.currentSkills) ||
    !Array.isArray(parsedResponse.requiredSkills) ||
    !Array.isArray(parsedResponse.skillGaps) ||
    !Array.isArray(parsedResponse.learningPlan)
  ) {
    throw new ApiError(502, "AI returned an invalid skill gap response");
  }

  return parsedResponse;
};

export { analyzeSkillGap };