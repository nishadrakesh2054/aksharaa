const asyncHandler = require("express-async-handler");
const activity = require("../Models/actvitiesSchema");
const path = require("path");
const fs = require("fs");
const { isValidObjectId } = require("mongoose");
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

// Create Activity
const createActivity = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 400, "Activity image file is required.");
  }

  const {
    title,
    excerpt,
    description,
    category,
    eventDate,
    location,
    isFeatured,
  } = req.body;
  const image = req.file.path;

  const newActivity = new activity({
    title,
    excerpt,
    description,
    image,
    eventDate: eventDate || null,
    location,
    isFeatured: isFeatured === "true" || isFeatured === true,
    ...(category && { category }),
  });

  const savedActivity = await newActivity.save();
  return ApiResponse.success(res, 201, "Activity created successfully", savedActivity);
});

// Get all Activities
const getAllActivities = asyncHandler(async (req, res) => {
  const { categoryId, week } = req.query;
  let activities;
  let total;

  if (week) {
    activities = await activity.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      { $sample: { size: 2 } },
    ]);
    total = activities.length;
  } else if (categoryId) {
    const result = await paginatedFind({
      model: activity,
      req,
      filter: { category: categoryId },
      searchFields: ["title", "excerpt", "description", "location"],
      useTextSearch: true,
      defaultSort: { createdAt: -1 },
      populate: { path: "category", select: "title" },
    });
    activities = result.items;
    total = result.total;
    return ApiResponse.success(res, 200, "Activities retrieved successfully", {
      total,
      pagination: result.pagination,
      activities,
      data: activities,
    });
  } else {
    const result = await paginatedFind({
      model: activity,
      req,
      searchFields: ["title", "excerpt", "description", "location"],
      useTextSearch: true,
      defaultSort: { createdAt: -1 },
      populate: { path: "category", select: "title" },
    });
    activities = result.items;
    total = result.total;
    return ApiResponse.success(res, 200, "Activities retrieved successfully", {
      total,
      pagination: result.pagination,
      activities,
      data: activities,
    });
  }

  return ApiResponse.success(res, 200, "Activities retrieved successfully", {
    total,
    activities,
    data: activities,
  });
});

// Get single Activity
const getActivityById = asyncHandler(async (req, res) => {
  const activityId = req.params.id;

  if (!isValidObjectId(activityId)) {
    return ApiResponse.error(res, 400, "Invalid activity ID format.");
  }

  const activityFound = await activity.findById(activityId).populate({ path: "category", select: "title" }).lean();
  if (!activityFound) {
    return ApiResponse.error(res, 404, "Activity not found.");
  }

  return ApiResponse.success(res, 200, "Activity retrieved successfully", { activity: activityFound, data: activityFound });
});

// Update Activity by ID
const updateActivityById = asyncHandler(async (req, res) => {
  const activityId = req.params.id;
  const {
    title,
    excerpt,
    description,
    selectedCategory,
    category,
    eventDate,
    location,
    isFeatured,
  } = req.body;

  const catToUpdate = selectedCategory || category;
  const updateData = {};
  if (title) updateData.title = title;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (description) updateData.description = description;
  if (catToUpdate) updateData.category = catToUpdate;
  if (eventDate !== undefined) updateData.eventDate = eventDate || null;
  if (location !== undefined) updateData.location = location;
  if (isFeatured !== undefined) updateData.isFeatured = isFeatured === "true" || isFeatured === true;

  if (req.file) {
    const actFound = await activity.findById(activityId);
    if (actFound && actFound.image) {
      safeUnlink(actFound.image);
    }
    updateData.image = req.file.path;
  }

  const updatedActivity = await activity.findByIdAndUpdate(activityId, updateData, {
    new: true,
    runValidators: true,
  }).populate({ path: "category", select: "title" });

  if (!updatedActivity) {
    return ApiResponse.error(res, 404, "Activity not found.");
  }

  return ApiResponse.success(res, 200, "Activity updated successfully", updatedActivity);
});


// Delete single Activity
const deleteActivityById = asyncHandler(async (req, res) => {
  const activityId = req.params.id;
  const deleteAct = await activity.findByIdAndDelete(activityId);

  if (!deleteAct) {
    return ApiResponse.error(res, 404, "Activity not found.");
  }

  safeUnlink(deleteAct.image);

  const total = await activity.countDocuments();

  return ApiResponse.success(res, 200, "Activity deleted successfully", {
    total,
    deletedId: activityId,
  });
});

// Delete all Activities
const deleteAllActivities = asyncHandler(async (req, res) => {
  const allActs = await activity.find({});
  allActs.forEach((act) => safeUnlink(act.image));

  const result = await activity.deleteMany({});
  return ApiResponse.success(res, 200, "All activities deleted successfully", {
    deletedCount: result.deletedCount,
  });
});

// Reupload image
const reuploadImage = asyncHandler(async (req, res) => {
  const activityId = req.params.id;

  if (!req.file) {
    return ApiResponse.error(res, 400, "Image file is required for reupload.");
  }

  const actFound = await activity.findById(activityId);
  if (!actFound) {
    return ApiResponse.error(res, 404, "Activity not found.");
  }

  safeUnlink(actFound.image);

  actFound.image = req.file.path;
  await actFound.save();

  return ApiResponse.success(res, 200, "Activity image updated successfully", actFound);
});

module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivityById,
  deleteAllActivities,
  deleteActivityById,
  reuploadImage,
};
