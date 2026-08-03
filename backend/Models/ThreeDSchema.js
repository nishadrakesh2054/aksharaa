const mongoose = require("mongoose");

const ThreeDSchema = new mongoose.Schema(
  {
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

ThreeDSchema.index({ createdAt: -1 });

const ThreegalleryModel = mongoose.model("gallerythree", ThreeDSchema);
module.exports = ThreegalleryModel;
