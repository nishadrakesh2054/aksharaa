const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
  validate,
];

module.exports = { validateCreateCategory };
