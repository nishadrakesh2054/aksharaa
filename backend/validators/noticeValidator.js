const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateSubscribeNewsletter = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .normalizeEmail(),
  validate,
];

module.exports = { validateSubscribeNewsletter };
