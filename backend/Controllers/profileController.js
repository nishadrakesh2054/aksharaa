const Profile = require("../Models/profileSchema");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const ApiResponse = require("../utils/apiResponse");
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

// Create a new profile member
const createProfile = asyncHandler(async (req, res) => {
  const { title, position, category, facebook, instagram, viber, linkedin, whatsapp, order } = req.body;

  if (!req.file) {
    return ApiResponse.error(res, 400, "Profile image file is required.");
  }
  if (!title || !title.trim() || !position || !position.trim()) {
    return ApiResponse.error(res, 400, "Name and position fields are required.");
  }

  const image = req.file.path;
  const newProfile = new Profile({
    title: title.trim(),
    position: position.trim(),
    category: category ? category.trim() : "Administration & Operations",
    image,
    facebook: facebook || "",
    instagram: instagram || "",
    viber: viber || "",
    linkedin: linkedin || "",
    whatsapp: whatsapp || "",
    order: order ? Number(order) : 0,
  });

  await newProfile.save();
  return ApiResponse.success(res, 201, "Team member profile created successfully", newProfile);
});

// Get all profiles
const getAllProfile = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const result = await paginatedFind({
    model: Profile,
    req,
    filter,
    searchFields: ["title", "position", "category"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Profiles fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    profiles: result.items,
    data: result.items,
  });
});

// Get single profile by ID
const getProfileById = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return ApiResponse.error(res, 404, "Teacher profile not found.");
  }
  return ApiResponse.success(res, 200, "Teacher profile fetched successfully", { profile, data: profile });
});

// Update profile
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return ApiResponse.error(res, 404, "Teacher profile not found.");
  }

  const { title, position, category, facebook, instagram, viber, linkedin, whatsapp, order } = req.body;
  if (title && title.trim()) profile.title = title.trim();
  if (position && position.trim()) profile.position = position.trim();
  if (category && category.trim()) profile.category = category.trim();
  if (facebook !== undefined) profile.facebook = facebook;
  if (instagram !== undefined) profile.instagram = instagram;
  if (viber !== undefined) profile.viber = viber;
  if (linkedin !== undefined) profile.linkedin = linkedin;
  if (whatsapp !== undefined) profile.whatsapp = whatsapp;
  if (order !== undefined) profile.order = Number(order);

  if (req.file) {
    safeUnlink(profile.image);
    profile.image = req.file.path;
  }

  await profile.save();
  return ApiResponse.success(res, 200, "Team profile updated successfully", { profile, data: profile });
});

// Delete a profile
const deleteProfile = asyncHandler(async (req, res) => {
  const deleted = await Profile.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 404, "Profile not found.");
  }

  safeUnlink(deleted.image);
  return ApiResponse.success(res, 200, "Profile deleted successfully");
});

module.exports = { createProfile, getAllProfile, getProfileById, updateProfile, deleteProfile };
