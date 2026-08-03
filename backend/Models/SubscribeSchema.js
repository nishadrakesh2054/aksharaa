const mongoose = require("mongoose");

const SubscribeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

SubscribeSchema.index({ createdAt: -1 });
SubscribeSchema.index({ isRead: 1, createdAt: -1 });
SubscribeSchema.index({ status: 1, createdAt: -1 });
SubscribeSchema.index({ email: "text", status: "text" });

const subscribeModel = mongoose.model("subscribe", SubscribeSchema);
module.exports = subscribeModel;
