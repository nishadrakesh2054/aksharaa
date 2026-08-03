const { body } = require("express-validator");
const mongoose = require("mongoose");
const validate = require("../middleware/validateMiddleware");

const validateCreateActivity = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Activity title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Activity description is required"),
  body("category")
    .optional({ checkFalsy: true })
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid category ID format"),
  validate,
];

const validateUpdateActivity = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Activity title cannot be empty")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Activity description cannot be empty"),
  body("category")
    .optional({ checkFalsy: true })
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid category ID format"),
  validate,
];

module.exports = {
  validateCreateActivity,
  validateUpdateActivity,
};
