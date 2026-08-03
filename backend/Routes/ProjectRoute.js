const express = require("express");
const router = express.Router();
const { projectsUpload } = require("../multerconfig/Storageconfig");
const projectController = require("../Controllers/ProjectController");
const { canManageContent } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(canManageContent, projectsUpload.array("images", 10), projectController.createProject);

router
  .route("/:id")
  .get(projectController.getSingleProject)
  .put(canManageContent, projectsUpload.array("images", 10), projectController.updateProject)
  .delete(canManageContent, projectController.deleteProject);

module.exports = router;
