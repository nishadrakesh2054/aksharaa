const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
    },

    filePath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

pdfSchema.index({ createdAt: -1 });
pdfSchema.index({ title: "text" });

const pdfModel = mongoose.model("pdf", pdfSchema);
module.exports = pdfModel;
