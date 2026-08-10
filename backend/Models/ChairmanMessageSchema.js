const mongoose = require("mongoose");

const chairmanMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 160,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

chairmanMessageSchema.index({ active: 1, createdAt: 1 });
chairmanMessageSchema.index({ name: "text", position: "text", description: "text" });

module.exports = mongoose.model("ChairmanMessage", chairmanMessageSchema);
