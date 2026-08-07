const asyncHandler = require("express-async-handler");
const TeamBanner = require("../Models/TeamBannerSchema");
const ApiResponse = require("../utils/apiResponse");
const path = require("path");
const fs = require("fs");
const { paginatedFind } = require("../utils/queryFeatures");

const safeUnlink = (relativePath) => {
  if (!relativePath || relativePath.startsWith("http://") || relativePath.startsWith("https://")) return;
  const filePath = path.normalize(path.join(__dirname, "..", relativePath));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file at ${filePath}:`, err.message);
    }
  }
};

// GET /api/v1/teambanners - Get all team section group banners
const getTeamBanners = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: TeamBanner,
    req,
    searchFields: ["title"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Fetched team group banners successfully", {
    total: result.total,
    pagination: result.pagination,
    banners: result.items,
    data: result.items,
  });
});

// POST /api/v1/teambanners - Create new team section group banner
const createTeamBanner = asyncHandler(async (req, res) => {
  const { title, order } = req.body;

  if (!req.file) {
    return ApiResponse.error(res, 400, "Banner image file is required.");
  }
  if (!title || !title.trim()) {
    return ApiResponse.error(res, 400, "Section title is required.");
  }

  const image = req.file.path;
  const newBanner = new TeamBanner({
    title: title.trim(),
    image,
    order: order ? Number(order) : 0,
  });

  await newBanner.save();
  return ApiResponse.success(res, 201, "Team banner section created successfully", newBanner);
});

// PUT /api/v1/teambanners/:id - Update team section banner
const updateTeamBanner = asyncHandler(async (req, res) => {
  const banner = await TeamBanner.findById(req.params.id);
  if (!banner) {
    return ApiResponse.error(res, 404, "Team banner section not found.");
  }

  const { title, order } = req.body;
  if (title && title.trim()) banner.title = title.trim();
  if (order !== undefined) banner.order = Number(order);

  if (req.file) {
    safeUnlink(banner.image);
    banner.image = req.file.path;
  }

  await banner.save();
  return ApiResponse.success(res, 200, "Team banner updated successfully", banner);
});

// DELETE /api/v1/teambanners/:id - Delete team section banner
const deleteTeamBanner = asyncHandler(async (req, res) => {
  const deleted = await TeamBanner.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 404, "Team banner section not found.");
  }

  safeUnlink(deleted.image);
  return ApiResponse.success(res, 200, "Team banner section deleted successfully");
});

module.exports = {
  getTeamBanners,
  createTeamBanner,
  updateTeamBanner,
  deleteTeamBanner,
};
