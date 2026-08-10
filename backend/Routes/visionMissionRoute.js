const express = require("express");
const router = express.Router();
const visionMissionController = require("../Controllers/visionMissionController");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/")
  .get(visionMissionController.getVisionMissionItems)
  .post(canManageContent, visionMissionController.createVisionMissionItem);

router
  .route("/:id")
  .get(validateMongoId("id"), visionMissionController.getVisionMissionItemById)
  .put(canManageContent, validateMongoId("id"), visionMissionController.updateVisionMissionItem)
  .delete(canManageContent, validateMongoId("id"), visionMissionController.deleteVisionMissionItem);

module.exports = router;
