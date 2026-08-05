const mongoose = require("mongoose");

const academicItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

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
      type: [academicItemSchema],
      default: [],
    },
    extraActivitiesTitle: {
      type: String,
      default: "Extra / Co-Curricular Activities",
    },
    extraActivities: {
      type: [academicItemSchema],
      default: [],
    },
    approachTitle: {
      type: String,
      default: "Aksharaa Approach to Quality Education",
    },
    approachItems: {
      type: [academicItemSchema],
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
