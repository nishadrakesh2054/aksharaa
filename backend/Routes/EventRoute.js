const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/EventController");
const { canManageAdmissions, canDelete } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(canManageAdmissions, eventController.createEvent);

router
  .route("/:id")
  .put(canManageAdmissions, eventController.updateEvent)
  .delete(canDelete, eventController.deleteEvent);

module.exports = router;
