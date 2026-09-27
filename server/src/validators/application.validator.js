import { body } from "express-validator";

const createApplicationValidator = [
  body("resume").optional().isMongoId().withMessage("Invalid resume ID"),

  body("coverLetter")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Cover letter cannot exceed 5000 characters"),
];

const updateApplicationStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Application status is required")
    .isIn(["SHORTLISTED", "REJECTED", "HIRED"])
    .withMessage("Invalid application status"),

  body("recruiterNote")
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Recruiter note cannot exceed 3000 characters"),
];

export { createApplicationValidator, updateApplicationStatusValidator };