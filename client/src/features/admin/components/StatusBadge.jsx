const StatusBadge = ({ status, active }) => {
  const value =
    active !== undefined
      ? active
        ? "ACTIVE"
        : "INACTIVE"
      : status;

  const formatted = String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const className = String(value || "")
    .toLowerCase()
    .replaceAll("_", "-");

  return (
    <span className={`admin-status-badge ${className}`}>
      {formatted || "—"}
    </span>
  );
};

export default StatusBadge;