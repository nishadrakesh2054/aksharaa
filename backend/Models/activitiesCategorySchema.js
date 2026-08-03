const mongoose = require("mongoose");

const activitiesCategorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
});

activitiesCategorySchema.index({ title: 1 });
activitiesCategorySchema.index({ title: "text" });

const categoryModel = mongoose.model(
  "activitiesCategory",
  activitiesCategorySchema
);
module.exports = categoryModel;
