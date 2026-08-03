const express = require("express");
const router = express.Router();
const creativeController = require("../Controllers/creativeController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

const creativeImagesUpload = upload.CreativeweekUpload.fields([
  { name: "images", maxCount: 5 },
  { name: "creativeweekimage", maxCount: 5 },
]);

router
  .route("/createcreativeweek")
  .post(
    canManageContent,
    creativeImagesUpload,
    creativeController.createCreativeweek
  );

router.route("/getallcreativeweek").get(creativeController.getCreativeWeek);

router
  .route("/getcreativeweek/:id")
  .get(validateMongoId("id"), creativeController.getCreativeWeekById);

router
  .route("/updatecreativeweek/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    creativeImagesUpload,
    creativeController.updateCreativeWeek
  );

router
  .route("/deletecreativeweek/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    creativeController.deleteCreativeweek
  );

module.exports = router;
