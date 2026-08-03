const Notice = require("../Models/NoticeSchema");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

const safeUnlink = (relativePath) => {
  if (!relativePath) return;
  const filePath = path.normalize(path.join(__dirname, "..", relativePath));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file at ${filePath}:`, err.message);
    }
  }
};

// Create a new notice
const createNotice = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 400, "Notice image is required.");
  }

  const image = req.file.path;
  const isActive = req.body.isActive === undefined ? true : String(req.body.isActive) === "true";
  const newNotice = new Notice({ images: image, isActive });
  await newNotice.save();

  return ApiResponse.success(res, 201, "Notice created successfully", newNotice);
});

// Get all notices
const getNotices = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Notice,
    req,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Notices fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    notices: result.items,
    data: result.items,
  });
});

// Get single notice
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return ApiResponse.error(res, 404, "Notice not found.");
  }
  return ApiResponse.success(res, 200, "Notice fetched successfully", { notice, data: notice });
});

// Update a notice
const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return ApiResponse.error(res, 404, "Notice not found.");
  }

  if (req.file) {
    safeUnlink(notice.images);
    notice.images = req.file.path;
  }

  if (req.body.isActive !== undefined) {
    notice.isActive = String(req.body.isActive) === "true";
  }

  await notice.save();
  return ApiResponse.success(res, 200, "Notice updated successfully", { notice, data: notice });
});

// Toggle active status
const toggleNoticeStatus = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return ApiResponse.error(res, 404, "Notice not found.");
  }

  notice.isActive = !notice.isActive;
  await notice.save();
  return ApiResponse.success(res, 200, `Notice status changed to ${notice.isActive ? 'Active' : 'Inactive'}`, notice);
});

// Delete a notice
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    return ApiResponse.error(res, 404, "Notice not found.");
  }

  safeUnlink(notice.images);
  return ApiResponse.success(res, 200, "Notice deleted successfully");
});


// contact handler
const contactHandler = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
      pass: process.env.EMAIL_PASS || "pnvh gmbs hzrd wdzc",
    },
  });

  const smailOptions = {
    to: process.env.ADMIN_EMAIL || "sahaniranzeth877@gmail.com",
    subject: "Message from website",
    html: `
      <h1>Message Details</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  const rmailOptions = {
    from: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
    to: email,
    subject: "Thank You for Contacting Us!",
    html: `
      <h1>We’ve Received Your Message</h1>
      <p>Hello ${name},</p>
      <p>We have received your message and will get back to you shortly.</p>
    `,
  };

  await transporter.sendMail(smailOptions);
  await transporter.sendMail(rmailOptions);

  return ApiResponse.success(res, 200, "Contact message sent successfully");
});

// Newsletter handler
const NewsLetter = asyncHandler(async (req, res) => {
  const { email, name, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
      pass: process.env.EMAIL_PASS || "pnvh gmbs hzrd wdzc",
    },
  });

  const smailOptions = {
    to: process.env.ADMIN_EMAIL || "sahaniranzeth877@gmail.com",
    subject: "New Newsletter Subscription",
    html: `
      <h1>New Newsletter Subscription</h1>
      <p><strong>Name:</strong> ${name || "Subscriber"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message || "No message provided"}</p>
    `,
  };

  const rmailOptions = {
    from: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
    to: email,
    subject: "Thank You for Subscribing!",
    html: `
      <h1>Subscription Confirmed</h1>
      <p>Hello ${name || "Subscriber"},</p>
      <p>Thank you for subscribing to our newsletter! We'll keep you updated.</p>
    `,
  };

  await transporter.sendMail(smailOptions);
  await transporter.sendMail(rmailOptions);

  return ApiResponse.success(res, 200, "Newsletter subscription successful");
});

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  toggleNoticeStatus,
  deleteNotice,
  contactHandler,
  NewsLetter,
};

