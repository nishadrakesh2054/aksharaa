const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Enter your email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Enter your password"],
  },
  role: {
    type: String,
    enum: ["admin", "editor", "frontdesk"],
    default: "admin",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

usersSchema.index({ resetPasswordToken: 1, resetPasswordExpire: 1 });

const userSchema = mongoose.model("User", usersSchema);
module.exports = userSchema;
