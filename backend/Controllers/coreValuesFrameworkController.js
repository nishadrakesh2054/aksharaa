const asyncHandler = require("express-async-handler");
const CoreValuesFramework = require("../Models/CoreValuesFrameworkSchema");
const ApiResponse = require("../utils/apiResponse");

const defaultCoreValuesFramework = {
  badge: "CORE VALUES & PHILOSOPHY",
  title: "Our Core",
  highlight: "Values Framework",
  description:
    "Aksharaa School provides a balanced education that emphasizes both strong values and academic achievement. Through collaboration with parents and stakeholders, we focus on building resilience, leadership skills, and emotional intelligence in every student, ensuring their holistic growth and development. We cultivate critical thinking and a positive attitude, guiding students to embrace new perspectives and take responsible action.",
  image: "/round.jpeg",
  imageAlt: "Aksharaa Core Values Infographic",
  isActive: true,
};

const seedDefaultCoreValuesFramework = async () => {
  const count = await CoreValuesFramework.countDocuments();
  if (count > 0) return;
  await CoreValuesFramework.create(defaultCoreValuesFramework);
};

const parseBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return value === true || String(value) === "true";
};

const getCoreValuesFramework = asyncHandler(async (req, res) => {
  await seedDefaultCoreValuesFramework();

  const includeInactive = req.query.includeInactive === "true";
  const filter = includeInactive ? {} : { isActive: true };
  const item = await CoreValuesFramework.findOne(filter).sort({ updatedAt: -1, createdAt: -1 });

  return ApiResponse.success(res, 200, "Core values framework fetched successfully", {
    item,
    coreValuesFramework: item,
    data: item,
  });
});

const upsertCoreValuesFramework = asyncHandler(async (req, res) => {
  await seedDefaultCoreValuesFramework();

  const existing = await CoreValuesFramework.findOne().sort({ updatedAt: -1, createdAt: -1 });
  const payload = {
    badge: req.body.badge,
    title: req.body.title,
    highlight: req.body.highlight,
    description: req.body.description,
    imageAlt: req.body.imageAlt,
    isActive: parseBoolean(req.body.isActive, true),
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  if (req.file) payload.image = req.file.path;

  const item = existing
    ? await CoreValuesFramework.findByIdAndUpdate(existing._id, payload, {
        new: true,
        runValidators: true,
      })
    : await CoreValuesFramework.create({
        ...defaultCoreValuesFramework,
        ...payload,
        image: payload.image || defaultCoreValuesFramework.image,
      });

  return ApiResponse.success(res, 200, "Core values framework saved successfully", {
    item,
    coreValuesFramework: item,
    data: item,
  });
});

module.exports = {
  defaultCoreValuesFramework,
  getCoreValuesFramework,
  upsertCoreValuesFramework,
};
