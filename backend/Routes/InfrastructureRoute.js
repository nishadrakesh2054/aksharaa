const express = require("express");
const router = express.Router();
const { infrastructureUpload } = require("../multerconfig/Storageconfig");
const infrastructureController = require("../Controllers/InfrastructureController");
const { canManageContent } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(infrastructureController.getAllInfrastructure)
  .post(canManageContent, infrastructureUpload.array("images", 5), infrastructureController.createInfrastructure);

router
  .route("/:id")
  .get(infrastructureController.getInfrastructureById)
  .put(canManageContent, infrastructureUpload.array("images", 5), infrastructureController.updateInfrastructure)
  .delete(canManageContent, infrastructureController.deleteInfrastructure);

module.exports = router;
