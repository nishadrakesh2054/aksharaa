const asyncHandler = require("express-async-handler");
const Testimonial = require("../Models/Testimonial");
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

// Create Testimonial
const createTestimonial = asyncHandler(async (req, res) => {
  const { title, role, parentname, feedback, content } = req.body;

  if (!req.file) {
    return ApiResponse.error(res, 400, "Testimonial image is required.");
  }

  const itemTitle = title || role || "Parent Testimonial";
  const itemParent = parentname || title || "Anonymous";
  const itemFeedback = feedback || content;

  if (!itemFeedback || !itemFeedback.trim()) {
    return ApiResponse.error(res, 400, "Feedback content is required.");
  }

  const image = req.file.path;
  const newTestimonial = new Testimonial({
    title: itemTitle,
    parentname: itemParent,
    feedback: itemFeedback,
    image,
  });

  const savedTestimonial = await newTestimonial.save();
  return ApiResponse.success(res, 201, "Testimonial created successfully", savedTestimonial);
});

// Get all Testimonials
const getAllTestimonial = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Testimonial,
    req,
    searchFields: ["title", "parentname", "feedback"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });

  return ApiResponse.success(res, 200, "Testimonials retrieved successfully", {
    total: result.total,
    pagination: result.pagination,
    testimonial: result.items,
    testimonials: result.items,
    data: result.items,
  });
});

// Get single Testimonial
const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return ApiResponse.error(res, 404, "Testimonial not found.");
  }
  return ApiResponse.success(res, 200, "Testimonial fetched successfully", { testimonial, data: testimonial });
});

// Update Testimonial
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return ApiResponse.error(res, 404, "Testimonial not found.");
  }

  const { title, role, parentname, feedback, content } = req.body;
  if (title || role) testimonial.title = title || role || testimonial.title;
  if (parentname) testimonial.parentname = parentname;
  if (feedback || content) testimonial.feedback = feedback || content || testimonial.feedback;

  if (req.file) {
    safeUnlink(testimonial.image);
    testimonial.image = req.file.path;
  }

  await testimonial.save();
  return ApiResponse.success(res, 200, "Testimonial updated successfully", { testimonial, data: testimonial });
});

// Delete single Testimonial by ID
const deleteTestimonialById = asyncHandler(async (req, res) => {
  const testimonialId = req.params.id;
  const deleteTestimonial = await Testimonial.findByIdAndDelete(testimonialId);

  if (!deleteTestimonial) {
    return ApiResponse.error(res, 404, "Testimonial not found.");
  }

  safeUnlink(deleteTestimonial.image);
  return ApiResponse.success(res, 200, "Testimonial deleted successfully");
});

module.exports = {
  createTestimonial,
  getAllTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonialById,
};
