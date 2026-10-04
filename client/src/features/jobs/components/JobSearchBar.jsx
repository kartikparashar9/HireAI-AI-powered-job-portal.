import { useEffect, useState } from "react";

const JobSearchBar = ({
  initialKeyword = "",
  initialLocation = "",
  onSearch,
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch({
      keyword: keyword.trim(),
      location: location.trim(),
    });
  };

  return (
    <form className="jobs-search-bar" onSubmit={handleSubmit}>
      <div className="jobs-search-field">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Job title, skills, or company"
        />
      </div>

      <div className="jobs-search-divider" />

      <div className="jobs-search-field">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>

        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
        />
      </div>

      <button type="submit" className="jobs-search-button">
        Search Jobs
      </button>
    </form>
  );
};

export default JobSearchBar;