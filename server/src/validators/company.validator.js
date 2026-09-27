import { body } from "express-validator";

const createCompanyValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Company name must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Company description cannot exceed 5000 characters"),

  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry cannot exceed 100 characters"),

  body("companySize")
    .optional()
    .trim()
    .isIn([
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "501-1000",
      "1001-5000",
      "5001-10000",
      "10000+",
    ])
    .withMessage("Invalid company size"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("logo")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),
];

const updateCompanyValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Company name must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Company description cannot exceed 5000 characters"),

  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry cannot exceed 100 characters"),

  body("companySize")
    .optional()
    .trim()
    .isIn([
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "501-1000",
      "1001-5000",
      "5001-10000",
      "10000+",
    ])
    .withMessage("Invalid company size"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("logo")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),
];

export { createCompanyValidator, updateCompanyValidator };
