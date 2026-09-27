import { generateAIResponse } from "./ai.service.js";

import { INTERVIEW_PREPARATION_SYSTEM_PROMPT } from "./prompt.service.js";

import ApiError from "../../utils/ApiError.js";

const generateInterviewPreparation = async ({
  resumeText = "",
  candidateProfile = {},
  job,
}) => {
  const hasProfile =
    candidateProfile && Object.keys(candidateProfile).length > 0;

  if (!resumeText?.trim() && !hasProfile) {
    throw new ApiError(
      400,
      "Candidate information is required for interview preparation",
    );
  }

  if (!job) {
    throw new ApiError(
      400,
      "Job information is required for interview preparation",
    );
  }

  const userPrompt = `
Generate interview preparation material for the candidate
based on the target job.

--- CANDIDATE PROFILE START ---

${JSON.stringify(candidateProfile, null, 2)}

--- CANDIDATE PROFILE END ---

--- CANDIDATE RESUME START ---

${resumeText || "Resume not provided"}

--- CANDIDATE RESUME END ---

--- TARGET JOB START ---

Title:
${job.title}

Description:
${job.description}

Required Skills:
${(job.skills || []).join(", ")}

Job Type:
${job.jobType || "Not specified"}

Work Mode:
${job.workMode || "Not specified"}

Minimum Experience:
${job.experienceMin ?? 0} years

Maximum Experience:
${job.experienceMax ?? 0} years

--- TARGET JOB END ---

Generate practical technical and behavioral interview preparation
specifically relevant to this target role.
`;

  const rawResponse = await generateAIResponse({
    systemPrompt: INTERVIEW_PREPARATION_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.2,
  });

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch {
    throw new ApiError(
      502,
      "AI returned an invalid interview preparation format",
    );
  }

  if (
    typeof parsedResponse.roleOverview !== "string" ||
    !Array.isArray(parsedResponse.technicalQuestions) ||
    !Array.isArray(parsedResponse.behavioralQuestions) ||
    !Array.isArray(parsedResponse.preparationTopics) ||
    !Array.isArray(parsedResponse.tips)
  ) {
    throw new ApiError(
      502,
      "AI returned an invalid interview preparation response",
    );
  }

  return parsedResponse;
};

export { generateInterviewPreparation };