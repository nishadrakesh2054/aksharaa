const { body } = require("express-validator");
const mongoose = require("mongoose");
const validate = require("../middleware/validateMiddleware");

const validateCreateBlog = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Blog title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Blog description is required"),
  body("category")
    .optional({ checkFalsy: true })
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid category ID format"),
  validate,
];

const validateUpdateBlog = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Blog title cannot be empty")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Blog description cannot be empty"),
  body("category")
    .optional({ checkFalsy: true })
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid category ID format"),
  validate,
];

module.exports = {
  validateCreateBlog,
  validateUpdateBlog,
};
