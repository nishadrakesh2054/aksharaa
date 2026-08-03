const mongoose = require("mongoose");

const creativeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Creative Of This Week",
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

creativeSchema.index({ order: 1, createdAt: -1 });
creativeSchema.index({ title: "text", description: "text" });

const creativeweekModel = mongoose.model("Creativeweek", creativeSchema);
module.exports = creativeweekModel;
