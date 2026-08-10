const express = require("express");
const router = express.Router();
const coreValuesFrameworkController = require("../Controllers/coreValuesFrameworkController");
const { coreValuesUpload } = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(coreValuesFrameworkController.getCoreValuesFramework)
  .put(canManageContent, coreValuesUpload.single("image"), coreValuesFrameworkController.upsertCoreValuesFramework);

module.exports = router;
