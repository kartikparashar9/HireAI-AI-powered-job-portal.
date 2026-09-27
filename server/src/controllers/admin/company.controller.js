import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  getAllCompanies,
  getCompanyById,
  deleteCompany,
} from "../../services/admin/company.service.js";

const getAllCompaniesController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", industry = "" } = req.query;

  const result = await getAllCompanies({
    page,
    limit,
    search,
    industry,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Companies fetched successfully"));
});

const getCompanyByIdController = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company fetched successfully"));
});

const deleteCompanyController = asyncHandler(async (req, res) => {
  await deleteCompany(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Company deleted successfully"));
});

export {
  getAllCompaniesController,
  getCompanyByIdController,
  deleteCompanyController,
};