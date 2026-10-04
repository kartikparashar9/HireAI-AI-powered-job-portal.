const unwrapAIResult = (value) => {
  if (!value) return null;

  let result = value;

  // { data: ... }
  if (result?.data !== undefined) {
    result = result.data;
  }

  // { result: ... }
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    result.result !== undefined
  ) {
    result = result.result;
  }

  // Nested data again
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    result.data !== undefined
  ) {
    result = result.data;
  }

  return result;
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;

  if (value === null || value === undefined) {
    return [];
  }

  return [value];
};

const safeText = (value, fallback = "Not available") => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
};

const getMatchScore = (result) => {
  const score = Number(
    result?.matchScore ?? result?.score ?? result?.overallScore ?? 0,
  );

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, score));
};

const getScoreLabel = (score) => {
  if (score >= 85) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 50) return "Moderate Match";

  return "Needs Improvement";
};

const getAnalysisStats = (result) => {
  const experience = toArray(result?.experience);
  const education = toArray(result?.education);
  const skills = toArray(result?.skills);
  const strengths = toArray(result?.strengths);
  const missingInformation = toArray(result?.missingInformation);
  const suggestions = toArray(result?.suggestions);

  return {
    skills: skills.length,
    strengths: strengths.length,
    experience: experience.length,
    education: education.length,
    missingInformation: missingInformation.length,
    suggestions: suggestions.length,
  };
};

export {
  unwrapAIResult,
  toArray,
  safeText,
  getMatchScore,
  getScoreLabel,
  getAnalysisStats,
};
