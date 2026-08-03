const mongoose = require("mongoose");

const teamBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

teamBannerSchema.index({ order: 1, createdAt: -1 });
teamBannerSchema.index({ title: "text" });

module.exports = mongoose.model("TeamBanner", teamBannerSchema);
