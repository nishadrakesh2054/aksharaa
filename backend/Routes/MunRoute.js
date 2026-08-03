const express = require("express");
const router = express.Router();
const munController = require("../Controllers/MunController");
const { academicsUpload } = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");

const uploadFields = academicsUpload.fields([
  { name: "sliderImages", maxCount: 15 },
  { name: "gridImages", maxCount: 15 },
]);

router.route("/").get(munController.getMun).put(canManageContent, uploadFields, munController.updateMun);

module.exports = router;
