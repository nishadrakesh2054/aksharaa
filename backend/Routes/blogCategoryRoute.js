const express = require("express");
const router = express.Router();
const { canManageContent } = require("../middleware/AuthMiddleware");
const categoryController = require("../Controllers/BlogCategoryController");
const { validateCreateCategory } = require("../validators/categoryValidator");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/")
  .post(
    canManageContent,
    validateCreateCategory,
    categoryController.createCategory
  );

router.route("/").get(categoryController.getCategories);

router
  .route("/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    validateCreateCategory,
    categoryController.updateCategory
  )
  .delete(
    canManageContent,
    validateMongoId("id"),
    categoryController.deleteCategory
  );

module.exports = router;
