import { body } from "express-validator";

const createUserValidationRules = [
  body("username")
    .exists()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .notEmpty()
    .withMessage("Username cannot be empty"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

const updateUserValidationRules = [
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .notEmpty()
    .withMessage("Username cannot be empty"),
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
];

export { createUserValidationRules, updateUserValidationRules };
