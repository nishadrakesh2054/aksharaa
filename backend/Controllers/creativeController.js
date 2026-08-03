const Creativeweek = require("../Models/creativeSchema");
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

const getUploadedImages = (req) => {
  if (req.files && Array.isArray(req.files)) {
    return req.files.map((file) => file.path);
  }

  if (req.files && typeof req.files === "object") {
    return Object.values(req.files)
      .flat()
      .map((file) => file.path);
  }

  if (req.file) {
    return [req.file.path];
  }

  return [];
};

// Create creative week entry
const createCreativeweek = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const images = getUploadedImages(req);

  if (!title || !title.trim() || !description || !description.trim()) {
    return ApiResponse.error(res, 400, "Title and description are required.");
  }

  if (images.length === 0) {
    return ApiResponse.error(res, 400, "At least one creative week image is required.");
  }

  const newEntry = new Creativeweek({
    title: title.trim(),
    description,
    images,
    order: order ? Number(order) : 0,
  });
  await newEntry.save();

  return ApiResponse.success(res, 201, "Creative week entry created successfully", newEntry);
});

// Get all creative week entries
const getCreativeWeek = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Creativeweek,
    req,
    searchFields: ["title", "description"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Creative week entries fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    notices: result.items,
    creative: result.items,
    data: result.items,
  });
});

// Get single creative week entry
const getCreativeWeekById = asyncHandler(async (req, res) => {
  const entry = await Creativeweek.findById(req.params.id);
  if (!entry) {
    return ApiResponse.error(res, 404, "Creative week entry not found.");
  }
  return ApiResponse.success(res, 200, "Creative week entry fetched successfully", { creative: entry, data: entry });
});

// Update creative week entry
const updateCreativeWeek = asyncHandler(async (req, res) => {
  const entry = await Creativeweek.findById(req.params.id);
  if (!entry) {
    return ApiResponse.error(res, 404, "Creative week entry not found.");
  }

  const { title, description, order } = req.body;
  const images = getUploadedImages(req);

  if (title && title.trim()) entry.title = title.trim();
  if (description && description.trim()) entry.description = description;
  if (order !== undefined) entry.order = Number(order);

  if (images.length > 0) {
    entry.images.forEach(safeUnlink);
    entry.images = images;
  }

  await entry.save();
  return ApiResponse.success(res, 200, "Creative week entry updated successfully", { creative: entry, data: entry });
});

// Delete creative week entry
const deleteCreativeweek = asyncHandler(async (req, res) => {
  const deleted = await Creativeweek.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 404, "Creative week entry not found.");
  }

  deleted.images.forEach(safeUnlink);
  return ApiResponse.success(res, 200, "Creative week entry deleted successfully");
});

module.exports = {
  createCreativeweek,
  getCreativeWeek,
  getCreativeWeekById,
  updateCreativeWeek,
  deleteCreativeweek,
};
