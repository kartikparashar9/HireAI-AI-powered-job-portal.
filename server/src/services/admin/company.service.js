import Company from "../../models/Company.js";
import ApiError from "../../utils/ApiError.js";

const getAllCompanies = async ({
  page = 1,
  limit = 20,
  search = "",
  industry = "",
}) => {
  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const filter = {};

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (industry?.trim()) {
    filter.industry = {
      $regex: industry.trim(),
      $options: "i",
    };
  }

  const [companies, total] = await Promise.all([
    Company.find(filter)
      .populate(
        "recruiter",
        "name email recruiterStatus isActive isEmailVerified",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Company.countDocuments(filter),
  ]);

  return {
    companies,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId)
    .populate(
      "recruiter",
      "name email role recruiterStatus isActive isEmailVerified",
    )
    .lean();

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return company;
};

const deleteCompany = async (companyId) => {
  const company = await Company.findById(companyId);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  await company.deleteOne();

  return true;
};

export { getAllCompanies, getCompanyById, deleteCompany };