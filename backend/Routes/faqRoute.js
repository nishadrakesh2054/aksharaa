const express = require("express");
const router = express.Router();
const faqController = require("../Controllers/FaqController");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");
const {
  validateCreateFaq,
  validateUpdateFaq,
  validateFaqQuery,
} = require("../validators/faqValidator");

router
  .route("/")
  .get(validateFaqQuery, faqController.getFaqs)
  .post(canManageContent, validateCreateFaq, faqController.createFaq);

router
  .route("/:id")
  .get(validateMongoId("id"), faqController.getFaqById)
  .put(canManageContent, validateMongoId("id"), validateUpdateFaq, faqController.updateFaq)
  .delete(canManageContent, validateMongoId("id"), faqController.deleteFaq);

router
  .route("/toggle-status/:id")
  .patch(canManageContent, validateMongoId("id"), faqController.toggleFaqStatus);

module.exports = router;
