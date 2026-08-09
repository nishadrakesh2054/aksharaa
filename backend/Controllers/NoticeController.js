const Notice = require("../Models/NoticeSchema");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const ApiResponse = require("../utils/apiResponse");
const {
  createTransporter,
  escapeHtml,
  getSubmittedAt,
  renderEmailLayout,
  renderInfoRows,
  renderMessage,
  sendMailWithLog,
} = require("../utils/mailService");
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
  const { name, email, phone, subject, message } = req.body;
  const { transporter, senderEmail, adminEmail } = createTransporter();
  const submittedAt = getSubmittedAt();
  const mailSubject = subject || "General Inquiry";
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "N/A");
  const safeSubject = escapeHtml(mailSubject);
  const safeSubmittedAt = escapeHtml(submittedAt);
  const safeMessage = renderMessage(message);

  const messageBox = `
    <div style="margin:0 0 24px;padding:18px 20px;background:#f8fbf9;border:1px solid #dfeae3;border-radius:10px;">
      <div style="margin:0 0 8px;color:#0f6b3d;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;">Message</div>
      <div style="font-size:15px;line-height:1.75;color:#25312b;">${safeMessage}</div>
    </div>
  `;

  const adminMailOptions = {
    from: `"Aksharaa School Website" <${senderEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: `New contact form message: ${mailSubject}`,
    text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nSubject: ${mailSubject}\nSubmitted: ${submittedAt}\n\nMessage:\n${message}`,
    html: renderEmailLayout({
      eyebrow: "New Website Inquiry",
      title: "New contact form submission",
      intro: "A new message was submitted from the Aksharaa School contact page.",
      content: `
        ${renderInfoRows([
    ["Name", safeName],
    ["Email", `<a href="mailto:${safeEmail}" style="color:#0f6b3d;text-decoration:none;font-weight:700;">${safeEmail}</a>`],
    ["Phone", safePhone],
    ["Subject", safeSubject],
    ["Submitted", safeSubmittedAt],
  ])}
        ${messageBox}
      `,
      footer: "This message was sent from the Aksharaa School contact form.",
    }),
  };

  const userMailOptions = {
    from: `"Aksharaa School" <${senderEmail}>`,
    to: email,
    replyTo: adminEmail,
    subject: "We received your message - Aksharaa School",
    text: `Dear ${name},\n\nThank you for contacting Aksharaa School. We received your message and will get back to you shortly.\n\nSubject: ${mailSubject}\n\nWarm regards,\nAksharaa School`,
    html: renderEmailLayout({
      eyebrow: "Aksharaa School",
      title: "Thank you for contacting us",
      intro: `Dear ${safeName},<br />We have received your message and our team will get back to you as soon as possible.`,
      content: `
        ${renderInfoRows([
    ["Subject", safeSubject],
    ["Phone", safePhone],
    ["Email", safeEmail],
    ["Submitted", safeSubmittedAt],
  ])}
        ${messageBox}
      `,
      footer: "This is an automatic confirmation from the Aksharaa School contact form.",
    }),
  };

  await sendMailWithLog(transporter, adminMailOptions, "Legacy admin contact");
  await sendMailWithLog(transporter, userMailOptions, "Legacy user contact confirmation");

  return ApiResponse.success(res, 200, "Contact message sent successfully");
});

// Newsletter handler
const NewsLetter = asyncHandler(async (req, res) => {
  const { email, name, message } = req.body;
  const { transporter, senderEmail, adminEmail } = createTransporter();
  const submittedAt = getSubmittedAt();
  const safeName = escapeHtml(name || "Subscriber");
  const safeEmail = escapeHtml(email);
  const safeMessage = renderMessage(message || "No message provided");
  const safeSubmittedAt = escapeHtml(submittedAt);

  const adminMailOptions = {
    from: `"Aksharaa School Website" <${senderEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: "Newsletter subscription submitted",
    text: `Newsletter subscription submission\n\nName: ${name || "Subscriber"}\nEmail: ${email}\nSubmitted: ${submittedAt}\nMessage: ${message || "No message provided"}`,
    html: renderEmailLayout({
      eyebrow: "Newsletter Subscription",
      title: "Newsletter form submitted",
      intro: "A visitor submitted the Aksharaa School newsletter form.",
      content: `
        ${renderInfoRows([
    ["Name", safeName],
    ["Email", `<a href="mailto:${safeEmail}" style="color:#0f6b3d;text-decoration:none;font-weight:700;">${safeEmail}</a>`],
    ["Submitted", safeSubmittedAt],
  ])}
        <div style="margin:0 0 24px;padding:18px 20px;background:#f8fbf9;border:1px solid #dfeae3;border-radius:10px;">
          <div style="margin:0 0 8px;color:#0f6b3d;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;">Message</div>
          <div style="font-size:15px;line-height:1.75;color:#25312b;">${safeMessage}</div>
        </div>
      `,
      footer: "This message was sent from the Aksharaa School newsletter form.",
    }),
  };

  const userMailOptions = {
    from: `"Aksharaa School" <${senderEmail}>`,
    to: email,
    replyTo: adminEmail,
    subject: "Thank you for subscribing - Aksharaa School",
    text: `Dear ${name || "Subscriber"},\n\nThank you for subscribing to Aksharaa School updates.\n\nWarm regards,\nAksharaa School`,
    html: renderEmailLayout({
      eyebrow: "Aksharaa School",
      title: "Thank you for subscribing",
      intro: `Dear ${safeName},<br />Thank you for subscribing to Aksharaa School updates.`,
      content: renderInfoRows([
        ["Email", safeEmail],
        ["Submitted", safeSubmittedAt],
      ]),
      footer: "This is an automatic confirmation from the Aksharaa School newsletter form.",
    }),
  };

  await sendMailWithLog(transporter, adminMailOptions, "Legacy admin newsletter");
  await sendMailWithLog(transporter, userMailOptions, "Legacy user newsletter confirmation");

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
