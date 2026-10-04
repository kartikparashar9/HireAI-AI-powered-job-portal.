const AIResultCard = ({
  title,
  subtitle,
  icon,
  count,
  children,
  className = "",
}) => {
  return (
    <section className={`ai-result-card ${className}`}>
      <div className="ai-result-card__header">
        <div className="ai-result-card__title-wrapper">
          {icon && <div className="ai-result-card__icon">{icon}</div>}

          <div>
            <h2>{title}</h2>

            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        {count !== undefined && (
          <span className="ai-result-card__count">{count}</span>
        )}
      </div>

      <div className="ai-result-card__body">{children}</div>
    </section>
  );
};

export default AIResultCard;
