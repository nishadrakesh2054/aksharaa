const asyncHandler = require("express-async-handler");
const Category = require("../Models/BlogCategorySchema");
const ApiResponse = require("../utils/apiResponse");

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const categoryTitle = req.body.title || req.body.name;
  if (!categoryTitle || !categoryTitle.trim()) {
    return ApiResponse.error(res, 400, "Category title is required.");
  }

  const categoryFound = await Category.findOne({ title: categoryTitle.trim() });
  if (categoryFound) {
    return ApiResponse.error(res, 400, "Category with this title already exists.");
  }

  const category = new Category({ title: categoryTitle.trim() });
  await category.save();

  const categories = await Category.find({}).sort({ createdAt: -1 });
  return ApiResponse.success(res, 201, "Category added successfully", { categories, data: categories });
});

// Get categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  return ApiResponse.success(res, 200, "Categories retrieved successfully", { categories, data: categories });
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const categoryTitle = req.body.title || req.body.name;
  if (!categoryTitle || !categoryTitle.trim()) {
    return ApiResponse.error(res, 400, "Category title is required.");
  }

  const category = await Category.findById(id);
  if (!category) {
    return ApiResponse.error(res, 404, "Category not found.");
  }

  category.title = categoryTitle.trim();
  await category.save();

  const categories = await Category.find({}).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, "Category updated successfully", { categories, data: categories });
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return ApiResponse.error(res, 404, "Category not found.");
  }

  const categories = await Category.find({});
  return ApiResponse.success(res, 200, "Category deleted successfully", { categories, data: categories });
});

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
