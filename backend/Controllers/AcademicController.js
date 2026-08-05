const asyncHandler = require("express-async-handler");
const Academic = require("../Models/AcademicSchema");
const ApiResponse = require("../utils/apiResponse");

const normalizeAcademicItem = (item) => {
  if (typeof item === "string") {
    return { title: item.trim(), details: "" };
  }

  if (item && typeof item === "object") {
    return {
      title: String(item.title || item.name || "").trim(),
      details: String(item.details || item.description || "").trim(),
    };
  }

  return { title: "", details: "" };
};

const normalizeAcademicItems = (items = []) =>
  items.map(normalizeAcademicItem).filter((item) => item.title);

const parseListField = (value, fallback = []) => {
  if (value === undefined || value === null) return normalizeAcademicItems(fallback);

  let parsed = fallback;

  if (Array.isArray(value)) {
    parsed = value;
  } else if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = fallback;
    }
  }

  return normalizeAcademicItems(parsed);
};

const parseArrayField = (value, fallback = []) => {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// Initial Seed Data for the 4 Academics Categories
const seedDefaultAcademics = async () => {
  const categories = [
    {
      category: "kindergarten",
      title: "Kindergarten Daycare - ECD II",
      gradeRange: "(PG-UKG)",
      description:
        "At Aksharaa Kindergarten, our center is dedicated to providing a nurturing and educational environment for children aged 2 to 6 years old. Our Kindergarten program is designed to provide comprehensive early childhood education through our Day Care, Pre-ECD, ECD I, and ECD II programs.",
      learningCentersTitle: "Learning Centers",
      learningCenters: [
        "Art center",
        "Phonic Center",
        "Exploration and investigation center",
        "Pre-writing center",
        "Dramatic Center",
        "Literacy center",
        "Science and Nature Center",
        "Math Center",
        "Sensory Center",
      ],
      extraActivitiesTitle: "Extra/ Co-curricular Activities",
      extraActivities: [
        "Yoga & Mindfulness",
        "Music & Movement",
        "Dance",
        "Water Splash",
        "Gymnastics",
        "Physical Exercise (P.E) / Sports",
        "Excursion/ Field Trips",
      ],
      approachTitle: "Aksharaa Approach to Quality Education",
      approachItems: [
        "Theme-based curriculum",
        "Caring, qualified staff",
        "Activity-based learning",
        "Field-based learning",
        "Co-curricular activities",
        "Parent-teacher collaboration",
        "Child-friendly environment",
        "ICT-integrated activities",
      ],
    },
    {
      category: "elementary",
      title: "Elementary School",
      gradeRange: "(Grade 1-5)",
      description:
        "Quality education is more than only academics; it encompasses life skills, manners, and cultural understanding. Elementary school, which includes grade from 1 to 5, is a special time in a child's life where they develop foundational academic and social skills. Our Elementary School program is a unique approach that focuses on empowering children not only academically but also socially.",
      learningCentersTitle: "Key Academic Pillars",
      learningCenters: [
        "Interactive Classroom Learning",
        "Personalized Attention (2 Teachers per Class)",
        "Reading & Literacy Development",
        "Hands-on Science & Inquiry",
        "Value-based Sanskar Education",
      ],
      extraActivitiesTitle: "Co-Curricular & Sports",
      extraActivities: [
        "Art & Crafts",
        "Music & Drama",
        "Physical Education & Martial Arts",
        "Library & Creative Writing",
        "Educational Field Trips",
      ],
      approachTitle: "Elementary Educational Philosophy",
      approachItems: [
        "Integrated thematic learning",
        "Critical thinking & problem solving",
        "Culture & value driven education",
        "Student-centered interactive environment",
      ],
    },
    {
      category: "middle",
      title: "Middle School",
      gradeRange: "(Grade 6-7)",
      description:
        "The Middle School is where the journey of discovery and growth continues for students in grade 6-7 as they experience academic and social development. At our school, we believe that education is not just about imparting knowledge but also about shaping character and nurturing values.",
      learningCentersTitle: "Academic Focus Areas",
      learningCenters: [
        "STEM & Robotics Exploration",
        "Ethics & Moral Education",
        "Language & Public Speaking",
        "Science Lab Experiments",
        "Mathematics & Analytical Logic",
      ],
      extraActivitiesTitle: "Student Enrichment Activities",
      extraActivities: [
        "Debates & Model UN Preparation",
        "Sports & Athletics Competitions",
        "Music & Cultural Arts",
        "Community Outreach & Service",
      ],
      approachTitle: "Middle School Growth Mindset",
      approachItems: [
        "Discussion & project based learning",
        "Interactive teacher facilitation",
        "Values & character building",
        "Self-directed learning habits",
      ],
    },
    {
      category: "high",
      title: "Senior School",
      gradeRange: "(Grade 8-10)",
      description:
        "At Aksharaa, our Senior School program (Grade 8-10) is meticulously designed to prepare students for the academic rigor and personal growth required for success encompassing the grit and growth mindset. Our school follows Nepal's National Curriculum formulated by the Curriculum Development Center (CDC), preparing students for the Secondary Education Examination (SEE).",
      learningCentersTitle: "Senior Academic Tracks",
      learningCenters: [
        "National CDC Curriculum Rigor",
        "SEE Exam Preparation & Mock Tests",
        "Advanced Science & Physics Labs",
        "Computer Science & ICT Integration",
        "Career Guidance & Counseling",
      ],
      extraActivitiesTitle: "Leadership & Future Readiness",
      extraActivities: [
        "Career Exploration Workshops",
        "Skill Development & Seminars",
        "Leadership Roles & Student Council",
        "Sports & National Competitions",
      ],
      approachTitle: "Senior School Excellence Standard",
      approachItems: [
        "Comprehensive exam preparation",
        "Holistic skill & personality development",
        "Analytical & independent research skills",
        "Grit, ethics, and leadership mindset",
      ],
    },
  ];

  for (const cat of categories) {
    const exists = await Academic.findOne({ category: cat.category });
    if (!exists) {
      await Academic.create({
        ...cat,
        learningCenters: normalizeAcademicItems(cat.learningCenters),
        extraActivities: normalizeAcademicItems(cat.extraActivities),
        approachItems: normalizeAcademicItems(cat.approachItems),
      });
    }
  }
};

// GET /api/v1/academic - Fetch all academic programs
const getAcademics = asyncHandler(async (req, res) => {
  await seedDefaultAcademics();
  const academics = await Academic.find().sort({ category: 1 }).lean();
  return ApiResponse.success(res, 200, "Fetched all academic programs", { academics });
});

// GET /api/v1/academic/:category - Fetch single academic program
const getAcademicByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  await seedDefaultAcademics();

  let item = await Academic.findOne({ category: category.toLowerCase() });
  if (!item) {
    return ApiResponse.error(res, 404, `Academic section '${category}' not found`);
  }

  return ApiResponse.success(res, 200, `Fetched ${category} academic section`, item);
});

