import { body, param } from "express-validator";

const adminUserIdValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

const updateUserStatusValidator = [
  ...adminUserIdValidator,

  body("isActive")
    .exists()
    .withMessage("isActive is required")
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export { adminUserIdValidator, updateUserStatusValidator };
