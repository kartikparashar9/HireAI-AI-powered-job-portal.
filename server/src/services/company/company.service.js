import Company from "../../models/Company.js";
import ApiError from "../../utils/ApiError.js";

const createCompany = async (userId, companyData) => {
  const existingCompany = await Company.findOne({
    recruiter: userId,
  });

  if (existingCompany) {
    throw new ApiError(409, "You already have a company profile");
  }

  const company = await Company.create({
    ...companyData,
    recruiter: userId,
  });

  return company;
};

const getMyCompany = async (userId) => {
  const company = await Company.findOne({
    recruiter: userId,
  });

  if (!company) {
    throw new ApiError(404, "Company profile not found");
  }

  return company;
};

const getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId).populate(
    "recruiter",
    "name email",
  );

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return company;
};

const updateCompany = async (userId, companyId, companyData) => {
  const company = await Company.findOne({
    _id: companyId,
    recruiter: userId,
  });

  if (!company) {
    throw new ApiError(
      404,
      "Company not found or you are not authorized to update it",
    );
  }

  Object.assign(company, companyData);

  await company.save();

  return company;
};

const deleteCompany = async (userId, companyId) => {
  const company = await Company.findOne({
    _id: companyId,
    recruiter: userId,
  });

  if (!company) {
    throw new ApiError(
      404,
      "Company not found or you are not authorized to delete it",
    );
  }

  await company.deleteOne();

  return company;
};

export {
  createCompany,
  getMyCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
