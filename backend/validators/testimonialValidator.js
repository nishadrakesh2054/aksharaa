const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateCreateTestimonial = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Testimonial content is required"),
  validate,
];

module.exports = { validateCreateTestimonial };
