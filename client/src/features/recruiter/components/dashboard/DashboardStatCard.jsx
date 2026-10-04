const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`recruiter-stat-card ${className}`}>
      <div className="recruiter-stat-card-top">
        <div className="recruiter-stat-icon">{icon}</div>
      </div>

      <div className="recruiter-stat-content">
        <span>{title}</span>
        <strong>{value}</strong>

        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
};

export default DashboardStatCard;
