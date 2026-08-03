const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema(
  {
    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

HeroSchema.index({ createdAt: -1 });

const noticeModel = mongoose.model("Hero", HeroSchema);
module.exports = noticeModel;
