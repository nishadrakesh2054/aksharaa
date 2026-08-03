const PDF = require("../Models/PdfSchema");
const asyncHandler = require("express-async-handler");
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

// Create a new PDF
const createPDF = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    return ApiResponse.error(res, 400, "PDF document file is required.");
  }
  if (!title || !title.trim()) {
    return ApiResponse.error(res, 400, "PDF title is required.");
  }

  const filePath = req.file.path;
  const newPDF = new PDF({
    title: title.trim(),
    filePath: filePath,
  });

  await newPDF.save();
  return ApiResponse.success(res, 201, "PDF document created successfully", newPDF);
});

// Get all PDFs
const getAllPDF = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: PDF,
    req,
    searchFields: ["title"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "PDF documents retrieved successfully", {
    total: result.total,
    pagination: result.pagination,
    pdfs: result.items,
    data: result.items,
  });
});

// Get single PDF
const getPDFById = asyncHandler(async (req, res) => {
  const pdfDoc = await PDF.findById(req.params.id);
  if (!pdfDoc) {
    return ApiResponse.error(res, 404, "PDF document not found.");
  }
  return ApiResponse.success(res, 200, "PDF document retrieved successfully", { pdf: pdfDoc, data: pdfDoc });
});

// Update a PDF
const updatePDF = asyncHandler(async (req, res) => {
  const pdfDoc = await PDF.findById(req.params.id);
  if (!pdfDoc) {
    return ApiResponse.error(res, 404, "PDF document not found.");
  }

  const { title } = req.body;
  if (title && title.trim()) {
    pdfDoc.title = title.trim();
  }

  if (req.file) {
    safeUnlink(pdfDoc.filePath);
    pdfDoc.filePath = req.file.path;
  }

  await pdfDoc.save();
  return ApiResponse.success(res, 200, "PDF document updated successfully", { pdf: pdfDoc, data: pdfDoc });
});

// Delete a PDF
const deletePDF = asyncHandler(async (req, res) => {
  const pdfDoc = await PDF.findByIdAndDelete(req.params.id);
  if (!pdfDoc) {
    return ApiResponse.error(res, 404, "PDF document not found.");
  }

  safeUnlink(pdfDoc.filePath);
  return ApiResponse.success(res, 200, "PDF document deleted successfully");
});

module.exports = { createPDF, getAllPDF, getPDFById, updatePDF, deletePDF };
