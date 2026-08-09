const { body, query } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const { FAQ_CATEGORIES } = require("../Models/FaqSchema");

const normalizedCategory = (value) => String(value || "").trim().toLowerCase();

const validateCreateFaq = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("FAQ question is required")
    .isLength({ min: 3, max: 220 })
    .withMessage("FAQ question must be between 3 and 220 characters"),
  body("answer")
    .trim()
    .notEmpty()
    .withMessage("FAQ answer is required")
    .isLength({ min: 3, max: 3000 })
    .withMessage("FAQ answer must be between 3 and 3000 characters"),
  body("category")
    .optional()
    .customSanitizer(normalizedCategory)
    .isIn(FAQ_CATEGORIES)
    .withMessage(`FAQ category must be one of: ${FAQ_CATEGORIES.join(", ")}`),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a positive number"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Active status must be true or false"),
  validate,
];

const validateUpdateFaq = [
  body("question")
    .optional()
    .trim()
    .isLength({ min: 3, max: 220 })
    .withMessage("FAQ question must be between 3 and 220 characters"),
  body("answer")
    .optional()
    .trim()
    .isLength({ min: 3, max: 3000 })
    .withMessage("FAQ answer must be between 3 and 3000 characters"),
  body("category")
    .optional()
    .customSanitizer(normalizedCategory)
    .isIn(FAQ_CATEGORIES)
    .withMessage(`FAQ category must be one of: ${FAQ_CATEGORIES.join(", ")}`),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a positive number"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Active status must be true or false"),
  validate,
];

const validateFaqQuery = [
  query("category")
    .optional()
    .customSanitizer(normalizedCategory)
    .isIn(FAQ_CATEGORIES)
    .withMessage(`FAQ category must be one of: ${FAQ_CATEGORIES.join(", ")}`),
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("Active status must be true or false"),
  validate,
];

module.exports = {
  validateCreateFaq,
  validateUpdateFaq,
  validateFaqQuery,
};
