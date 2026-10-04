const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onMouseDown={onCancel}>
      <div
        className="admin-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3>{title}</h3>

          <button
            type="button"
            className="admin-icon-button"
            onClick={onCancel}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <p className="admin-modal-message">{message}</p>

        <div className="admin-modal-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className={danger ? "admin-danger-button" : "admin-primary-button"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
