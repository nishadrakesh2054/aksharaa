const express = require("express");
const router = express.Router();
const introController = require("../Controllers/profileController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/createprofile")
  .post(
    canManageContent,
    upload.ProfileUpload.single("profileimage"),
    introController.createProfile
  );

router.route("/getallprofile").get(introController.getAllProfile);

router
  .route("/getprofile/:id")
  .get(validateMongoId("id"), introController.getProfileById);

router
  .route("/updateprofile/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.ProfileUpload.single("profileimage"),
    introController.updateProfile
  );

router
  .route("/deleteprofile/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    introController.deleteProfile
  );

module.exports = router;
