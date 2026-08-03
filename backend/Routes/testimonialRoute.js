const express = require("express");
const router = express.Router();
const testimonialcontroller = require("../Controllers/testimonialController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateCreateTestimonial } = require("../validators/testimonialValidator");
const { validateMongoId } = require("../validators/commonValidator");

// post testimonial
router
  .route("/createtestimonial")
  .post(
    canManageContent,
    upload.testimonialUpload.single("image"),
    validateCreateTestimonial,
    testimonialcontroller.createTestimonial
  );

// get all testimonials
router.route("/").get(testimonialcontroller.getAllTestimonial);

router
  .route("/:id")
  .get(validateMongoId("id"), testimonialcontroller.getTestimonialById)
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.testimonialUpload.single("image"),
    testimonialcontroller.updateTestimonial
  )
  .delete(
    canManageContent,
    validateMongoId("id"),
    testimonialcontroller.deleteTestimonialById
  );

module.exports = router;
