import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import careerApi from "../api/careerApi";

import {
  analyzeResume,
  matchJob,
  fetchJobRecommendations,
  analyzeSkillGap,
  prepareInterview,
} from "../aiSlice";

import "../ai.css";

const FEATURES = [
  {
    id: "RESUME_ANALYSIS",
    title: "Resume Analysis",
    description:
      "Get detailed AI insights about your resume, skills, experience and improvements.",
    icon: "📄",
    requiresJob: false,
  },
  {
    id: "JOB_RECOMMENDATION",
    title: "Job Recommendations",
    description: "Discover jobs that match your resume and career profile.",
    icon: "🎯",
    requiresJob: false,
  },
  {
    id: "JOB_MATCHING",
    title: "Job Match",
    description: "Check how strongly your resume matches a specific job.",
    icon: "⚡",
    requiresJob: true,
  },
  {
    id: "SKILL_GAP",
    title: "Skill Gap",
    description:
      "Find missing skills and understand what you need to learn for a role.",
    icon: "📊",
    requiresJob: true,
  },
  {
    id: "INTERVIEW_PREPARATION",
    title: "Interview Preparation",
    description:
      "Generate personalized technical and behavioral interview preparation.",
    icon: "🎤",
    requiresJob: true,
  },
];

const JOB_BASED_FEATURES = [
  "JOB_MATCHING",
  "SKILL_GAP",
  "INTERVIEW_PREPARATION",
];

const unwrapResponse = (response) => {
  if (!response) {
    return null;
  }

  let result = response;

  if (result?.data !== undefined) {
    result = result.data;
  }

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

const extractResumes = (response) => {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.resumes)) {
    return data.resumes;
  }

  return [];
};

const extractJobs = (response) => {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.jobs)) {
    return data.jobs;
  }

  return [];
};

const getErrorMessage = (error, fallback) => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error) {
    return error.error;
  }

  if (error?.data?.message) {
    return error.data.message;
  }

  return fallback;
};

