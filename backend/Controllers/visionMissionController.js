const asyncHandler = require("express-async-handler");
const VisionMission = require("../Models/VisionMissionSchema");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

const defaultVisionMissionItems = [
  {
    iconClass: "fas fa-bullseye",
    title: "OUR MISSION",
    description:
      "Aksharaa School inculcates value-based education with academic excellence through collaboration with parents and stakeholders to instill resilience, leadership skills, and emotional intelligence in each learner.",
    badgeClass: "badge-emerald",
    cardClass: "card-emerald",
    order: 1,
    isActive: true,
  },
  {
    iconClass: "fas fa-eye",
    title: "OUR VISION",
    description:
      "Nurturing young learners to become lifelong learners, globally competent, and responsible citizens empowered to excel in a rapidly evolving world.",
    badgeClass: "badge-blue",
    cardClass: "card-blue",
    order: 2,
    isActive: true,
  },
  {
    iconClass: "fas fa-heart",
    title: "OUR CORE VALUES",
    description:
      "We are committed to fostering excellence, integrity, and inclusivity. We encourage positivity, empathy, effective communication, innovation, and critical thinking to build well-rounded individuals.",
    badgeClass: "badge-pink",
    cardClass: "card-pink",
    order: 3,
    isActive: true,
  },
];

const seedDefaultVisionMissionItems = async () => {
  const count = await VisionMission.countDocuments();
  if (count > 0) return;
  await VisionMission.insertMany(defaultVisionMissionItems);
};

const parseBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return value === true || String(value) === "true";
};

const getVisionMissionItems = asyncHandler(async (req, res) => {
  await seedDefaultVisionMissionItems();

  const includeInactive = req.query.includeInactive === "true";
  const filter = includeInactive ? {} : { isActive: true };

  const result = await paginatedFind({
    model: VisionMission,
    req,
    filter,
    searchFields: ["title", "description"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: 1 },
  });

  return ApiResponse.success(res, 200, "Vision and mission items fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    items: result.items,
    visionMission: result.items,
    data: result.items,
  });
});

const getVisionMissionItemById = asyncHandler(async (req, res) => {
  await seedDefaultVisionMissionItems();

  const item = await VisionMission.findById(req.params.id);
  if (!item) {
    return ApiResponse.error(res, 404, "Vision and mission item not found.");
  }

  return ApiResponse.success(res, 200, "Vision and mission item fetched successfully", {
    item,
    data: item,
  });
});

const createVisionMissionItem = asyncHandler(async (req, res) => {
  const item = await VisionMission.create({
    title: req.body.title,
    description: req.body.description,
    iconClass: req.body.iconClass,
    badgeClass: req.body.badgeClass,
    cardClass: req.body.cardClass,
    order: Number(req.body.order) || 0,
    isActive: parseBoolean(req.body.isActive, true),
  });

  return ApiResponse.success(res, 201, "Vision and mission item created successfully", {
    item,
    data: item,
  });
});

const updateVisionMissionItem = asyncHandler(async (req, res) => {
  const item = await VisionMission.findById(req.params.id);
  if (!item) {
    return ApiResponse.error(res, 404, "Vision and mission item not found.");
  }

  if (req.body.title !== undefined) item.title = req.body.title;
  if (req.body.description !== undefined) item.description = req.body.description;
  if (req.body.iconClass !== undefined) item.iconClass = req.body.iconClass;
  if (req.body.badgeClass !== undefined) item.badgeClass = req.body.badgeClass;
  if (req.body.cardClass !== undefined) item.cardClass = req.body.cardClass;
  if (req.body.order !== undefined) item.order = Number(req.body.order) || 0;
  if (req.body.isActive !== undefined) item.isActive = parseBoolean(req.body.isActive, item.isActive);

  await item.save();

  return ApiResponse.success(res, 200, "Vision and mission item updated successfully", {
    item,
    data: item,
  });
});

const deleteVisionMissionItem = asyncHandler(async (req, res) => {
  const item = await VisionMission.findByIdAndDelete(req.params.id);
  if (!item) {
    return ApiResponse.error(res, 404, "Vision and mission item not found.");
  }

  return ApiResponse.success(res, 200, "Vision and mission item deleted successfully", {
    deletedId: req.params.id,
  });
});

module.exports = {
  createVisionMissionItem,
  getVisionMissionItems,
  getVisionMissionItemById,
  updateVisionMissionItem,
  deleteVisionMissionItem,
};
