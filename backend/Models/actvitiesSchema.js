const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
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
  },
  { timestamps: true }
);

activitiesSchema.index({ createdAt: -1 });
activitiesSchema.index({ category: 1, createdAt: -1 });
activitiesSchema.index({ title: "text", description: "text" });

const blogModel = mongoose.model("Activities", activitiesSchema);
module.exports = blogModel;
