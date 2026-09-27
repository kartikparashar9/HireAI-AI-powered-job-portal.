import { generateAIResponse } from "./ai.service.js";

import { JOB_RECOMMENDATION_SYSTEM_PROMPT } from "./prompt.service.js";

import ApiError from "../../utils/ApiError.js";

const getJobRecommendations = async ({
  candidateProfile = {},
  resumeText = "",
  jobs = [],
}) => {
  const hasProfile =
    candidateProfile && Object.keys(candidateProfile).length > 0;

  if (!resumeText?.trim() && !hasProfile) {
    throw new ApiError(
      400,
      "Candidate information is required for job recommendations",
    );
  }

  if (!jobs.length) {
    return {
      recommendations: [],
    };
  }

  const formattedJobs = jobs.map((job) => ({
    jobId: job._id?.toString(),
    title: job.title,
    description: job.description,
    skills: job.skills || [],
    location: job.location || "",
    jobType: job.jobType || "",
    workMode: job.workMode || "",
    experienceMin: job.experienceMin ?? 0,
    experienceMax: job.experienceMax ?? 0,
  }));

  const userPrompt = `
Recommend the most relevant jobs for the candidate.

--- CANDIDATE PROFILE START ---

${JSON.stringify(candidateProfile, null, 2)}

--- CANDIDATE PROFILE END ---

--- CANDIDATE RESUME START ---

${resumeText || "Resume not provided"}

--- CANDIDATE RESUME END ---

--- AVAILABLE JOBS START ---

${JSON.stringify(formattedJobs, null, 2)}

--- AVAILABLE JOBS END ---

Only recommend jobs from the provided list.
Do not create or modify job IDs.
`;

  const rawResponse = await generateAIResponse({
    systemPrompt: JOB_RECOMMENDATION_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.2,
  });

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);
  } catch {
    throw new ApiError(502, "AI returned an invalid job recommendation format");
  }

  if (!Array.isArray(parsedResponse.recommendations)) {
    throw new ApiError(502, "AI returned an invalid recommendation list");
  }

  const validJobIds = new Set(formattedJobs.map((job) => job.jobId));

  parsedResponse.recommendations = parsedResponse.recommendations.filter(
    (recommendation) => validJobIds.has(recommendation.jobId),
  );

  return parsedResponse;
};

export { getJobRecommendations };
