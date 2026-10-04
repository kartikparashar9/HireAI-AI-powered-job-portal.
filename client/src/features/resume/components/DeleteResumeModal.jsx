const DeleteResumeModal = ({ resume, isDeleting, onCancel, onConfirm }) => {
  if (!resume) {
    return null;
  }

  return (
    <div className="resume-modal-backdrop" onMouseDown={onCancel}>
      <div
        className="resume-delete-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="resume-modal-icon">!</div>

        <h2>Delete this resume?</h2>

        <p>
          You are about to delete <strong>{resume.title}</strong>. This action
          cannot be undone.
        </p>

        <div className="resume-modal-actions">
          <button
            type="button"
            className="resume-cancel-button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="resume-confirm-delete"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Resume"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResumeModal;