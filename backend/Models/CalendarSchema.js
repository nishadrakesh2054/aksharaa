const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema(
  {
    monthYear: {
      type: String,
      required: true,
      trim: true,
    },
    events: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

CalendarSchema.index({ createdAt: 1 });
CalendarSchema.index({ monthYear: "text", events: "text" });

module.exports = mongoose.model("Calendar", CalendarSchema);
