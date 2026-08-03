const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ title: "text", description: "text", video: "text" });

module.exports = mongoose.model("Project", ProjectSchema);
