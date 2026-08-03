const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
    },
    description: {
      type: String,
      required: [true, "enter description"],
    },
    image: {
      type: String,
      required: true,
    },
    category: { type: mongoose.Types.ObjectId, ref: "blogCategory" },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ title: "text", description: "text" });

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
