const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

partnerSchema.index({ order: 1, createdAt: -1 });
partnerSchema.index({ title: "text", link: "text" });

module.exports = mongoose.model("Partner", partnerSchema);
