const GalleryThreeD = require("../Models/ThreeDSchema");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
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

// Create a new 3D image entry
const createThreeDPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 400, "3D image file is required.");
  }

  const imagePath = req.file.path;
  const threeDimage = new GalleryThreeD({ images: [imagePath] });
  await threeDimage.save();

  return ApiResponse.success(res, 201, "3D image entry created successfully", threeDimage);
});

// Get all 3D images
const getAllThreeDImage = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: GalleryThreeD,
    req,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "3D images fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    gallery: result.items,
    data: result.items,
  });
});

// Get single 3D image
const getThreeDById = asyncHandler(async (req, res) => {
  const gallery = await GalleryThreeD.findById(req.params.id);
  if (!gallery) {
    return ApiResponse.error(res, 404, "3D image entry not found.");
  }
  return ApiResponse.success(res, 200, "3D image fetched successfully", { gallery, data: gallery });
});

// Update 3D image entry
const updateThreeD = asyncHandler(async (req, res) => {
  const gallery = await GalleryThreeD.findById(req.params.id);
  if (!gallery) {
    return ApiResponse.error(res, 404, "3D image entry not found.");
  }

  if (req.file) {
    if (Array.isArray(gallery.images)) {
      gallery.images.forEach((img) => safeUnlink(img));
    } else if (typeof gallery.images === "string") {
      safeUnlink(gallery.images);
    }
    gallery.images = [req.file.path];
  }

  await gallery.save();
  return ApiResponse.success(res, 200, "3D image entry updated successfully", { gallery, data: gallery });
});

// Delete 3D image entry
const deleteThreeD = asyncHandler(async (req, res) => {
  const gallery = await GalleryThreeD.findByIdAndDelete(req.params.id);
  if (!gallery) {
    return ApiResponse.error(res, 404, "3D image entry not found.");
  }

  if (Array.isArray(gallery.images)) {
    gallery.images.forEach((img) => safeUnlink(img));
  } else if (typeof gallery.images === "string") {
    safeUnlink(gallery.images);
  }

  return ApiResponse.success(res, 200, "3D image entry deleted successfully");
});

module.exports = { createThreeDPhoto, getAllThreeDImage, getThreeDById, updateThreeD, deleteThreeD };
