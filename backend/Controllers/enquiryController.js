const asyncHandler = require("express-async-handler");
const Enquiry = require("../Models/enquirySchema");
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

// POST /api/v1/enquiry - Public Online Admission & Enquiry Submission
const postEnquiry = asyncHandler(async (req, res) => {
  const {
    studentName,
    studentNameNepali,
    studentAge,
    dob,
    nationality,
    studentGender,
    studentGrade,
    studentAddress,
    parentName,
    parentEmail,
    parentPhone,
    phone,
    fatherName,
    fatherPhone,
    motherName,
    motherPhone,
    guardianName,
    parentOccupation,
    occupation,
    parentAddress,
    previousSchool,
    previousGrade,
    previousGPA,
    transportation,
    knowAboutUs,
    source,
  } = req.body;

  // Anti-Spam protection filter
  if (
    /hacker/i.test(studentName || "") ||
    /hacker/i.test(parentName || "") ||
    /hacker/i.test(parentEmail || "")
  ) {
    return ApiResponse.error(res, 400, "Invalid application data submitted.");
  }

  if (!studentName || !parentEmail) {
    return ApiResponse.error(res, 400, "Student Name and Parent Email are required.");
  }

  const phoneNum = phone || parentPhone || fatherPhone || motherPhone || "N/A";
  const occ = occupation || parentOccupation || "N/A";
  const src = source || knowAboutUs || "Website";
  const isTransport =
    transportation === true ||
    transportation === "true" ||
    transportation === "yes";

  // Process uploaded document photos (up to 8 photo fields)
  let studentPhotoPath = "";
  let birthCertPath = "";
  let fatherPhotoPath = "";
  let motherPhotoPath = "";
  let guardianPhotoPath = "";
  let markSheetPath = "";
  let tcPath = "";
  let citizenshipPath = "";
  const docsList = [];

  if (req.files) {
    if (req.files.studentPhoto && req.files.studentPhoto[0]) {
      studentPhotoPath = req.files.studentPhoto[0].path;
      docsList.push(studentPhotoPath);
    }
    if (req.files.birthCertificate && req.files.birthCertificate[0]) {
      birthCertPath = req.files.birthCertificate[0].path;
      docsList.push(birthCertPath);
    }
    if (req.files.fatherPhoto && req.files.fatherPhoto[0]) {
      fatherPhotoPath = req.files.fatherPhoto[0].path;
      docsList.push(fatherPhotoPath);
    }
    if (req.files.motherPhoto && req.files.motherPhoto[0]) {
      motherPhotoPath = req.files.motherPhoto[0].path;
      docsList.push(motherPhotoPath);
    }
    if (req.files.guardianPhoto && req.files.guardianPhoto[0]) {
      guardianPhotoPath = req.files.guardianPhoto[0].path;
      docsList.push(guardianPhotoPath);
    }
    if (req.files.previousMarksheet && req.files.previousMarksheet[0]) {
      markSheetPath = req.files.previousMarksheet[0].path;
      docsList.push(markSheetPath);
    }
    if (req.files.transferCertificate && req.files.transferCertificate[0]) {
      tcPath = req.files.transferCertificate[0].path;
      docsList.push(tcPath);
    }
    if (req.files.citizenshipDoc && req.files.citizenshipDoc[0]) {
      citizenshipPath = req.files.citizenshipDoc[0].path;
      docsList.push(citizenshipPath);
    }
  }

  const enquiry = new Enquiry({
    studentName,
    studentNameNepali: studentNameNepali || "",
    studentAge: Number(studentAge) || 0,
    dob: dob || "",
    nationality: nationality || "Nepali",
    studentGender: studentGender || "Male",
    studentGrade: studentGrade || "Grade 1",
    studentAddress: studentAddress || "Kathmandu",
    parentName: parentName || "N/A",
    parentEmail,
    phone: phoneNum,
    fatherName: fatherName || "",
    fatherPhone: fatherPhone || "",
    motherName: motherName || "",
    motherPhone: motherPhone || "",
    guardianName: guardianName || "",
    occupation: occ,
    parentAddress: parentAddress || studentAddress || "",
    previousSchool: previousSchool || "",
    previousGrade: previousGrade || "",
    previousGPA: previousGPA || "",
    transportation: isTransport,
    source: src,
    studentPhoto: studentPhotoPath,
    birthCertificate: birthCertPath,
    fatherPhoto: fatherPhotoPath,
    motherPhoto: motherPhotoPath,
    guardianPhoto: guardianPhotoPath,
    previousMarksheet: markSheetPath,
    transferCertificate: tcPath,
    citizenshipDoc: citizenshipPath,
    documents: docsList,
    isRead: false,
  });

  await enquiry.save();

  try {
    const { transporter, senderEmail, adminEmail } = createTransporter();
    const submittedAt = getSubmittedAt();
    const safeStudentName = escapeHtml(studentName);
    const safeParentName = escapeHtml(parentName || "N/A");
    const safeParentEmail = escapeHtml(parentEmail);
    const safePhone = escapeHtml(phoneNum);
    const safeGrade = escapeHtml(studentGrade || "N/A");
    const safeSource = escapeHtml(src);
    const safeTransportation = isTransport ? "Yes" : "No";
    const safeSubmittedAt = escapeHtml(submittedAt);
    const documentsText = docsList.length > 0 ? `${docsList.length} document(s) uploaded` : "No documents uploaded";
    const safeDocumentsText = escapeHtml(documentsText);

    const parentMailOptions = {
      from: `"Aksharaa School" <${senderEmail}>`,
      to: parentEmail,
      replyTo: adminEmail,
      subject: "We received your admission enquiry - Aksharaa School",
      text: `Dear ${parentName || "Parent"},\n\nThank you for submitting an admission enquiry for ${studentName}. Our admissions team will review the details and contact you shortly.\n\nStudent: ${studentName}\nGrade: ${studentGrade || "N/A"}\nPhone: ${phoneNum}\nSubmitted: ${submittedAt}\n\nWarm regards,\nAksharaa School`,
      html: renderEmailLayout({
        eyebrow: "Aksharaa Admissions",
        title: "Admission enquiry received",
        intro: `Dear ${safeParentName},<br />Thank you for submitting an admission enquiry for <strong>${safeStudentName}</strong>. Our admissions team will review the details and contact you shortly.`,
        content: `
          ${renderInfoRows([
    ["Student", safeStudentName],
    ["Grade", safeGrade],
    ["Parent Email", safeParentEmail],
    ["Phone", safePhone],
    ["Transportation", safeTransportation],
    ["Submitted", safeSubmittedAt],
  ])}
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">Warm regards,<br /><strong>Aksharaa School Admissions</strong></p>
        `,
        footer: "This is an automatic confirmation from the Aksharaa School admission form.",
      }),
    };

    const adminMailOptions = {
      from: `"Aksharaa School Website" <${senderEmail}>`,
      to: adminEmail,
      replyTo: parentEmail,
      subject: `New admission enquiry: ${studentName}`,
      text: `New admission enquiry\n\nStudent: ${studentName}\nParent: ${parentName || "N/A"}\nEmail: ${parentEmail}\nPhone: ${phoneNum}\nGrade: ${studentGrade || "N/A"}\nAddress: ${studentAddress || "N/A"}\nTransportation: ${safeTransportation}\nSource: ${src}\nDocuments: ${documentsText}\nSubmitted: ${submittedAt}`,
      html: renderEmailLayout({
        eyebrow: "New Admission Enquiry",
        title: "New admission enquiry submitted",
        intro: "A new admission enquiry/application was submitted from the Aksharaa School website.",
        content: `
          ${renderInfoRows([
    ["Student", safeStudentName],
    ["Parent", safeParentName],
    ["Email", `<a href="mailto:${safeParentEmail}" style="color:#0f6b3d;text-decoration:none;font-weight:700;">${safeParentEmail}</a>`],
    ["Phone", safePhone],
    ["Grade", safeGrade],
    ["Address", escapeHtml(studentAddress || "N/A")],
    ["Transportation", safeTransportation],
    ["Source", safeSource],
    ["Documents", safeDocumentsText],
    ["Submitted", safeSubmittedAt],
  ])}
          <a href="mailto:${safeParentEmail}?subject=Re:%20Admission%20Enquiry%20-%20${encodeURIComponent(studentName)}" style="display:inline-block;padding:12px 18px;background:#0f6b3d;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Reply to ${safeParentName}</a>
        `,
        footer: "This message was sent from the Aksharaa School admission/enquiry form.",
      }),
    };

    await sendMailWithLog(transporter, adminMailOptions, "Admin admission enquiry");
    await sendMailWithLog(transporter, parentMailOptions, "Parent admission confirmation");
  } catch (emailErr) {
    console.error("Admission enquiry email dispatch error:", emailErr.message);
    throw new ApiError(502, "Your application was saved, but the email could not be sent. Please try again later.");
  }

  return ApiResponse.success(
    res,
    201,
    "Online admission application submitted successfully. A confirmation email has been sent.",
    enquiry
  );
});

// GET /api/v1/enquiry - Admin Directory Fetch
const getEnquiry = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }
  const result = await paginatedFind({
    model: Enquiry,
    req,
    filter,
    searchFields: ["studentName", "parentName", "parentEmail", "phone", "studentGrade", "source"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Fetched all admission enquiries", {
    total: result.total,
    pagination: result.pagination,
    enquiries: result.items,
    data: result.items,
  });
});

// PUT /api/v1/enquiry/status/:id - Toggle Read Status
const toggleEnquiryReadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    return ApiResponse.error(res, 404, "Application record not found");
  }
  enquiry.isRead = !enquiry.isRead;
  await enquiry.save();
  return ApiResponse.success(res, 200, `Marked application as ${enquiry.isRead ? 'read' : 'unread'}`, enquiry);
});

// DELETE /api/v1/enquiry/:id - Delete Application
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enquiry = await Enquiry.findByIdAndDelete(id);
  if (!enquiry) {
    return ApiResponse.error(res, 404, "Application record not found");
  }
  return ApiResponse.success(res, 200, "Application deleted successfully");
});

module.exports = {
  postEnquiry,
  getEnquiry,
  toggleEnquiryReadStatus,
  deleteEnquiry,
};
