const asyncHandler = require("express-async-handler");
const Event = require("../Models/EventSchema");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

// GET /api/v1/events
const getAllEvents = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Event,
    req,
    searchFields: ["title", "date", "description"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Fetched all upcoming events", {
    total: result.total,
    pagination: result.pagination,
    events: result.items,
    data: result.items,
  });
});

// POST /api/v1/events
const createEvent = asyncHandler(async (req, res) => {
  const { title, date, description, des } = req.body;
  const eventTitle = title;
  const eventDate = date;
  const eventDes = description || des || "";

  if (!eventTitle || !eventDate) {
    return ApiResponse.error(res, 400, "Event title and date are required");
  }

  const event = new Event({ title: eventTitle, date: eventDate, description: eventDes });
  await event.save();
  return ApiResponse.success(res, 201, "Upcoming event created successfully", event);
});

// PUT /api/v1/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, description, des } = req.body;
  const event = await Event.findById(id);

  if (!event) {
    return ApiResponse.error(res, 404, "Event not found");
  }

  if (title) event.title = title;
  if (date) event.date = date;
  if (description !== undefined || des !== undefined) {
    event.description = description || des || "";
  }

  await event.save();
  return ApiResponse.success(res, 200, "Event updated successfully", event);
});

// DELETE /api/v1/events/:id
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    return ApiResponse.error(res, 404, "Event not found");
  }
  return ApiResponse.success(res, 200, "Event deleted successfully");
});

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent };
