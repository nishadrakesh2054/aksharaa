const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
      trim: true,
      maxlength: 180,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 280,
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
    author: {
      type: String,
      trim: true,
      default: "Aksharaa School",
      maxlength: 120,
    },
    readTime: {
      type: String,
      trim: true,
      default: "",
      maxlength: 40,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: "",
      maxlength: 180,
    },
    seoDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ isFeatured: 1, createdAt: -1 });
blogSchema.index({ title: "text", excerpt: "text", description: "text", author: "text" });

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
