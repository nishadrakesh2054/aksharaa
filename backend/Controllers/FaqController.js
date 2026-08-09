const asyncHandler = require("express-async-handler");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");
const { faqModel: Faq, FAQ_CATEGORIES } = require("../Models/FaqSchema");

const parseBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return String(value) === "true";
};

const buildFaqFilter = (req) => {
  const filter = {};

  if (req.query.category) {
    filter.category = String(req.query.category).trim().toLowerCase();
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = String(req.query.isActive) === "true";
  }

  return filter;
};

const createFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.create({
    question: req.body.question,
    answer: req.body.answer,
    category: req.body.category || "general",
    order: Number(req.body.order) || 0,
    isActive: parseBoolean(req.body.isActive, true),
  });

  return ApiResponse.success(res, 201, "FAQ created successfully", { faq, data: faq });
});

const getFaqs = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Faq,
    req,
    filter: buildFaqFilter(req),
    searchFields: ["question", "answer", "category"],
    useTextSearch: true,
    defaultSort: { order: 1, createdAt: -1 },
  });

  return ApiResponse.success(res, 200, "FAQs fetched successfully", {
    total: result.total,
    pagination: result.pagination,
    categories: FAQ_CATEGORIES,
    faqs: result.items,
    data: result.items,
  });
});

const getFaqById = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return ApiResponse.error(res, 404, "FAQ not found.");
  }

  return ApiResponse.success(res, 200, "FAQ fetched successfully", { faq, data: faq });
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return ApiResponse.error(res, 404, "FAQ not found.");
  }

  if (req.body.question !== undefined) faq.question = req.body.question;
  if (req.body.answer !== undefined) faq.answer = req.body.answer;
  if (req.body.category !== undefined) faq.category = req.body.category;
  if (req.body.order !== undefined) faq.order = Number(req.body.order) || 0;
  if (req.body.isActive !== undefined) faq.isActive = parseBoolean(req.body.isActive, faq.isActive);

  await faq.save();

  return ApiResponse.success(res, 200, "FAQ updated successfully", { faq, data: faq });
});

const toggleFaqStatus = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return ApiResponse.error(res, 404, "FAQ not found.");
  }

  faq.isActive = !faq.isActive;
  await faq.save();

  return ApiResponse.success(
    res,
    200,
    `FAQ status changed to ${faq.isActive ? "Active" : "Inactive"}`,
    { faq, data: faq }
  );
});

const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) {
    return ApiResponse.error(res, 404, "FAQ not found.");
  }

  return ApiResponse.success(res, 200, "FAQ deleted successfully");
});

module.exports = {
  createFaq,
  getFaqs,
  getFaqById,
  updateFaq,
  toggleFaqStatus,
  deleteFaq,
};
