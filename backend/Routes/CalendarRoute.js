const express = require("express");
const router = express.Router();
const calendarController = require("../Controllers/CalendarController");
const { canManageAdmissions, canDelete } = require("../middleware/AuthMiddleware");

router
  .route("/")
  .get(calendarController.getAllCalendarEntries)
  .post(canManageAdmissions, calendarController.createCalendarEntry);

router
  .route("/:id")
  .put(canManageAdmissions, calendarController.updateCalendarEntry)
  .delete(canDelete, calendarController.deleteCalendarEntry);

module.exports = router;
