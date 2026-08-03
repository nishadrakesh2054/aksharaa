const mongoose = require("mongoose");

const gallery = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

gallery.index({ createdAt: -1 });
gallery.index({ title: "text" });

const galleryModel = mongoose.model("galleries", gallery);
module.exports = galleryModel;
