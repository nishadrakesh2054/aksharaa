const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateContact = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage("Phone number must be 30 characters or less"),
  body("subject")
    .optional()
    .trim(),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 5 })
    .withMessage("Message must be at least 5 characters long"),
  validate,
];

module.exports = { validateContact };
