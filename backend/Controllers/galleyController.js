const Galleries = require("../Models/GallerySchema");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

const safeUnlink = (relativePath) => {
  if (!relativePath) return;
  const filePath = path.normalize(path.join(__dirname, "..", relativePath));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file at ${filePath}:`, err.message);
    }
  }
};

// Create a new gallery
const createGalleries = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!req.files || !req.files.length) {
    return ApiResponse.error(res, 400, "At least one image is required for gallery creation.");
  }
  if (!title || !title.trim()) {
    return ApiResponse.error(res, 400, "Gallery title is required.");
  }

  const imagePaths = req.files.map((file) => file.path);
  const gallery = new Galleries({
    title: title.trim(),
    images: imagePaths,
  });

  await gallery.save();
  return ApiResponse.success(res, 201, "Gallery created successfully", gallery);
});

// Get all galleries
const getAllGalleries = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Galleries,
    req,
    searchFields: ["title"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Galleries fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    gallery: result.items,
    data: result.items,
  });
});

// Get single gallery
const getSingleGallery = asyncHandler(async (req, res) => {
  const gallery = await Galleries.findById(req.params.id);
  if (!gallery) {
    return ApiResponse.error(res, 404, "Gallery not found.");
  }
  return ApiResponse.success(res, 200, "Gallery retrieved successfully", gallery);
});

// Update a gallery
const updateGalleries = asyncHandler(async (req, res) => {
  const gallery = await Galleries.findById(req.params.id);
  if (!gallery) {
    return ApiResponse.error(res, 404, "Gallery not found.");
  }

  const { title } = req.body;
  if (title && title.trim()) {
    gallery.title = title.trim();
  }

  if (req.files && req.files.length > 0) {
    if (Array.isArray(gallery.images)) {
      gallery.images.forEach((img) => safeUnlink(img));
    }
    gallery.images = req.files.map((file) => file.path);
  }

  await gallery.save();
  return ApiResponse.success(res, 200, "Gallery updated successfully", { gallery, data: gallery });
});

// Delete a gallery
const deleteGalleries = asyncHandler(async (req, res) => {
  const gallery = await Galleries.findByIdAndDelete(req.params.id);
  if (!gallery) {
    return ApiResponse.error(res, 404, "Gallery not found.");
  }

  if (Array.isArray(gallery.images)) {
    gallery.images.forEach((img) => safeUnlink(img));
  }

  return ApiResponse.success(res, 200, "Gallery deleted and images removed successfully");
});

module.exports = {
  createGalleries,
  getAllGalleries,
  updateGalleries,
  deleteGalleries,
  getSingleGallery,
};
