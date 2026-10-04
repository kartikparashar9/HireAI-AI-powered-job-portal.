const AIEmptyState = ({
  title = "No AI result found",
  message = "Run an AI analysis from the AI Career dashboard to see your result here.",
}) => {
  return (
    <div className="ai-empty-state">
      <div className="ai-empty-state__icon">✨</div>

      <h2>{title}</h2>

      <p>{message}</p>
    </div>
  );
};

export default AIEmptyState;
