const mongoose = require("mongoose");

const Profile = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Administration & Operations",
      trim: true,
    },
    facebook: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    viber: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    whatsapp: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

Profile.index({ order: 1, createdAt: -1 });
Profile.index({ category: 1, order: 1 });
Profile.index({ title: "text", position: "text", category: "text" });

const profileModel = mongoose.model("profile", Profile);
module.exports = profileModel;
