const asyncHandler = require("express-async-handler");
const Mun = require("../Models/MunSchema");
const ApiResponse = require("../utils/apiResponse");

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
    mun.goalsList = Array.isArray(goalsList)
      ? goalsList
      : typeof goalsList === "string"
      ? JSON.parse(goalsList)
      : mun.goalsList;
  }

  let sliderList = existingSliderImages
    ? Array.isArray(existingSliderImages)
      ? existingSliderImages
      : JSON.parse(existingSliderImages)
    : mun.sliderImages || [];

  let gridList = existingGridImages
    ? Array.isArray(existingGridImages)
      ? existingGridImages
      : JSON.parse(existingGridImages)
    : mun.gridImages || [];

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
