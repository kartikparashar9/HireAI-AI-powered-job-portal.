import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  applyToJob,
  clearApplyError,
  selectApplicationApplying,
  selectApplicationApplyError,
  selectApplicationSuccess,
} from "../applicationSlice";

import { fetchResumes, selectResumes } from "../../resume/resumeSlice";

import "./ApplyJob.css";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resumes = useSelector(selectResumes);
  const isApplying = useSelector(selectApplicationApplying);
  const applyError = useSelector(selectApplicationApplyError);
  const successMessage = useSelector(selectApplicationSuccess);

  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  useEffect(() => {
    if (!applyError) return;

    return () => {
      dispatch(clearApplyError());
    };
  }, [applyError, dispatch]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      navigate("/applications");
    }, 1200);

    return () => clearTimeout(timer);
  }, [successMessage, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!id || isApplying) return;

    dispatch(
      applyToJob({
        jobId: id,
        applicationData: {
          ...(resume ? { resume } : {}),
          ...(coverLetter.trim() ? { coverLetter: coverLetter.trim() } : {}),
        },
      }),
    );
  };

  return (
    <div className="apply-job-page">
      <div className="apply-job-container">
        <button
          type="button"
          className="apply-job-back"
          onClick={() => navigate(`/jobs/${id}`)}
        >
          <span>←</span>
          Back to Job
        </button>

        <div className="apply-job-layout">
          <main className="apply-job-card">
            <div className="apply-job-heading">
              <span className="apply-job-eyebrow">Job Application</span>

              <h1>Apply for this position</h1>

              <p>
                Submit your application with your preferred resume and a short
                cover letter.
              </p>
            </div>

            {applyError && (
              <div className="apply-job-alert apply-job-alert-error">
                <span>!</span>
                <p>{applyError}</p>
              </div>
            )}

            {successMessage && (
              <div className="apply-job-alert apply-job-alert-success">
                <span>✓</span>
                <p>{successMessage}</p>
              </div>
            )}

            <form className="apply-job-form" onSubmit={handleSubmit}>
              <div className="apply-job-field">
                <div className="apply-job-label-row">
                  <label htmlFor="resume">Select Resume</label>

                  <span>Optional</span>
                </div>

                <select
                  id="resume"
                  value={resume}
                  onChange={(event) => setResume(event.target.value)}
                  disabled={isApplying}
                >
                  <option value="">Apply without a resume</option>

                  {resumes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title || item.fileName}
                      {item.isPrimary ? " • Primary" : ""}
                    </option>
                  ))}
                </select>

                {resumes.length === 0 && (
                  <div className="apply-job-helper">
                    <span>ⓘ</span>
                    <p>
                      You haven't uploaded a resume yet. You can still submit
                      your application.
                    </p>
                  </div>
                )}
              </div>

              <div className="apply-job-field">
                <div className="apply-job-label-row">
                  <label htmlFor="coverLetter">Cover Letter</label>

                  <span>Optional</span>
                </div>

                <textarea
                  id="coverLetter"
                  rows={9}
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder="Introduce yourself and explain why you're interested in this role..."
                  maxLength={5000}
                  disabled={isApplying}
                />

                <div className="apply-job-character-count">
                  {coverLetter.length}/5000
                </div>
              </div>

              <div className="apply-job-actions">
                <button
                  type="button"
                  className="apply-job-cancel"
                  onClick={() => navigate(`/jobs/${id}`)}
                  disabled={isApplying}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="apply-job-submit"
                  disabled={isApplying}
                >
                  {isApplying ? (
                    <>
                      <span className="apply-job-spinner" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </main>

          <aside className="apply-job-info">
            <div className="apply-job-info-card">
              <div className="apply-job-info-icon">✓</div>

              <h2>Before you submit</h2>

              <ul>
                <li>Make sure your resume is up to date.</li>
                <li>Keep your cover letter relevant.</li>
                <li>Review your information carefully.</li>
                <li>You can track your application later.</li>
              </ul>
            </div>

            <div className="apply-job-info-card apply-job-info-blue">
              <strong>Application tracking</strong>

              <p>
                After submitting, you can monitor your application status from
                My Applications.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
