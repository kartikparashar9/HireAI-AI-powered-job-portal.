const AIStatsCards = ({ stats }) => {
  const cards = [
    {
      key: "skills",
      icon: "⚙",
      label: "Skills Found",
      value: stats.skills,
    },
    {
      key: "strengths",
      icon: "★",
      label: "Strengths",
      value: stats.strengths,
    },
    {
      key: "experience",
      icon: "▣",
      label: "Work Experience",
      value: stats.experience,
    },
    {
      key: "education",
      icon: "🎓",
      label: "Education",
      value: stats.education,
    },
    {
      key: "missingInformation",
      icon: "!",
      label: "Missing Information",
      value: stats.missingInformation,
    },
  ];

  return (
    <div className="ai-stats-grid">
      {cards.map((card) => (
        <div
          className={`ai-stat-card ai-stat-card--${card.key}`}
          key={card.key}
        >
          <div className="ai-stat-card__icon">{card.icon}</div>

          <div>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIStatsCards;
