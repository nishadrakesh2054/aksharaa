const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const Contact = require("../Models/ContactSchema");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { paginatedFind } = require("../utils/queryFeatures");

const getMailConfig = () => {
  const senderEmail = process.env.MAIL_USERNAME || process.env.EMAIL_USER || process.env.EMAIL;
  const senderPassword = (process.env.MAIL_PASSWORD || process.env.EMAIL_PASS)?.replace(/\s/g, "");
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailHost = process.env.MAIL_HOST || "smtp.gmail.com";
  const mailPort = Number(process.env.MAIL_PORT) || 587;
  const mailEncryption = (process.env.MAIL_ENCRYPTION || "tls").toLowerCase();

  if (!senderEmail || !senderPassword || !adminEmail) {
    throw new ApiError(
      500,
      "Email service is not configured. Please set MAIL_USERNAME, MAIL_PASSWORD, and ADMIN_EMAIL."
    );
  }

  console.info(
    `Contact mail sender configured: ${senderEmail} via ${mailHost}:${mailPort}/${mailEncryption}, password length ${senderPassword.length}`
  );

  return { senderEmail, senderPassword, adminEmail, mailHost, mailPort, mailEncryption };
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMessage = (message = "") => escapeHtml(message).replace(/\n/g, "<br />");

const renderEmailLayout = ({ title, eyebrow, intro, content, footer }) => `
  <div style="margin:0;padding:0;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <div style="max-width:680px;margin:0 auto;padding:28px 14px;">
      <div style="background:#ffffff;border:1px solid #e0e7e2;border-radius:14px;overflow:hidden;">
        <div style="background:#0f6b3d;padding:26px 30px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;opacity:.86;">${eyebrow}</div>
          <h1 style="margin:8px 0 0;font-size:25px;line-height:1.25;font-weight:700;">${title}</h1>
        </div>
        <div style="padding:30px;">
          <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#374151;">${intro}</p>
          ${content}
        </div>
        <div style="padding:18px 30px;background:#f8faf9;border-top:1px solid #e5ebe7;color:#647067;font-size:12px;line-height:1.6;">
          ${footer}
        </div>
      </div>
    </div>
  </div>
`;

const renderInfoRows = (rows) => `
  <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 22px;">
    ${rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:130px;padding:11px 0;border-bottom:1px solid #edf2ef;color:#6b766f;font-size:13px;font-weight:700;">${label}</td>
          <td style="padding:11px 0;border-bottom:1px solid #edf2ef;color:#1f2933;font-size:14px;">${value}</td>
        </tr>
      `
    )
    .join("")}
  </table>
`;

const contactData = asyncHandler(async (req, res) => {
  const { email, name, phone, subject, message } = req.body;
  const mailSubject = subject || "General Inquiry";

  // Save to database
  const contactEntry = new Contact({
    name,
    phone: phone || "N/A",
    email,
    subject: mailSubject,
    message,
    isRead: false,
  });
  await contactEntry.save();

  const { senderEmail, senderPassword, adminEmail, mailHost, mailPort, mailEncryption } = getMailConfig();
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailEncryption === "ssl" || mailPort === 465,
    requireTLS: mailEncryption === "tls",
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "N/A");
  const safeSubject = escapeHtml(mailSubject);
  const safeMessage = renderMessage(message);
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kathmandu",
  });
  const safeSubmittedAt = escapeHtml(submittedAt);

  const messageBox = `
    <div style="margin:0 0 24px;padding:18px 20px;background:#f8fbf9;border:1px solid #dfeae3;border-radius:10px;">
      <div style="margin:0 0 8px;color:#0f6b3d;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;">Message</div>
      <div style="font-size:15px;line-height:1.75;color:#25312b;">${safeMessage}</div>
    </div>
  `;

  const clientMailOptions = {
    from: `"Aksharaa School" <${senderEmail}>`,
    to: email,
    replyTo: adminEmail,
    subject: "We received your message - Aksharaa School",
    text: `Dear ${name},\n\nThank you for contacting Aksharaa School. We received your message and will get back to you as soon as possible.\n\nSubject: ${mailSubject}\nPhone: ${phone || "N/A"}\nEmail: ${email}\n\nMessage:\n${message}\n\nWarm regards,\nAksharaa School`,
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
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">Warm regards,<br /><strong>Aksharaa School</strong></p>
      `,
      footer: "This is an automatic confirmation from the Aksharaa School contact form.",
    }),
  };

  const adminMailOptions = {
    from: `"Aksharaa School Website" <${senderEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: `New contact inquiry from ${name}`,
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
        <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(mailSubject)}" style="display:inline-block;padding:12px 18px;background:#0f6b3d;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Reply to ${safeName}</a>
      `,
      footer: "This message was sent from the Aksharaa School website contact form.",
    }),
  };

  try {
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.info("Admin contact email accepted:", adminInfo.accepted, "rejected:", adminInfo.rejected);

    const clientInfo = await transporter.sendMail(clientMailOptions);
    console.info("Client contact email accepted:", clientInfo.accepted, "rejected:", clientInfo.rejected);
  } catch (emailErr) {
    console.error("Contact email dispatch error:", emailErr.message);
    throw new ApiError(502, "Your message was saved, but the email could not be sent. Please try again later.");
  }

  return ApiResponse.success(
    res,
    201,
    "Message sent successfully. A confirmation email has been sent to you.",
    contactEntry
  );
});

// GET All Contacts (Admin Dashboard)
const getAllContacts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }
  const result = await paginatedFind({
    model: Contact,
    req,
    filter,
    searchFields: ["name", "phone", "email", "subject", "message"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Fetched all contact messages", {
    total: result.total,
    pagination: result.pagination,
    contacts: result.items,
    data: result.items,
  });
});

// Toggle Read / Unread Status (Admin Dashboard)
const toggleContactReadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return ApiResponse.error(res, 404, "Contact message not found");
  }

  // If specific isRead boolean passed in body, use it; otherwise toggle
  if (typeof req.body.isRead === "boolean") {
    contact.isRead = req.body.isRead;
  } else {
    contact.isRead = !contact.isRead;
  }

  await contact.save();
  return ApiResponse.success(
    res,
    200,
    `Message marked as ${contact.isRead ? "Read" : "Unread"}`,
    contact
  );
});

// DELETE Contact Message (Admin Dashboard)
const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return ApiResponse.error(res, 404, "Contact message not found");
  }
  return ApiResponse.success(res, 200, "Contact message deleted successfully");
});

module.exports = {
  contactData,
  getAllContacts,
  toggleContactReadStatus,
  deleteContact,
};