// PUT /api/v1/academic/:category - Update single academic program with uploaded images
const updateAcademicByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  let academic = await Academic.findOne({ category: category.toLowerCase() });

  if (!academic) {
    academic = new Academic({ category: category.toLowerCase(), title: category });
  }

  const {
    title,
    gradeRange,
    description,
    learningCentersTitle,
    learningCenters,
    extraActivitiesTitle,
    extraActivities,
    approachTitle,
    approachItems,
    existingSliderImages,
    existingGridImages,
  } = req.body;

  if (title) academic.title = title;
  if (gradeRange !== undefined) academic.gradeRange = gradeRange;
  if (description !== undefined) academic.description = description;
  if (learningCentersTitle) academic.learningCentersTitle = learningCentersTitle;
  if (extraActivitiesTitle) academic.extraActivitiesTitle = extraActivitiesTitle;
  if (approachTitle) academic.approachTitle = approachTitle;

  // Process array fields. Supports old string items and new title/detail objects.
  if (learningCenters !== undefined) {
    academic.learningCenters = parseListField(learningCenters, academic.learningCenters);
  }
  if (extraActivities !== undefined) {
    academic.extraActivities = parseListField(extraActivities, academic.extraActivities);
  }
  if (approachItems !== undefined) {
    academic.approachItems = parseListField(approachItems, academic.approachItems);
  }

  // Handle uploaded slider & grid files
  let sliderList = parseArrayField(existingSliderImages, academic.sliderImages || []);
  let gridList = parseArrayField(existingGridImages, academic.gridImages || []);

  if (req.files) {
    if (req.files.sliderImages && req.files.sliderImages.length > 0) {
      const newSliders = req.files.sliderImages.map((f) => f.path);
      sliderList = [...sliderList, ...newSliders];
    }
    if (req.files.gridImages && req.files.gridImages.length > 0) {
      const newGrids = req.files.gridImages.map((f) => f.path);
      gridList = [...gridList, ...newGrids];
    }
    if (req.files.sideImage && req.files.sideImage[0]) {
      academic.sideImage = req.files.sideImage[0].path;
    }
  }

  academic.sliderImages = sliderList;
  academic.gridImages = gridList;

  await academic.save();
  return ApiResponse.success(res, 200, `Updated ${category} academic program successfully`, academic);
});

module.exports = {
  getAcademics,
  getAcademicByCategory,
  updateAcademicByCategory,
};
