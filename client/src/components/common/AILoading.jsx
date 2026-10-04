const AILoading = ({ message = "AI is analyzing your information..." }) => {
  return (
    <div className="ai-answer-loading">
      <div className="ai-loading-spinner" />

      <div>
        <h3>AI is working</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AILoading;
