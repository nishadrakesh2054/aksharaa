const express = require("express");
const router = express.Router();
const blogcontroller = require("../Controllers/BlogController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateMongoId } = require("../validators/commonValidator");

// Multer middleware wrapper to support 'Blogimage', 'blogimage', or 'image'
const uploadBlogImage = upload.blogUpload.fields([
  { name: "Blogimage", maxCount: 1 },
  { name: "blogimage", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

const extractFile = (req, res, next) => {
  if (req.files) {
    req.file =
      (req.files.Blogimage && req.files.Blogimage[0]) ||
      (req.files.blogimage && req.files.blogimage[0]) ||
      (req.files.image && req.files.image[0]) ||
      null;
  }
  next();
};

router
  .route("/")
  .get(blogcontroller.getAllBlogs)
  .post(canManageContent, uploadBlogImage, extractFile, blogcontroller.createBlog);

router
  .route("/createblog")
  .post(canManageContent, uploadBlogImage, extractFile, blogcontroller.createBlog);

router
  .route("/:id/reupload")
  .post(
    canManageContent,
    validateMongoId("id"),
    uploadBlogImage,
    extractFile,
    blogcontroller.reuploadImage
  );

router
  .route("/:id")
  .get(validateMongoId("id"), blogcontroller.getBlogById)
  .put(
    canManageContent,
    validateMongoId("id"),
    uploadBlogImage,
    extractFile,
    blogcontroller.updateBlogById
  )
  .delete(canManageContent, validateMongoId("id"), blogcontroller.deleteBlogById);

router
  .route("/deleteallblogs")
  .delete(canManageContent, blogcontroller.deleteAllBlogs);

module.exports = router;

