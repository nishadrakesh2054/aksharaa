const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const validate = require("../middleware/validateMiddleware");

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "editor", "frontdesk"])
    .withMessage("Role must be admin, editor, or frontdesk"),
  validate,
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  validate,
];

const validateForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .normalizeEmail(),
  validate,
];

const validateResetPassword = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user ID format"),
  param("resetToken").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgetPassword,
  validateResetPassword,
};
