const mongoose = require("mongoose");

const visionMissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1200, "Description cannot exceed 1200 characters"],
    },
    iconClass: {
      type: String,
      required: [true, "Icon class is required"],
      trim: true,
      maxlength: 120,
    },
    badgeClass: {
      type: String,
      required: [true, "Badge class is required"],
      trim: true,
      maxlength: 80,
    },
    cardClass: {
      type: String,
      required: [true, "Card class is required"],
      trim: true,
      maxlength: 80,
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

visionMissionSchema.index({ isActive: 1, order: 1, createdAt: 1 });
visionMissionSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("VisionMission", visionMissionSchema);
