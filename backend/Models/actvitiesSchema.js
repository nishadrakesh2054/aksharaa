const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
      trim: true,
      maxlength: 180,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 280,
    },
    description: {
      type: String,
      required: [true, "enter description"],
    },
    image: {
      type: String,
      required: true,
    },
    category: { type: mongoose.Types.ObjectId, ref: "activitiesCategory" },
    eventDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: "",
      maxlength: 160,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

activitiesSchema.index({ createdAt: -1 });
activitiesSchema.index({ category: 1, createdAt: -1 });
activitiesSchema.index({ eventDate: -1, createdAt: -1 });
activitiesSchema.index({ isFeatured: 1, createdAt: -1 });
activitiesSchema.index({ title: "text", excerpt: "text", description: "text", location: "text" });

const blogModel = mongoose.model("Activities", activitiesSchema);
module.exports = blogModel;
