const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const validateEnquiry = [
  body("studentName")
    .trim()
    .notEmpty()
    .withMessage("Student name is required"),
  body("studentAge")
    .notEmpty()
    .withMessage("Student age is required"),
  body("studentGender")
    .trim()
    .notEmpty()
    .withMessage("Student gender is required"),
  body("studentGrade")
    .trim()
    .notEmpty()
    .withMessage("Student grade is required"),
  body("studentAddress")
    .trim()
    .notEmpty()
    .withMessage("Student address is required"),
  body("parentName")
    .trim()
    .notEmpty()
    .withMessage("Parent name is required"),
  body("parentEmail")
    .trim()
    .notEmpty()
    .withMessage("Parent email is required")
    .isEmail()
    .withMessage("Invalid parent email format")
    .normalizeEmail(),
  validate,
];

module.exports = { validateEnquiry };
