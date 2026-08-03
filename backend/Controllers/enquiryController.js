const asyncHandler = require("express-async-handler");
const Enquiry = require("../Models/enquirySchema");
const ApiResponse = require("../utils/apiResponse");
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
  return ApiResponse.success(res, 201, "Online admission application submitted successfully", enquiry);
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
