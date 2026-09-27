import { body } from "express-validator";

const createJobValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Job title must be between 2 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20, max: 10000 })
    .withMessage("Job description must be between 20 and 10000 characters"),

  body("company")
    .notEmpty()
    .withMessage("Company is required")
    .isMongoId()
    .withMessage("Invalid company ID"),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Skill cannot exceed 50 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("jobType")
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"])
    .withMessage("Invalid job type"),

  body("workMode")
    .notEmpty()
    .withMessage("Work mode is required")
    .isIn(["ONSITE", "REMOTE", "HYBRID"])
    .withMessage("Invalid work mode"),

  body("experienceMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum experience cannot be negative"),

  body("experienceMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum experience cannot be negative"),

  body("salaryMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum salary cannot be negative"),

  body("salaryMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum salary cannot be negative"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid application deadline"),
];

const updateJobValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Job title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 10000 })
    .withMessage("Job description must be between 20 and 10000 characters"),

  body("company").optional().isMongoId().withMessage("Invalid company ID"),

  body("skills")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("skills.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Skill cannot exceed 50 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("jobType")
    .optional()
    .isIn(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"])
    .withMessage("Invalid job type"),

  body("workMode")
    .optional()
    .isIn(["ONSITE", "REMOTE", "HYBRID"])
    .withMessage("Invalid work mode"),

  body("experienceMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum experience cannot be negative"),

  body("experienceMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum experience cannot be negative"),

  body("salaryMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum salary cannot be negative"),

  body("salaryMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum salary cannot be negative"),

  body("status")
    .optional()
    .isIn(["DRAFT", "OPEN", "CLOSED"])
    .withMessage("Invalid job status"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid application deadline"),
];

export { createJobValidator, updateJobValidator };