import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ResumeUpload from "../../features/resume/components/ResumeUpload";
import ResumeCard from "../../features/resume/components/ResumeCard";
import DeleteResumeModal from "../../features/resume/components/DeleteResumeModal";

import {
  deleteResume,
  fetchResumes,
  selectResumeDeleting,
  selectResumeError,
  selectResumeLoading,
  selectResumeSuccess,
  selectResumes,
  clearResumeError,
  clearResumeSuccess,
} from "../../features/resume/resumeSlice";

import "./Resume.css";

const Resume = () => {
  const dispatch = useDispatch();

  const resumes = useSelector(selectResumes);
  const isLoading = useSelector(selectResumeLoading);
  const error = useSelector(selectResumeError);
  const successMessage = useSelector(selectResumeSuccess);
  const deleting = useSelector(selectResumeDeleting);

  const [resumeToDelete, setResumeToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearResumeSuccess());
    }, 3500);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    const resumeId = resumeToDelete._id;

    const result = await dispatch(deleteResume(resumeId));

    if (deleteResume.fulfilled.match(result)) {
      setResumeToDelete(null);
    }
  };

  const deletingCurrent = resumeToDelete && deleting?.[resumeToDelete._id];

  return (
    <div className="resume-page">
      <div className="resume-page-header">
        <div>
          <span className="resume-eyebrow">Career Documents</span>

          <h1>My Resumes</h1>

          <p>
            Manage your resumes and keep the version you want to use for your
            job applications.
          </p>
        </div>

        <div className="resume-header-count">
          <span>{resumes.length}</span>
          <small>{resumes.length === 1 ? "Resume" : "Resumes"}</small>
        </div>
      </div>

      {successMessage && (
        <div className="resume-success">
          <span>✓</span>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="resume-error-banner">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => {
              dispatch(clearResumeError());
              dispatch(fetchResumes());
            }}
          >
            Retry
          </button>
        </div>
      )}

      <ResumeUpload />

      <section className="resume-list-section">
        <div className="resume-section-heading">
          <div>
            <span className="resume-section-label">Your documents</span>

            <h2>Saved Resumes</h2>
          </div>

          {resumes.length > 0 && (
            <span className="resume-list-count">{resumes.length} saved</span>
          )}
        </div>

        {isLoading ? (
          <div className="resume-loading-grid">
            {[1, 2].map((item) => (
              <div className="resume-skeleton-card" key={item}>
                <div className="skeleton-icon" />
                <div className="skeleton-line large" />
                <div className="skeleton-line" />
                <div className="skeleton-line small" />
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="resume-empty-state">
            <div className="resume-empty-icon">📄</div>

            <h3>No resumes yet</h3>

            <p>
              Upload your first resume above. You can store multiple versions
              and choose one as your primary resume.
            </p>
          </div>
        ) : (
          <div className="resume-grid">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={setResumeToDelete}
              />
            ))}
          </div>
        )}
      </section>

      <div className="resume-ai-note">
        <div className="resume-ai-note-icon">AI</div>

        <div>
          <h3>AI Resume Analysis</h3>

          <p>
            Upload your resume first. AI-powered resume analysis and career
            insights will be available here as the AI module is completed.
          </p>
        </div>
      </div>

      <DeleteResumeModal
        resume={resumeToDelete}
        isDeleting={Boolean(deletingCurrent)}
        onCancel={() => setResumeToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Resume;
