import { generateAIResponse } from "./ai.service.js";

import { JOB_MATCHING_SYSTEM_PROMPT } from "./prompt.service.js";

import ApiError from "../../utils/ApiError.js";

const matchResumeWithJob = async ({ resumeText, job }) => {
  if (!resumeText?.trim()) {
    throw new ApiError(400, "Resume text is required for job matching");
  }

  if (!job) {
    throw new ApiError(400, "Job information is required for job matching");
  }

  const userPrompt = `
Compare the candidate resume with the job information below.

--- CANDIDATE RESUME START ---

${resumeText}

--- CANDIDATE RESUME END ---

--- JOB START ---

Job ID: ${job._id}
Title: ${job.title}
Description: ${job.description}
Skills: ${(job.skills || []).join(", ")}
Location: ${job.location || "Not specified"}
Job Type: ${job.jobType || "Not specified"}
Work Mode: ${job.workMode || "Not specified"}
Minimum Experience: ${job.experienceMin ?? 0} years
Maximum Experience: ${job.experienceMax ?? 0} years

--- JOB END ---
`;

  const rawResponse = await generateAIResponse({
    systemPrompt: JOB_MATCHING_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.1,
  });

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch {
    throw new ApiError(502, "AI returned an invalid job matching format");
  }

  if (
    typeof parsedResponse.matchScore !== "number" ||
    parsedResponse.matchScore < 0 ||
    parsedResponse.matchScore > 100
  ) {
    throw new ApiError(502, "AI returned an invalid job match score");
  }

  return parsedResponse;
};

export { matchResumeWithJob };