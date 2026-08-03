const express = require("express");
const router = express.Router();
const pdfController = require("../Controllers/pdfController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/uploadpdf")
  .post(
    canManageContent,
    upload.pdfUpload.single("pdfFile"),
    pdfController.createPDF
  );

router.route("/getallpdf").get(pdfController.getAllPDF);

router
  .route("/getpdf/:id")
  .get(validateMongoId("id"), pdfController.getPDFById);

router
  .route("/updatepdf/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.pdfUpload.single("pdfFile"),
    pdfController.updatePDF
  );

router
  .route("/deletepdf/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    pdfController.deletePDF
  );

module.exports = router;
