const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
    },
    parentname: {
      type: String,
      required: [true, "enter Parentname"],
    },
    image: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: [true, "enter feedback"],
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ title: "text", parentname: "text", feedback: "text" });

const testimonialModel = mongoose.model("Testimonial", testimonialSchema);
module.exports = testimonialModel;
