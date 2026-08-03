const express = require("express");
const router = express.Router();
const academicController = require("../Controllers/AcademicController");
const { academicsUpload } = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");

const uploadFields = academicsUpload.fields([
  { name: "sliderImages", maxCount: 15 },
  { name: "gridImages", maxCount: 15 },
  { name: "sideImage", maxCount: 1 },
]);

router.get("/", academicController.getAcademics);
router
  .route("/:category")
  .get(academicController.getAcademicByCategory)
  .put(canManageContent, uploadFields, academicController.updateAcademicByCategory);

module.exports = router;
