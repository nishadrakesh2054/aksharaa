const express = require("express");
const router = express.Router();
const activitiesController = require("../Controllers/activityController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

// Multer middleware wrapper to support 'activityImage', 'activityimage', or 'image'
const uploadActivityImage = upload.activityUpload.fields([
  { name: "activityImage", maxCount: 1 },
  { name: "activityimage", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

const extractFile = (req, res, next) => {
  if (req.files) {
    req.file =
      (req.files.activityImage && req.files.activityImage[0]) ||
      (req.files.activityimage && req.files.activityimage[0]) ||
      (req.files.image && req.files.image[0]) ||
      null;
  }
  next();
};

router
  .route("/")
  .get(activitiesController.getAllActivities)
  .post(canManageContent, uploadActivityImage, extractFile, activitiesController.createActivity);

router
  .route("/:id/reupload")
  .post(
    canManageContent,
    validateMongoId("id"),
    uploadActivityImage,
    extractFile,
    activitiesController.reuploadImage
  );

router
  .route("/:id")
  .get(validateMongoId("id"), activitiesController.getActivityById)
  .put(
    canManageContent,
    validateMongoId("id"),
    uploadActivityImage,
    extractFile,
    activitiesController.updateActivityById
  )
  .delete(canManageContent, validateMongoId("id"), activitiesController.deleteActivityById);

router
  .route("/deleteallblogs")
  .delete(canManageContent, activitiesController.deleteAllActivities);

module.exports = router;

