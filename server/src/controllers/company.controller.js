import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createCompany,
  getMyCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../services/company/company.service.js";

const createCompanyController = asyncHandler(async (req, res) => {
  const company = await createCompany(req.user.userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, company, "Company created successfully"));
});

const getMyCompanyController = asyncHandler(async (req, res) => {
  const company = await getMyCompany(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company fetched successfully"));
});

const getCompanyByIdController = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company fetched successfully"));
});

const updateCompanyController = asyncHandler(async (req, res) => {
  const company = await updateCompany(req.user.userId, req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company updated successfully"));
});

const deleteCompanyController = asyncHandler(async (req, res) => {
  await deleteCompany(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Company deleted successfully"));
});

export {
  createCompanyController,
  getMyCompanyController,
  getCompanyByIdController,
  updateCompanyController,
  deleteCompanyController,
};
