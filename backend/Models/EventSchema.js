const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

EventSchema.index({ createdAt: -1 });
EventSchema.index({ date: 1 });
EventSchema.index({ title: "text", date: "text", description: "text" });

module.exports = mongoose.model("Event", EventSchema);
