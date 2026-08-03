const mongoose = require("mongoose");

const InfrastructureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    iconClass: {
      type: String,
      default: "fas fa-school text-primary",
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

InfrastructureSchema.index({ order: 1, createdAt: -1 });
InfrastructureSchema.index({ title: "text", description: "text", iconClass: "text" });

module.exports = mongoose.model("Infrastructure", InfrastructureSchema);
