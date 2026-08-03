const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Infrastructure = require("../Models/InfrastructureSchema");
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

const getAllInfrastructure = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Infrastructure,
    req,
    searchFields: ["title", "description", "iconClass"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Infrastructure items fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    infrastructure: result.items,
    data: result.items,
  });
});

const getInfrastructureById = asyncHandler(async (req, res) => {
  const item = await Infrastructure.findById(req.params.id);
  if (!item) {
    return ApiResponse.error(res, 404, "Infrastructure item not found.");
  }

  return ApiResponse.success(res, 200, "Infrastructure item fetched successfully", {
    infrastructure: item,
    data: item,
  });
});

const createInfrastructure = asyncHandler(async (req, res) => {
  const { title, iconClass, description, order } = req.body;

  if (!title || !title.trim() || !description || !description.trim()) {
    return ApiResponse.error(res, 400, "Title and description are required.");
  }

  const images = req.files && Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  if (images.length === 0) {
    return ApiResponse.error(res, 400, "At least one infrastructure photo is required.");
  }

  const item = new Infrastructure({
    title: title.trim(),
    iconClass: iconClass && iconClass.trim() ? iconClass.trim() : "fas fa-school text-primary",
    description: description.trim(),
    images,
    order: order ? Number(order) : 0,
  });

  await item.save();
  return ApiResponse.success(res, 201, "Infrastructure item created successfully", item);
});

const updateInfrastructure = asyncHandler(async (req, res) => {
  const item = await Infrastructure.findById(req.params.id);
  if (!item) {
    return ApiResponse.error(res, 404, "Infrastructure item not found.");
  }

  const { title, iconClass, description, order } = req.body;

  if (title && title.trim()) item.title = title.trim();
  if (iconClass !== undefined) item.iconClass = iconClass.trim();
  if (description && description.trim()) item.description = description.trim();
  if (order !== undefined) item.order = Number(order);

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    item.images.forEach(safeUnlink);
    item.images = req.files.map((file) => file.path);
  }

  await item.save();
  return ApiResponse.success(res, 200, "Infrastructure item updated successfully", {
    infrastructure: item,
    data: item,
  });
});

const deleteInfrastructure = asyncHandler(async (req, res) => {
  const deleted = await Infrastructure.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 404, "Infrastructure item not found.");
  }

  deleted.images.forEach(safeUnlink);
  return ApiResponse.success(res, 200, "Infrastructure item deleted successfully");
});

module.exports = {
  getAllInfrastructure,
  getInfrastructureById,
  createInfrastructure,
  updateInfrastructure,
  deleteInfrastructure,
};
