import { body } from "express-validator";

const socialLinksValidation = [
  body("socialLinks.linkedin")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("LinkedIn must be a valid URL"),

  body("socialLinks.github")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("GitHub must be a valid URL"),

  body("socialLinks.portfolio")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Portfolio must be a valid URL"),
];

const profileValidator = [
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number cannot exceed 20 characters"),

  body("headline")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 150 })
    .withMessage("Headline cannot exceed 150 characters"),

  body("about")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 3000 })
    .withMessage("About section cannot exceed 3000 characters"),

  body("location")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("skills").optional().isArray().withMessage("Skills must be an array"),

  body("skills.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each skill must be between 1 and 50 characters"),

  body("experience")
    .optional()
    .isArray()
    .withMessage("Experience must be an array"),

  body("experience.*.company")
    .if(body("experience").exists())
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 150 })
    .withMessage("Company name cannot exceed 150 characters"),

  body("experience.*.position")
    .if(body("experience").exists())
    .trim()
    .notEmpty()
    .withMessage("Position is required")
    .isLength({ max: 150 })
    .withMessage("Position cannot exceed 150 characters"),

  body("experience.*.location")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 150 })
    .withMessage("Experience location cannot exceed 150 characters"),

  body("experience.*.startDate")
    .if(body("experience").exists())
    .notEmpty()
    .withMessage("Experience start date is required")
    .isISO8601()
    .withMessage("Experience start date must be a valid date"),

  body("experience.*.endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Experience end date must be a valid date"),

  body("experience.*.isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean"),

  body("experience.*.description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Experience description cannot exceed 2000 characters"),

  body("education")
    .optional()
    .isArray()
    .withMessage("Education must be an array"),

  body("education.*.institution")
    .if(body("education").exists())
    .trim()
    .notEmpty()
    .withMessage("Institution is required")
    .isLength({ max: 200 })
    .withMessage("Institution cannot exceed 200 characters"),

  body("education.*.degree")
    .if(body("education").exists())
    .trim()
    .notEmpty()
    .withMessage("Degree is required")
    .isLength({ max: 150 })
    .withMessage("Degree cannot exceed 150 characters"),

  body("education.*.field")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 150 })
    .withMessage("Education field cannot exceed 150 characters"),

  body("education.*.startDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Education start date must be a valid date"),

  body("education.*.endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Education end date must be a valid date"),

  body("education.*.grade")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 50 })
    .withMessage("Grade cannot exceed 50 characters"),

  ...socialLinksValidation,
];

export { profileValidator };