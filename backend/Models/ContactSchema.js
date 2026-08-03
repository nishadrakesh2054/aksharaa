const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ isRead: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({
  name: "text",
  phone: "text",
  email: "text",
  subject: "text",
  message: "text",
});

const contactModel = mongoose.model("contact", ContactSchema);
module.exports = contactModel;
