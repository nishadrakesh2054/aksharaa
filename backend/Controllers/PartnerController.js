const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Partner = require("../Models/PartnerSchema");
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

const getPartners = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Partner,
    req,
    searchFields: ["title", "link"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Educational partners fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    partners: result.items,
    data: result.items,
  });
});

const getPartnerById = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return ApiResponse.error(res, 404, "Educational partner not found.");
  }

  return ApiResponse.success(res, 200, "Educational partner fetched successfully", {
    partner,
    data: partner,
  });
});

const createPartner = asyncHandler(async (req, res) => {
  const { title, link, order } = req.body;

  if (!title || !title.trim()) {
    return ApiResponse.error(res, 400, "Partner name is required.");
  }
  if (!req.file) {
    return ApiResponse.error(res, 400, "Partner logo is required.");
  }

  const partner = new Partner({
    title: title.trim(),
    logo: req.file.path,
    link: link ? link.trim() : "",
    order: order ? Number(order) : 0,
  });

  await partner.save();
  return ApiResponse.success(res, 201, "Educational partner created successfully", partner);
});

const updatePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return ApiResponse.error(res, 404, "Educational partner not found.");
  }

  const { title, link, order } = req.body;

  if (title && title.trim()) partner.title = title.trim();
  if (link !== undefined) partner.link = link.trim();
  if (order !== undefined) partner.order = Number(order);

  if (req.file) {
    safeUnlink(partner.logo);
    partner.logo = req.file.path;
  }

  await partner.save();
  return ApiResponse.success(res, 200, "Educational partner updated successfully", {
    partner,
    data: partner,
  });
});

const deletePartner = asyncHandler(async (req, res) => {
  const deleted = await Partner.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 404, "Educational partner not found.");
  }

  safeUnlink(deleted.logo);
  return ApiResponse.success(res, 200, "Educational partner deleted successfully");
});

module.exports = {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};
