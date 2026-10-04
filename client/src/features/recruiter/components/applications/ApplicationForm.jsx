import { useEffect, useState } from "react";

const statusOptions = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "REVIEWING",
    label: "Reviewing",
  },
  {
    value: "SHORTLISTED",
    label: "Shortlisted",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
];

const ApplicationStatusForm = ({
  application,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [status, setStatus] = useState(application?.status || "PENDING");

  const [recruiterNote, setRecruiterNote] = useState(
    application?.recruiterNote || "",
  );

  useEffect(() => {
    setStatus(application?.status || "PENDING");

    setRecruiterNote(application?.recruiterNote || "");
  }, [application]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      status,
      recruiterNote: recruiterNote.trim(),
    });
  };

  return (
    <form className="recruiter-status-form" onSubmit={handleSubmit}>
      <div className="recruiter-form-group">
        <label htmlFor="application-status">Application Status</label>

        <select
          id="application-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="recruiter-form-group">
        <label htmlFor="recruiter-note">Recruiter Note</label>

        <textarea
          id="recruiter-note"
          value={recruiterNote}
          onChange={(event) => setRecruiterNote(event.target.value)}
          rows={5}
          placeholder="Add an internal note about this candidate..."
        />
      </div>

      <div className="recruiter-form-actions">
        <button
          type="submit"
          className="recruiter-save-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Application"}
        </button>

        <button
          type="button"
          className="recruiter-cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ApplicationStatusForm;
