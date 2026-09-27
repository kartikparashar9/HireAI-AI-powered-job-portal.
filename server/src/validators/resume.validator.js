import { body } from "express-validator";

const createResumeValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Resume title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Resume title must be between 2 and 150 characters"),
];

export { createResumeValidator };
