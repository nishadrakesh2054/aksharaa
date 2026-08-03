const express = require("express");
const router = express.Router();
const galleriesController = require("../Controllers/galleyController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/creategallery")
  .post(
    canManageContent,
    upload.galleriesUpload.array("galleries", 10),
    galleriesController.createGalleries
  );

router.route("/getallgallery").get(galleriesController.getAllGalleries);

router
  .route("/getallgallery/:id")
  .get(validateMongoId("id"), galleriesController.getSingleGallery);

router
  .route("/updategallery/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.galleriesUpload.array("galleries", 10),
    galleriesController.updateGalleries
  );

router
  .route("/deletegallery/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    galleriesController.deleteGalleries
  );

module.exports = router;
