import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  uploadResume,
  selectResumeUploading,
  selectResumeUploadError,
  clearUploadError,
} from "../resumeSlice";

const ResumeUpload = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const isUploading = useSelector(selectResumeUploading);
  const uploadError = useSelector(selectResumeUploadError);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setLocalError("");
    dispatch(clearUploadError());

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setLocalError("Only PDF and DOCX files are supported.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setLocalError("File size must be less than 5 MB.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLocalError("");
    dispatch(clearUploadError());

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 2) {
      setLocalError("Resume title must be at least 2 characters.");
      return;
    }

    if (trimmedTitle.length > 150) {
      setLocalError("Resume title cannot exceed 150 characters.");
      return;
    }

    if (!file) {
      setLocalError("Please select your resume.");
      return;
    }

    const result = await dispatch(
      uploadResume({
        title: trimmedTitle,
        file,
      }),
    );

    if (uploadResume.fulfilled.match(result)) {
      setTitle("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    }
  };

  return (
    <div className="resume-upload-card">
      <div className="resume-upload-icon">
        <span>↑</span>
      </div>

      <div className="resume-upload-content">
        <h2>Upload a new resume</h2>

        <p>
          Upload your latest resume to keep your profile ready for applications
          and AI career features.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="resume-form-group">
            <label htmlFor="resume-title">Resume title</label>

            <input
              id="resume-title"
              type="text"
              placeholder="e.g. Full Stack Developer Resume"
              value={title}
              maxLength={150}
              onChange={(event) => {
                setTitle(event.target.value);
                setLocalError("");
              }}
              disabled={isUploading}
            />
          </div>

          <div className="resume-form-group">
            <label htmlFor="resume-file">Resume file</label>

            <label
              htmlFor="resume-file"
              className={`resume-file-drop ${file ? "has-file" : ""}`}
            >
              <div className="resume-file-icon">{file ? "✓" : "PDF"}</div>

              <div>
                <strong>{file ? file.name : "Choose your resume"}</strong>

                <span>
                  {file
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : "PDF or DOCX • Maximum 5 MB"}
                </span>
              </div>

              <input
                ref={fileInputRef}
                id="resume-file"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>

          {(localError || uploadError) && (
            <div className="resume-form-error">{localError || uploadError}</div>
          )}

          <button
            type="submit"
            className="resume-upload-button"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="resume-spinner" />
                Uploading...
              </>
            ) : (
              "Upload Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;