const AICareer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isResumeAnalyzing,
    isJobMatching,
    isRecommendationsLoading,
    isSkillGapAnalyzing,
    isInterviewPreparing,
    error,
    resumeAnalysisError,
    jobMatchingError,
    recommendationsError,
    skillGapError,
    interviewPreparationError,
  } = useSelector((state) => state.ai);

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const [selectedFeature, setSelectedFeature] = useState("RESUME_ANALYSIS");

  const [jobSearch, setJobSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  const [isSearchingJobs, setIsSearchingJobs] = useState(false);

  const [resumeError, setResumeError] = useState("");

  const [jobSearchError, setJobSearchError] = useState("");

  const [runError, setRunError] = useState("");

  const searchTimerRef = useRef(null);

  const selectedResume = useMemo(() => {
    return (
      resumes.find(
        (resume) => String(resume?._id) === String(selectedResumeId),
      ) || null
    );
  }, [resumes, selectedResumeId]);

  const selectedFeatureData = useMemo(() => {
    return (
      FEATURES.find((feature) => feature.id === selectedFeature) || FEATURES[0]
    );
  }, [selectedFeature]);

  const isJobBasedFeature = JOB_BASED_FEATURES.includes(selectedFeature);

  const isRunning =
    isResumeAnalyzing ||
    isJobMatching ||
    isRecommendationsLoading ||
    isSkillGapAnalyzing ||
    isInterviewPreparing;

  const activeReduxError =
    resumeAnalysisError ||
    jobMatchingError ||
    recommendationsError ||
    skillGapError ||
    interviewPreparationError ||
    error;

  /*
   * Load user's resumes
   */
  useEffect(() => {
    let isMounted = true;

    const loadResumes = async () => {
      try {
        setIsLoadingResumes(true);
        setResumeError("");

        const response = await careerApi.getMyResumes();

        const userResumes = extractResumes(response);

        if (!isMounted) {
          return;
        }

        setResumes(userResumes);

        if (userResumes.length > 0) {
          const primaryResume = userResumes.find(
            (resume) => resume?.isPrimary === true,
          );

          const resumeToSelect = primaryResume || userResumes[0];

          setSelectedResumeId(resumeToSelect?._id || "");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Load resumes error:", error);

        setResumeError(getErrorMessage(error, "Unable to load your resumes."));
      } finally {
        if (isMounted) {
          setIsLoadingResumes(false);
        }
      }
    };

    loadResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * Clear selected job when switching to
   * a feature that doesn't use jobs.
   */
  useEffect(() => {
    if (!isJobBasedFeature) {
      setSelectedJob(null);
      setJobSearch("");
      setJobs([]);
      setJobSearchError("");
    }
  }, [isJobBasedFeature]);

  /*
   * Job search with debounce.
   */
  useEffect(() => {
    if (!isJobBasedFeature) {
      return undefined;
    }

    const keyword = jobSearch.trim();

    if (!keyword) {
      setJobs([]);
      setJobSearchError("");
      setIsSearchingJobs(false);
      return undefined;
    }

    if (keyword.length < 2) {
      setJobs([]);
      setJobSearchError("");
      setIsSearchingJobs(false);
      return undefined;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        setIsSearchingJobs(true);
        setJobSearchError("");

        const response = await careerApi.searchJobs({
          keyword,
          page: 1,
          limit: 10,
        });

        const searchedJobs = extractJobs(response);

        setJobs(searchedJobs);
      } catch (error) {
        console.error("Job search error:", error);

        setJobs([]);

        setJobSearchError(getErrorMessage(error, "Unable to search jobs."));
      } finally {
        setIsSearchingJobs(false);
      }
    }, 350);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [jobSearch, isJobBasedFeature]);

  const handleFeatureChange = (featureId) => {
    if (isRunning) {
      return;
    }

    setSelectedFeature(featureId);
    setRunError("");

    const feature = FEATURES.find((item) => item.id === featureId);

    if (!feature?.requiresJob) {
      setSelectedJob(null);
      setJobSearch("");
      setJobs([]);
    }
  };

  const handleResumeChange = (event) => {
    setSelectedResumeId(event.target.value);

    setRunError("");
  };

  const handleJobSearchChange = (event) => {
    setJobSearch(event.target.value);
    setSelectedJob(null);
    setRunError("");
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setRunError("");
  };

  const handleRunAI = async () => {
    setRunError("");

    if (!selectedResumeId) {
      setRunError("Please select a resume before running AI.");
      return;
    }

    if (isJobBasedFeature && !selectedJob?._id) {
      setRunError("Please search and select a job first.");
      return;
    }

    try {
      let response;

      switch (selectedFeature) {
        case "RESUME_ANALYSIS": {
          response = await dispatch(analyzeResume(selectedResumeId)).unwrap();

          break;
        }

        case "JOB_RECOMMENDATION": {
          response = await dispatch(
            fetchJobRecommendations({
              resumeId: selectedResumeId,
              candidateProfile: {},
            }),
          ).unwrap();

          break;
        }

        case "JOB_MATCHING": {
          response = await dispatch(
            matchJob({
              resumeId: selectedResumeId,
              jobId: selectedJob._id,
            }),
          ).unwrap();

          break;
        }

        case "SKILL_GAP": {
          response = await dispatch(
            analyzeSkillGap({
              resumeId: selectedResumeId,
              jobId: selectedJob._id,
            }),
          ).unwrap();

          break;
        }

        case "INTERVIEW_PREPARATION": {
          response = await dispatch(
            prepareInterview({
              resumeId: selectedResumeId,
              jobId: selectedJob._id,
              candidateProfile: {},
            }),
          ).unwrap();

          break;
        }

        default:
          throw new Error("Invalid AI feature selected.");
      }

      /*
       * Navigate to dedicated AI Answer page.
       * Result is passed through router state.
       */
      navigate("/jobseeker/ai/answer", {
        state: {
          analysisType: selectedFeature,
          result: response,
          resumeId: selectedResumeId,
          resumeTitle:
            selectedResume?.title ||
            selectedResume?.fileName ||
            "Selected Resume",
          job: selectedJob,
        },
      });
    } catch (error) {
      console.error("AI execution error:", error);

      setRunError(
        getErrorMessage(
          error,
          "AI could not generate the answer. Please try again.",
        ),
      );
    }
  };

  return (
    <main className="ai-career-page">
      <div className="ai-career-container">
        {/* Header */}
        <section className="ai-career-header">
          <div>
            <span className="ai-career-eyebrow">AI CAREER</span>

            <h1>Build Your Career With AI</h1>

            <p>
              Analyze your resume, discover better opportunities and prepare
              smarter for your next career move.
            </p>
          </div>

          <div className="ai-career-header-icon">✨</div>
        </section>

        {/* Resume Selection */}
        <section className="ai-career-panel">
          <div className="ai-panel-heading">
            <div className="ai-panel-icon">📄</div>

            <div>
              <h2>Select Your Resume</h2>

              <p>Choose the resume you want AI to analyze.</p>
            </div>
          </div>

          {isLoadingResumes ? (
            <div className="ai-inline-loading">
              <span className="ai-mini-spinner" />
              Loading your resumes...
            </div>
          ) : resumeError ? (
            <div className="ai-inline-error">{resumeError}</div>
          ) : resumes.length === 0 ? (
            <div className="ai-no-resume">
              <div>📁</div>

              <div>
                <h3>No resume found</h3>

                <p>Upload a resume first to use AI Career features.</p>

                <button
                  type="button"
                  onClick={() => navigate("/jobseeker/resume")}
                >
                  Upload Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="ai-resume-selector">
              <select
                value={selectedResumeId}
                onChange={handleResumeChange}
                disabled={isRunning}
              >
                <option value="">Select a resume</option>

                {resumes.map((resume) => (
                  <option value={resume._id} key={resume._id}>
                    {resume.title || resume.fileName || "Untitled Resume"}
                    {resume.isPrimary ? " • Primary" : ""}
                  </option>
                ))}
              </select>

              {selectedResume && (
                <div className="ai-selected-resume">
                  <span className="ai-selected-resume-icon">✓</span>

                  <div>
                    <strong>
                      {selectedResume.title ||
                        selectedResume.fileName ||
                        "Selected Resume"}
                    </strong>

                    <span>
                      {selectedResume.isPrimary
                        ? "Primary resume"
                        : "Resume selected"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Feature Selection */}
        <section className="ai-feature-section">
          <div className="ai-section-heading">
            <div>
              <span className="ai-career-eyebrow">AI TOOLS</span>

              <h2>What do you want to know?</h2>

              <p>Choose an AI-powered career feature below.</p>
            </div>
          </div>

          <div className="ai-feature-grid">
            {FEATURES.map((feature) => {
              const isActive = selectedFeature === feature.id;

              return (
                <button
                  type="button"
                  key={feature.id}
                  className={`ai-feature-card ${
                    isActive ? "ai-feature-card--active" : ""
                  }`}
                  onClick={() => handleFeatureChange(feature.id)}
                  disabled={isRunning}
                >
                  <div className="ai-feature-card__top">
                    <div className="ai-feature-icon">{feature.icon}</div>

                    {isActive && <span className="ai-feature-check">✓</span>}
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  {feature.requiresJob && (
                    <span className="ai-feature-requires">
                      Requires job selection
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Job Search */}
        {isJobBasedFeature && (
          <section className="ai-career-panel ai-job-panel">
            <div className="ai-panel-heading">
              <div className="ai-panel-icon">🔎</div>

              <div>
                <h2>Find a Job</h2>

                <p>Search for the job you want AI to analyze.</p>
              </div>
            </div>

            <div className="ai-job-search">
              <div className="ai-search-wrapper">
                <span>⌕</span>

                <input
                  type="text"
                  value={jobSearch}
                  onChange={handleJobSearchChange}
                  placeholder="Try React developer, Node.js developer, MERN..."
                  disabled={isRunning}
                />

                {isSearchingJobs && <span className="ai-search-spinner" />}
              </div>

              {jobSearchError && (
                <div className="ai-inline-error">{jobSearchError}</div>
              )}

              {jobSearch.trim().length >= 2 &&
                !isSearchingJobs &&
                jobs.length === 0 &&
                !jobSearchError && (
                  <div className="ai-no-jobs">No matching open jobs found.</div>
                )}

              {jobs.length > 0 && (
                <div className="ai-job-results">
                  {jobs.map((job) => {
                    const isSelected =
                      String(selectedJob?._id) === String(job?._id);

                    return (
                      <button
                        type="button"
                        className={`ai-job-result ${
                          isSelected ? "ai-job-result--selected" : ""
                        }`}
                        key={job._id}
                        onClick={() => handleJobSelect(job)}
                      >
                        <div className="ai-job-result-main">
                          <div className="ai-job-result-icon">💼</div>

                          <div>
                            <h3>{job.title || "Untitled Job"}</h3>

                            <p>
                              {job.company?.name ||
                                job.companyName ||
                                "Company"}
                            </p>

                            <div className="ai-job-meta">
                              {job.location && <span>📍 {job.location}</span>}

                              {job.workMode && <span>• {job.workMode}</span>}

                              {job.jobType && <span>• {job.jobType}</span>}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="ai-job-selected">✓ Selected</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedJob && (
                <div className="ai-selected-job">
                  <div>
                    <span>SELECTED JOB</span>

                    <h3>{selectedJob.title || "Selected Job"}</h3>

                    <p>
                      {selectedJob.company?.name ||
                        selectedJob.companyName ||
                        "Company"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    disabled={isRunning}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Error */}
        {(runError || activeReduxError) && (
          <div className="ai-run-error">
            <span>!</span>

            <div>
              <strong>AI request failed</strong>

              <p>
                {runError ||
                  getErrorMessage(activeReduxError, "Something went wrong.")}
              </p>
            </div>
          </div>
        )}

        {/* Run */}
        <section className="ai-run-section">
          <div>
            <span className="ai-run-label">READY TO START?</span>

            <h2>{selectedFeatureData.title}</h2>

            <p>{selectedFeatureData.description}</p>
          </div>

          <button
            type="button"
            className="ai-run-button"
            onClick={handleRunAI}
            disabled={
              isRunning ||
              isLoadingResumes ||
              resumes.length === 0 ||
              !selectedResumeId ||
              (isJobBasedFeature && !selectedJob)
            }
          >
            {isRunning ? (
              <>
                <span className="ai-button-spinner" />
                AI is thinking...
              </>
            ) : (
              <>
                <span>✨</span>
                Run AI Analysis
              </>
            )}
          </button>
        </section>
      </div>
    </main>
  );
};

export default AICareer;
