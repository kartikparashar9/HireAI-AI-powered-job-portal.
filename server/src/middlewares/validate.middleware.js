import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        400,
        "Validation failed",
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      ),
    );
  }

  next();
};

export default validateRequest;
