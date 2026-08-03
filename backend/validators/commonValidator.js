const { param } = require("express-validator");
const mongoose = require("mongoose");
const validate = require("../middleware/validateMiddleware");

const validateMongoId = (paramName = "id") => [
  param(paramName)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(`Invalid ID format for parameter '${paramName}'`),
  validate,
];

module.exports = { validateMongoId };
