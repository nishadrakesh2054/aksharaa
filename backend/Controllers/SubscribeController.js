const asyncHandler = require("express-async-handler");
const Subscribe = require("../Models/SubscribeSchema");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const {
  createTransporter,
  escapeHtml,
  getSubmittedAt,
  renderEmailLayout,
  renderInfoRows,
  sendMailWithLog,
} = require("../utils/mailService");
const { paginatedFind } = require("../utils/queryFeatures");

// POST /api/v1/subscribe - Public newsletter subscription
const createSubscription = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return ApiResponse.error(res, 400, "Email address is required");
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = await Subscribe.findOne({ email: cleanEmail });
  const isExistingSubscriber = Boolean(existing);
  const subscription =
    existing ||
    new Subscribe({
      email: cleanEmail,
      isRead: false,
      status: "active",
    });

  if (!existing) {
    await subscription.save();
  }

  const mailDelivery = {
    adminAccepted: [],
    adminRejected: [],
    subscriberAccepted: [],
    subscriberRejected: [],
  };

  try {
    const { transporter, senderEmail, adminEmail } = createTransporter();
    const submittedAt = getSubmittedAt();
    const safeEmail = escapeHtml(cleanEmail);
    const safeSubmittedAt = escapeHtml(submittedAt);

    const subscriberMailOptions = {
      from: `"Aksharaa School" <${senderEmail}>`,
      to: cleanEmail,
      bcc: adminEmail,
      replyTo: adminEmail,
      subject: "Welcome to Aksharaa School updates",
      text: `Thank you for subscribing to Aksharaa School updates.\n\nSubscribed email: ${cleanEmail}\nStatus: ${isExistingSubscriber ? "Already subscribed" : "New subscription"}\nSubmitted on: ${submittedAt}\n\nWarm regards,\nAksharaa School`,
      html: renderEmailLayout({
        eyebrow: "Aksharaa School",
        title: isExistingSubscriber ? "You are already subscribed" : "Thank you for subscribing",
        intro: isExistingSubscriber
          ? "Good news, this email is already subscribed to Aksharaa School updates."
          : "You are now subscribed to Aksharaa School updates. We will share important notices, news, and school highlights with you.",
        content: `
          ${renderInfoRows([
    ["Email", safeEmail],
    ["Status", isExistingSubscriber ? "Already subscribed" : "New subscription"],
    ["Submitted", safeSubmittedAt],
  ])}
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">Warm regards,<br /><strong>Aksharaa School</strong></p>
        `,
        footer: "This is an automatic confirmation from the Aksharaa School newsletter form.",
      }),
    };

    const adminMailOptions = {
      from: `"Aksharaa School Website" <${senderEmail}>`,
      to: adminEmail,
      replyTo: cleanEmail,
      subject: isExistingSubscriber ? "Newsletter subscription submitted again" : "New newsletter subscriber",
      text: `Newsletter subscription submission\n\nEmail: ${cleanEmail}\nStatus: ${isExistingSubscriber ? "Already subscribed" : "New subscription"}\nSubmitted: ${submittedAt}`,
      html: renderEmailLayout({
        eyebrow: "Newsletter Subscription",
        title: isExistingSubscriber ? "Existing subscriber submitted again" : "New newsletter subscriber",
        intro: "A visitor submitted the Aksharaa School newsletter form from the website footer.",
        content: renderInfoRows([
          ["Email", `<a href="mailto:${safeEmail}" style="color:#0f6b3d;text-decoration:none;font-weight:700;">${safeEmail}</a>`],
          ["Status", isExistingSubscriber ? "Already subscribed" : "New subscription"],
          ["Submitted", safeSubmittedAt],
        ]),
        footer: "This message was sent from the Aksharaa School newsletter subscription form.",
      }),
    };

    const adminInfo = await sendMailWithLog(transporter, adminMailOptions, "Admin newsletter subscription");
    mailDelivery.adminAccepted = adminInfo.accepted || [];
    mailDelivery.adminRejected = adminInfo.rejected || [];

    const subscriberInfo = await sendMailWithLog(
      transporter,
      subscriberMailOptions,
      "Subscriber newsletter confirmation"
    );
    mailDelivery.subscriberAccepted = subscriberInfo.accepted || [];
    mailDelivery.subscriberRejected = subscriberInfo.rejected || [];
  } catch (emailErr) {
    console.error("Newsletter subscription email dispatch error:", emailErr.message);
    throw new ApiError(502, "You were subscribed, but the confirmation email could not be sent. Please try again later.");
  }

  return ApiResponse.success(
    res,
    isExistingSubscriber ? 200 : 201,
    isExistingSubscriber
      ? "You are already subscribed to our newsletter! A confirmation email has been sent."
      : "Thank you for subscribing to our newsletter! A confirmation email has been sent.",
    { subscription, mailDelivery }
  );
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
