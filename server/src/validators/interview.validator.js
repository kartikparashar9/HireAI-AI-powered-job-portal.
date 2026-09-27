import { body } from "express-validator";

const createInterviewValidator = [
  body("application")
    .notEmpty()
    .withMessage("Application is required")
    .isMongoId()
    .withMessage("Invalid application ID"),

  body("type")
    .notEmpty()
    .withMessage("Interview type is required")
    .isIn(["PHONE", "VIDEO", "IN_PERSON"])
    .withMessage("Invalid interview type"),

  body("scheduledAt")
    .notEmpty()
    .withMessage("Interview date and time are required")
    .isISO8601()
    .withMessage("Invalid interview date and time"),

  body("durationMinutes")
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage("Interview duration must be between 15 and 180 minutes"),

  body("meetingLink")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid meeting link"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Interview location cannot exceed 300 characters"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Interview notes cannot exceed 3000 characters"),
];

const updateInterviewValidator = [
  body("type")
    .optional()
    .isIn(["PHONE", "VIDEO", "IN_PERSON"])
    .withMessage("Invalid interview type"),

  body("scheduledAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid interview date and time"),

  body("durationMinutes")
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage("Interview duration must be between 15 and 180 minutes"),

  body("meetingLink")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid meeting link"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Interview location cannot exceed 300 characters"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Interview notes cannot exceed 3000 characters"),

  body("status")
    .optional()
    .isIn(["CONFIRMED", "RESCHEDULED", "COMPLETED", "CANCELLED", "DECLINED"])
    .withMessage("Invalid interview status"),
];

export { createInterviewValidator, updateInterviewValidator };