const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentNameNepali: {
      type: String,
      default: "",
    },
    studentAge: {
      type: Number,
      default: 0,
    },
    dob: {
      type: String,
      default: "",
    },
    nationality: {
      type: String,
      default: "Nepali",
    },
    studentGender: {
      type: String,
      default: "Male",
    },
    studentGrade: {
      type: String,
      required: true,
    },
    studentAddress: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      default: "",
    },
    fatherPhone: {
      type: String,
      default: "",
    },
    motherName: {
      type: String,
      default: "",
    },
    motherPhone: {
      type: String,
      default: "",
    },
    guardianName: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "N/A",
    },
    parentAddress: {
      type: String,
      default: "",
    },
    previousSchool: {
      type: String,
      default: "",
    },
    previousGrade: {
      type: String,
      default: "",
    },
    previousGPA: {
      type: String,
      default: "",
    },
    transportation: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "Website",
    },
    // Document Upload Photo Paths (Up to 8 document photos)
    studentPhoto: { type: String, default: "" },
    birthCertificate: { type: String, default: "" },
    fatherPhoto: { type: String, default: "" },
    motherPhoto: { type: String, default: "" },
    guardianPhoto: { type: String, default: "" },
    previousMarksheet: { type: String, default: "" },
    transferCertificate: { type: String, default: "" },
    citizenshipDoc: { type: String, default: "" },
    documents: { type: [String], default: [] },

    isRead: {
      type: Boolean,
      default: false,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ isRead: 1, createdAt: -1 });
enquirySchema.index({ source: 1, createdAt: -1 });
enquirySchema.index({
  studentName: "text",
  parentName: "text",
  parentEmail: "text",
  phone: "text",
  studentGrade: "text",
  source: "text",
});

const enquiryModel = mongoose.model("Enquiry", enquirySchema);
module.exports = enquiryModel;
