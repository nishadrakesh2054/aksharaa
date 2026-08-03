const asyncHandler = require("express-async-handler");
const Calendar = require("../Models/CalendarSchema");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

// GET /api/v1/calendar
const getAllCalendarEntries = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Calendar,
    req,
    searchFields: ["monthYear", "events"],
    useTextSearch: true,
    defaultSort: { createdAt: 1 },
  });
  return ApiResponse.success(res, 200, "Fetched all calendar schedules", {
    total: result.total,
    pagination: result.pagination,
    calendar: result.items,
    data: result.items,
  });
});

// POST /api/v1/calendar
const createCalendarEntry = asyncHandler(async (req, res) => {
  const { monthYear, date, events, event } = req.body;
  const mYear = monthYear || date;
  let eventList = events || event || [];

  if (typeof eventList === "string") {
    eventList = eventList.split("\n").map((e) => e.trim()).filter(Boolean);
  }

  if (!mYear) {
    return ApiResponse.error(res, 400, "Month/Year title is required");
  }

  const calendar = new Calendar({ monthYear: mYear, events: Array.isArray(eventList) ? eventList : [] });
  await calendar.save();
  return ApiResponse.success(res, 201, "Calendar schedule created successfully", calendar);
});

// PUT /api/v1/calendar/:id
const updateCalendarEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { monthYear, date, events, event } = req.body;
  const calendar = await Calendar.findById(id);

  if (!calendar) {
    return ApiResponse.error(res, 404, "Calendar entry not found");
  }

  if (monthYear || date) calendar.monthYear = monthYear || date;
  let eventList = events || event;

  if (typeof eventList === "string") {
    eventList = eventList.split("\n").map((e) => e.trim()).filter(Boolean);
  }

  if (Array.isArray(eventList)) {
    calendar.events = eventList;
  }

  await calendar.save();
  return ApiResponse.success(res, 200, "Calendar schedule updated successfully", calendar);
});

// DELETE /api/v1/calendar/:id
const deleteCalendarEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const calendar = await Calendar.findByIdAndDelete(id);
  if (!calendar) {
    return ApiResponse.error(res, 404, "Calendar entry not found");
  }
  return ApiResponse.success(res, 200, "Calendar schedule deleted successfully");
});

module.exports = {
  getAllCalendarEntries,
  createCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
};
