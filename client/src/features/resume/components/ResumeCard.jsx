import { useDispatch, useSelector } from "react-redux";

import {
  deleteResume,
  makePrimaryResume,
  selectResumeDeleting,
  selectResumePrimaryUpdating,
} from "../resumeSlice";

const ResumeCard = ({ resume, onDelete }) => {
  const dispatch = useDispatch();

  const deleting = useSelector(selectResumeDeleting);
  const primaryUpdating = useSelector(selectResumePrimaryUpdating);

  const isDeleting = deleting?.[resume._id] || false;
  const isUpdatingPrimary = primaryUpdating?.[resume._id] || false;

  const isPdf = resume.fileType === "application/pdf";

  const handlePrimary = () => {
    if (!resume.isPrimary && !isUpdatingPrimary && !isDeleting) {
      dispatch(makePrimaryResume(resume._id));
    }
  };

  const handleDelete = () => {
    if (!isDeleting && !isUpdatingPrimary) {
      onDelete(resume);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";

    const mb = bytes / (1024 * 1024);

    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <article className="resume-card">
      <div className="resume-card-top">
        <div className={`resume-document-icon ${isPdf ? "pdf" : "docx"}`}>
          {isPdf ? "PDF" : "DOCX"}
        </div>

        {resume.isPrimary && (
          <span className="resume-primary-badge">Primary</span>
        )}
      </div>

      <div className="resume-card-body">
        <h3 title={resume.title}>{resume.title}</h3>

        <p className="resume-file-name">{resume.fileName}</p>

        <div className="resume-meta">
          <span>{formatFileSize(resume.fileSize)}</span>

          <span>•</span>

          <span>Uploaded {formatDate(resume.createdAt)}</span>
        </div>
      </div>

      <div className="resume-card-actions">
        <button
          type="button"
          className="resume-secondary-button"
          onClick={() =>
            window.open(resume.fileUrl, "_blank", "noopener,noreferrer")
          }
        >
          View
        </button>

        {!resume.isPrimary && (
          <button
            type="button"
            className="resume-primary-button"
            onClick={handlePrimary}
            disabled={isUpdatingPrimary || isDeleting}
          >
            {isUpdatingPrimary ? "Updating..." : "Make Primary"}
          </button>
        )}

        <button
          type="button"
          className="resume-delete-button"
          onClick={handleDelete}
          disabled={isDeleting || isUpdatingPrimary}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default ResumeCard;
