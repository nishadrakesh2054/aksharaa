const express = require("express");
const router = express.Router();
const { partnerUpload } = require("../multerconfig/Storageconfig");
const partnerController = require("../Controllers/PartnerController");
const { canManageContent } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(partnerController.getPartners)
  .post(canManageContent, partnerUpload.single("logo"), partnerController.createPartner);

router
  .route("/:id")
  .get(partnerController.getPartnerById)
  .put(canManageContent, partnerUpload.single("logo"), partnerController.updatePartner)
  .delete(canManageContent, partnerController.deletePartner);

module.exports = router;
