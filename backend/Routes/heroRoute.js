const express = require("express");
const router = express.Router();
const heroController = require("../Controllers/HeroController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/herobanner")
  .post(
    canManageContent,
    upload.HeroUpload.single("Heroimage"),
    heroController.createHero
  );

router.route("/getallheroimg").get(heroController.getHero);

router
  .route("/getheroimg/:id")
  .get(validateMongoId("id"), heroController.getHeroById);

router
  .route("/updateheroimg/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.HeroUpload.single("Heroimage"),
    heroController.updateHero
  );

router
  .route("/deleteheroimg/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    heroController.deleteBanner
  );

module.exports = router;
