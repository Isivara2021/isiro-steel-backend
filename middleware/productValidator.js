const { body } = require("express-validator");

const ALLOWED_CATEGORIES = [
  "Furniture",
  "Decorative Items",
  "Outdoor Pieces",
  "Kitchenware",
  "Hand Railings",
  "Other"
];

const productValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 30 }).withMessage("Name max length is 100 chars"),
  body("shortDescription")
    .optional()
    .isLength({ max: 100 }).withMessage("Short description max 200 chars"),
  body("description")
    .optional()
    .isLength({ max: 2000 }).withMessage("Description max 2000 chars"),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0, max: 10000000 }).withMessage("Price must be between 0 and 10,000,000"),
  body("category")
    .optional()
    .isIn(ALLOWED_CATEGORIES).withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`)
];

module.exports = { productValidationRules };
