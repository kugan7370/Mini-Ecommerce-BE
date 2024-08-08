import { body } from "express-validator";

const createProductValidationRules = [
  body("SKU")
    .exists()
    .withMessage("SKU is required")
    .isString()
    .withMessage("SKU must be a string"),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("productName")
    .exists()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
];

const updateProductValidationRules = [
  body("SKU").optional().isString().withMessage("SKU must be a string"),
  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("productName")
    .optional()
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
];

export { createProductValidationRules, updateProductValidationRules };
