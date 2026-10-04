const AdminStatCard = ({ label, value, description, icon }) => {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>

      <div className="admin-stat-content">
        <span>{label}</span>

        <strong>{value ?? 0}</strong>

        {description && <small>{description}</small>}
      </div>
    </div>
  );
};

export default AdminStatCard;
