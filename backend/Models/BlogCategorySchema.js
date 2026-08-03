const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
});

blogCategorySchema.index({ title: 1 });
blogCategorySchema.index({ title: "text" });

const categoryModel = mongoose.model("blogCategory", blogCategorySchema);
module.exports = categoryModel;
