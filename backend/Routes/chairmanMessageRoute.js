const express = require("express");
const router = express.Router();
const chairmanMessageController = require("../Controllers/chairmanMessageController");
const { chairmanUpload } = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

const uploadChairmanImage = chairmanUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "chairmanImage", maxCount: 1 },
]);

const extractFile = (req, res, next) => {
  if (req.files) {
    req.file =
      (req.files.image && req.files.image[0]) ||
      (req.files.chairmanImage && req.files.chairmanImage[0]) ||
      null;
  }
  next();
};

router
  .route("/")
  .get(chairmanMessageController.getAllChairmanMessages)
  .post(canManageContent, uploadChairmanImage, extractFile, chairmanMessageController.createChairmanMessage);

router
  .route("/:id")
  .get(validateMongoId("id"), chairmanMessageController.getChairmanMessageById)
  .put(
    canManageContent,
    validateMongoId("id"),
    uploadChairmanImage,
    extractFile,
    chairmanMessageController.updateChairmanMessageById
  )
  .delete(canManageContent, validateMongoId("id"), chairmanMessageController.deleteChairmanMessageById);

module.exports = router;
