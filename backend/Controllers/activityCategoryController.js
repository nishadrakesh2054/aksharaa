const asyncHandler = require("express-async-handler");
const Category = require("../Models/activitiesCategorySchema");
const ApiResponse = require("../utils/apiResponse");

// Create Activity Category
const createCategory = asyncHandler(async (req, res) => {
  const categoryTitle = req.body.title || req.body.name;
  if (!categoryTitle || !categoryTitle.trim()) {
    return ApiResponse.error(res, 400, "Activity category title is required.");
  }

  const categoryFound = await Category.findOne({ title: categoryTitle.trim() });
  if (categoryFound) {
    return ApiResponse.error(res, 400, "Activity category with this title already exists.");
  }

  const category = new Category({ title: categoryTitle.trim() });
  await category.save();

  const categories = await Category.find({});
  return ApiResponse.success(res, 201, "Activity category added successfully", { categories, data: categories });
});

// Get Activity categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  return ApiResponse.success(res, 200, "Activity categories fetched successfully", { categories, data: categories });
});

// Update Activity category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const categoryTitle = req.body.title || req.body.name;
  if (!categoryTitle || !categoryTitle.trim()) {
    return ApiResponse.error(res, 400, "Activity category title is required.");
  }

  const category = await Category.findById(id);
  if (!category) {
    return ApiResponse.error(res, 404, "Activity category not found.");
  }

  category.title = categoryTitle.trim();
  await category.save();

  const categories = await Category.find({});
  return ApiResponse.success(res, 200, "Activity category updated successfully", { categories, data: categories });
});

// Delete Activity category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return ApiResponse.error(res, 404, "Activity category not found.");
  }

  const categories = await Category.find({});
  return ApiResponse.success(res, 200, "Activity category deleted successfully", { categories, data: categories });
});

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
