const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
  {
    images: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

NoticeSchema.index({ createdAt: -1 });

const noticeModel = mongoose.model("Notice", NoticeSchema);
module.exports = noticeModel;
