const mongoose = require("mongoose");

const FAQ_CATEGORIES = ["general", "admission", "academics", "facilities"];

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "FAQ question is required"],
      trim: true,
      maxlength: [220, "FAQ question cannot exceed 220 characters"],
    },
    answer: {
      type: String,
      required: [true, "FAQ answer is required"],
      trim: true,
      maxlength: [3000, "FAQ answer cannot exceed 3000 characters"],
    },
    category: {
      type: String,
      enum: FAQ_CATEGORIES,
      default: "general",
      lowercase: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

faqSchema.index({ category: 1, order: 1, createdAt: -1 });
faqSchema.index({ question: "text", answer: "text", category: "text" });

const faqModel = mongoose.model("Faq", faqSchema);

module.exports = {
  FAQ_CATEGORIES,
  faqModel,
};
