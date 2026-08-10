const mongoose = require("mongoose");

const coreValuesFrameworkSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      required: [true, "Badge is required"],
      trim: true,
      maxlength: [120, "Badge cannot exceed 120 characters"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    highlight: {
      type: String,
      required: [true, "Highlight is required"],
      trim: true,
      maxlength: [120, "Highlight cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1500, "Description cannot exceed 1500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    imageAlt: {
      type: String,
      trim: true,
      maxlength: [180, "Image alt text cannot exceed 180 characters"],
      default: "Aksharaa Core Values Infographic",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

coreValuesFrameworkSchema.index({ isActive: 1, createdAt: 1 });
coreValuesFrameworkSchema.index({ badge: "text", title: "text", highlight: "text", description: "text" });

module.exports = mongoose.model("CoreValuesFramework", coreValuesFrameworkSchema);
