const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      enum: ["kindergarten", "elementary", "middle", "high"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    gradeRange: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    sideImage: {
      type: String,
      default: "",
    },
    learningCentersTitle: {
      type: String,
      default: "Learning Centers",
    },
    learningCenters: {
      type: [String],
      default: [],
    },
    extraActivitiesTitle: {
      type: String,
      default: "Extra / Co-Curricular Activities",
    },
    extraActivities: {
      type: [String],
      default: [],
    },
    approachTitle: {
      type: String,
      default: "Aksharaa Approach to Quality Education",
    },
    approachItems: {
      type: [String],
      default: [],
    },
    // Top Scroll Banner Images
    sliderImages: {
      type: [String],
      default: [],
    },
    // Bottom Image Grid Photos
    gridImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Academic", academicSchema);
