const asyncHandler = require("express-async-handler");
const Mun = require("../Models/MunSchema");
const ApiResponse = require("../utils/apiResponse");

const parseArrayField = (value, fallback = []) => {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// GET /api/v1/mun - Fetch MUN page data
const getMun = asyncHandler(async (req, res) => {
  let mun = await Mun.findOne();
  if (!mun) {
    mun = await Mun.create({});
  }
  return ApiResponse.success(res, 200, "Fetched Aksharaa MUN data", { mun });
});

// PUT /api/v1/mun - Update MUN page data and photos
const updateMun = asyncHandler(async (req, res) => {
  let mun = await Mun.findOne();
  if (!mun) {
    mun = new Mun({});
  }

  const {
    title,
    subtitle,
    aboutTitle,
    aboutText,
    whyTitle,
    whyText,
    goalsTitle,
    goalsList,
    existingSliderImages,
    existingGridImages,
  } = req.body;

  if (title) mun.title = title;
  if (subtitle) mun.subtitle = subtitle;
  if (aboutTitle) mun.aboutTitle = aboutTitle;
  if (aboutText) mun.aboutText = aboutText;
  if (whyTitle) mun.whyTitle = whyTitle;
  if (whyText) mun.whyText = whyText;
  if (goalsTitle) mun.goalsTitle = goalsTitle;

  if (goalsList) {
    mun.goalsList = parseArrayField(goalsList, mun.goalsList);
  }

  let sliderList = parseArrayField(existingSliderImages, mun.sliderImages || []);
  let gridList = parseArrayField(existingGridImages, mun.gridImages || []);

  if (req.files) {
    if (req.files.sliderImages && req.files.sliderImages.length > 0) {
      const newSliders = req.files.sliderImages.map((f) => f.path);
      sliderList = [...sliderList, ...newSliders];
    }
    if (req.files.gridImages && req.files.gridImages.length > 0) {
      const newGrids = req.files.gridImages.map((f) => f.path);
      gridList = [...gridList, ...newGrids];
    }
  }

  mun.sliderImages = sliderList;
  mun.gridImages = gridList;

  await mun.save();
  return ApiResponse.success(res, 200, "Aksharaa MUN section updated successfully", mun);
});

module.exports = {
  getMun,
  updateMun,
};
