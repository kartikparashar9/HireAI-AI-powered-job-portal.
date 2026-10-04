const JobSort = ({ value, onChange }) => {
  return (
    <div className="jobs-sort">
      <span>Sort by</span>

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="salary-high">Highest Salary</option>
        <option value="salary-low">Lowest Salary</option>
        <option value="deadline">Closing Soon</option>
      </select>
    </div>
  );
};

export default JobSort;
