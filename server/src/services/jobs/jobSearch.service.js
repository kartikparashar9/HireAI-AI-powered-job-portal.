import Job from "../../models/Job.js";
import ApiError from "../../utils/ApiError.js";
import { JOB_STATUSES } from "../../constants/jobStatus.js";

const searchJobs = async ({
  keyword,
  location,
  jobType,
  workMode,
  skills,
  experienceMin,
  experienceMax,
  salaryMin,
  salaryMax,
  sort = "latest",
  page = 1,
  limit = 10,
}) => {
  const filters = {
    status: JOB_STATUSES.OPEN,
  };

  // Keyword search
  if (keyword?.trim()) {
    filters.$text = {
      $search: keyword.trim(),
    };
  }

  // Location filter
  if (location?.trim()) {
    filters.location = {
      $regex: location.trim(),
      $options: "i",
    };
  }

  // Job type
  if (jobType) {
    filters.jobType = jobType;
  }

  // Work mode
  if (workMode) {
    filters.workMode = workMode;
  }

  // Skills
  if (skills) {
    const skillList = Array.isArray(skills) ? skills : skills.split(",");

    const normalizedSkills = skillList
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (normalizedSkills.length > 0) {
      filters.skills = {
        $in: normalizedSkills,
      };
    }
  }

  // Experience overlap
  if (experienceMin !== undefined) {
    filters.experienceMax = {
      $gte: Number(experienceMin),
    };
  }

  if (experienceMax !== undefined) {
    filters.experienceMin = {
      $lte: Number(experienceMax),
    };
  }

  // Salary overlap
  if (salaryMin !== undefined) {
    filters.salaryMax = {
      $gte: Number(salaryMin),
    };
  }

  if (salaryMax !== undefined) {
    filters.salaryMin = {
      $lte: Number(salaryMax),
    };
  }

  const skip = (page - 1) * limit;

  let sortQuery = { createdAt: -1 };

  if (sort === "oldest") {
    sortQuery = { createdAt: 1 };
  }

  if (sort === "salary-high") {
    sortQuery = { salaryMax: -1, createdAt: -1 };
  }

  if (sort === "salary-low") {
    sortQuery = { salaryMin: 1, createdAt: -1 };
  }

  if (sort === "deadline") {
    sortQuery = {
      applicationDeadline: 1,
      createdAt: -1,
    };
  }

  const [jobs, totalJobs] = await Promise.all([
    Job.find(filters)
      .populate("company", "name logo website industry companySize location")
      .select("-recruiter")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean(),

    Job.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalJobs / limit);

  return {
    jobs,
    pagination: {
      page,
      limit,
      totalJobs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const getFeaturedJobs = async (limit = 6) => {
  return Job.find({
    status: JOB_STATUSES.OPEN,
  })
    .populate("company", "name logo website industry location")
    .select("-recruiter")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export { searchJobs, getFeaturedJobs };