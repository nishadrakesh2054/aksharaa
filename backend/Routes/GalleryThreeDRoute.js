const express = require("express");
const router = express.Router();
const ThreeDController = require("../Controllers/ThreeDGalleryController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/createthreed")
  .post(
    canManageContent,
    upload.ThreeDGalleryUpload.single("ThreeDimage"),
    ThreeDController.createThreeDPhoto
  );

router.route("/getallthreedimg").get(ThreeDController.getAllThreeDImage);

router
  .route("/getthreedimg/:id")
  .get(validateMongoId("id"), ThreeDController.getThreeDById);

router
  .route("/updatethreedimg/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.ThreeDGalleryUpload.single("ThreeDimage"),
    ThreeDController.updateThreeD
  );

router
  .route("/deletethreedimg/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    ThreeDController.deleteThreeD
  );

module.exports = router;
