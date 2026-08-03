const express = require("express");
const router = express.Router();
const teamBannerController = require("../Controllers/teamBannerController");
const { academicsUpload } = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(teamBannerController.getTeamBanners)
  .post(canManageContent, academicsUpload.single("image"), teamBannerController.createTeamBanner);

router
  .route("/:id")
  .put(canManageContent, academicsUpload.single("image"), teamBannerController.updateTeamBanner)
  .delete(canManageContent, teamBannerController.deleteTeamBanner);

module.exports = router;
