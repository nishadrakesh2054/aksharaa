const asyncHandler = require("express-async-handler");
const Subscribe = require("../Models/SubscribeSchema");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

// POST /api/v1/subscribe - Public newsletter subscription
const createSubscription = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return ApiResponse.error(res, 400, "Email address is required");
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = await Subscribe.findOne({ email: cleanEmail });
  if (existing) {
    return ApiResponse.success(res, 200, "You are already subscribed to our newsletter!", existing);
  }

  const subscription = new Subscribe({
    email: cleanEmail,
    isRead: false,
    status: "active",
  });
  await subscription.save();

  return ApiResponse.success(res, 201, "Thank you for subscribing to our newsletter!", subscription);
});

// GET /api/v1/getallsubscribers - Admin Dashboard
const getAllSubscribers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }
  const result = await paginatedFind({
    model: Subscribe,
    req,
    filter,
    searchFields: ["email", "status"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Fetched all newsletter subscribers", {
    total: result.total,
    pagination: result.pagination,
    subscribers: result.items,
    data: result.items,
  });
});

// PUT /api/v1/subscribe/status/:id - Toggle Read / Unread Status
const toggleSubscriberReadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subscriber = await Subscribe.findById(id);
  if (!subscriber) {
    return ApiResponse.error(res, 404, "Subscriber not found");
  }

  if (typeof req.body.isRead === "boolean") {
    subscriber.isRead = req.body.isRead;
  } else {
    subscriber.isRead = !subscriber.isRead;
  }

  await subscriber.save();
  return ApiResponse.success(
    res,
    200,
    `Subscriber marked as ${subscriber.isRead ? "Read" : "Unread"}`,
    subscriber
  );
});

// DELETE /api/v1/subscribe/:id - Delete Subscriber
const deleteSubscriber = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subscriber = await Subscribe.findByIdAndDelete(id);
  if (!subscriber) {
    return ApiResponse.error(res, 404, "Subscriber not found");
  }
  return ApiResponse.success(res, 200, "Subscriber removed successfully");
});

module.exports = {
  createSubscription,
  getAllSubscribers,
  toggleSubscriberReadStatus,
  deleteSubscriber,
};
