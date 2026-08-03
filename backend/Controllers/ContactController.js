const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const Contact = require("../Models/ContactSchema");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

const contactData = asyncHandler(async (req, res) => {
  const { email, name, phone, subject, message } = req.body;

  // Save to database
  const contactEntry = new Contact({
    name,
    phone,
    email,
    subject: subject || "General Inquiry",
    message,
    isRead: false,
  });
  await contactEntry.save();

  // Send Email notifications asynchronously
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
      pass: process.env.EMAIL_PASS || "pnvh gmbs hzrd wdzc",
    },
  });

  const clientMailOptions = {
    from: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
    to: email,
    subject: "Thank you for contacting Aksharaa School",
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to us. Your message has been received and our team will get back to you shortly.</p>
    `,
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
    to: process.env.ADMIN_EMAIL || "sahaniranzeth877@gmail.com",
    subject: `New Contact Submission: ${subject || "General Inquiry"}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
  } catch (emailErr) {
    console.error("Contact email dispatch error:", emailErr.message);
  }

  return ApiResponse.success(res, 201, "Contact message submitted successfully", contactEntry);
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
