const Hero = require("../Models/HeroSchema");
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

// Create a new HeroBanner
const createHero = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 400, "Hero banner image is required.");
  }

  const image = req.file.path;
  const newHero = new Hero({ images: image });
  await newHero.save();

  return ApiResponse.success(res, 201, "Hero banner created successfully", newHero);
});

// Get all HeroBanners
const getHero = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Hero,
    req,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Hero banners retrieved successfully", {
    total: result.total,
    pagination: result.pagination,
    Heros: result.items,
    data: result.items,
  });
});

// Get single HeroBanner
const getHeroById = asyncHandler(async (req, res) => {
  const hero = await Hero.findById(req.params.id);
  if (!hero) {
    return ApiResponse.error(res, 404, "Hero banner not found.");
  }
  return ApiResponse.success(res, 200, "Hero banner fetched successfully", { hero, data: hero });
});

// Update HeroBanner
const updateHero = asyncHandler(async (req, res) => {
  const hero = await Hero.findById(req.params.id);
  if (!hero) {
    return ApiResponse.error(res, 404, "Hero banner not found.");
  }

  if (req.file) {
    safeUnlink(hero.images);
    hero.images = req.file.path;
  }

  await hero.save();
  return ApiResponse.success(res, 200, "Hero banner updated successfully", { hero, data: hero });
});

// Delete a HeroBanner
const deleteBanner = asyncHandler(async (req, res) => {
  const hero = await Hero.findByIdAndDelete(req.params.id);
  if (!hero) {
    return ApiResponse.error(res, 404, "Hero banner not found.");
  }

  safeUnlink(hero.images);
  return ApiResponse.success(res, 200, "Hero banner deleted successfully");
});

module.exports = { createHero, getHero, getHeroById, updateHero, deleteBanner };
