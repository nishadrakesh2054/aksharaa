const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Blog = require("../Models/BlogSchema");
const BlogCategory = require("../Models/BlogCategorySchema");
const Activity = require("../Models/actvitiesSchema");
const ActivityCategory = require("../Models/activitiesCategorySchema");
const Gallery = require("../Models/GallerySchema");
const ThreeD = require("../Models/ThreeDSchema");
const Hero = require("../Models/HeroSchema");
const Testimonial = require("../Models/Testimonial");
const Enquiry = require("../Models/enquirySchema");
const Creative = require("../Models/creativeSchema");
const Infrastructure = require("../Models/InfrastructureSchema");
const Project = require("../Models/ProjectSchema");
const Partner = require("../Models/PartnerSchema");
const Academic = require("../Models/AcademicSchema");
const Mun = require("../Models/MunSchema");
const Event = require("../Models/EventSchema");
const Calendar = require("../Models/CalendarSchema");

const rootDir = path.join(__dirname, "..", "..");
const backendDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const uploadsDir = path.join(backendDir, "uploads");
const seedUploadDir = path.join(uploadsDir, "seed");

const log = (message) => console.log(`[seed] ${message}`);

const normalizeUploadPath = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/\\/g, "/").replace(/^backend\//, "");
};

const convertMongoExportValue = (value) => {
  if (Array.isArray(value)) return value.map(convertMongoExportValue);
  if (!value || typeof value !== "object") return normalizeUploadPath(value);

  if (Object.keys(value).length === 1 && value.$oid) {
    return new mongoose.Types.ObjectId(value.$oid);
  }
  if (Object.keys(value).length === 1 && value.$date) {
    return new Date(value.$date);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, convertMongoExportValue(entry)])
  );
};

const readExportFile = (fileName) => {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8")).map(convertMongoExportValue);
};

const upsertDocuments = async (model, records, label, keySelector = (item) => ({ _id: item._id })) => {
  if (!records.length) {
    log(`${label}: no records found`);
    return;
  }

  for (const record of records) {
    await model.replaceOne(keySelector(record), record, { upsert: true, runValidators: false });
  }
  log(`${label}: seeded ${records.length}`);
};

const copySeedAsset = (sourceRelativePath, targetRelativePath) => {
  const sourcePath = path.join(rootDir, sourceRelativePath);
  const targetPath = path.join(seedUploadDir, targetRelativePath);

  if (!fs.existsSync(sourcePath)) {
    log(`missing asset skipped: ${sourceRelativePath}`);
    return "";
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  return normalizeUploadPath(path.relative(backendDir, targetPath));
};

const asset = (sourceRelativePath, targetRelativePath = sourceRelativePath.replace(/^frontend\/src\/assets\//, "")) =>
  copySeedAsset(sourceRelativePath, targetRelativePath);

const publicAsset = (sourceRelativePath, targetRelativePath = sourceRelativePath.replace(/^frontend\/public\//, "public/")) =>
  copySeedAsset(sourceRelativePath, targetRelativePath);

const seedInfrastructure = async () => {
  const items = [
    {
      title: "Computer Laboratory",
      iconClass: "fas fa-desktop text-primary",
      description:
        "Our Computer Laboratory is a cornerstone of our commitment to digital literacy and innovation. Equipped with 60 advanced computers, the lab features the latest hardware and software, all supported by high-speed internet connectivity. This facility is a hub for digital exploration, coding projects, research and multimedia learning.",
      images: [
        asset("frontend/src/assets/infrastructure/compLab/GP4A8074.jpg"),
        asset("frontend/src/assets/infrastructure/compLab/GP4A8088.jpg"),
        asset("frontend/src/assets/infrastructure/compLab/GP4A8082.jpg"),
      ],
    },
    {
      title: "Science Laboratory",
      iconClass: "fas fa-flask text-success",
      description:
        "The Science Laboratory at Aksharaa School is equipped with modern scientific instruments and materials, creating an ideal environment for hands-on learning and experimentation. Students connect theory with practical experiments, field visits and observation.",
      images: [
        asset("frontend/src/assets/infrastructure/scienceLab/GP4A8273.jpg"),
        asset("frontend/src/assets/infrastructure/scienceLab/GP4A8256.jpg"),
        asset("frontend/src/assets/infrastructure/scienceLab/GP4A8267.jpg"),
      ],
    },
    {
      title: "Cafeteria",
      iconClass: "fas fa-utensils text-success",
      description:
        "The Cafeteria at Aksharaa School is a vibrant and welcoming space where students enjoy nutritious vegetarian meals prepared with strict hygiene standards. It supports health, wellness and community during meal times.",
      images: [
        asset("frontend/src/assets/infrastructure/cafeteria/GP4A7728.jpg"),
        asset("frontend/src/assets/infrastructure/cafeteria/GP4A7745.jpg"),
        asset("frontend/src/assets/infrastructure/cafeteria/GP4A7749.jpg"),
      ],
    },
    {
      title: "Library",
      iconClass: "fas fa-book text-warning",
      description:
        "Our library offers a wide collection of books, journals, encyclopedias and reading materials that inspire reading habits, independent learning and curiosity among students.",
      images: [
        asset("frontend/src/assets/infrastructure/library/GP4A8177.jpg"),
        asset("frontend/src/assets/infrastructure/library/GP4A8161.jpg"),
        asset("frontend/src/assets/infrastructure/library/GP4A8168.jpg"),
      ],
    },
    {
      title: "Play Area",
      iconClass: "fas fa-futbol text-info",
      description:
        "Our play areas support physical development and well-being through sports, games and recreational activities. These spaces encourage teamwork, resilience, fitness and joyful learning.",
      images: [
        asset("frontend/src/assets/infrastructure/playarea/GP4A8238.jpg"),
        asset("frontend/src/assets/infrastructure/playarea/GP4A8192.jpg"),
        asset("frontend/src/assets/infrastructure/playarea/GP4A8243.jpg"),
      ],
    },
    {
      title: "Transportation",
      iconClass: "fas fa-bus text-primary",
      description:
        "Aksharaa School offers efficient and secure transportation options for students. Our modern buses are managed with safety and comfort as priorities for school travel and extracurricular movement.",
      images: [
        asset("frontend/src/assets/infrastructure/trasportaion/GP4A7770.jpg"),
        asset("frontend/src/assets/infrastructure/trasportaion/GP4A7775.jpg"),
        asset("frontend/src/assets/infrastructure/trasportaion/GP4A7777.jpg"),
      ],
    },
    {
      title: "Outdoor Learning Spaces",
      iconClass: "fas fa-seedling text-warning",
      description:
        "Our outdoor learning spaces include gardens and open-air areas designed for experiential learning, environmental study, observation and practical outdoor education.",
      images: [
        asset("frontend/src/assets/infrastructure/outdoor/GP4A7705.jpg"),
        asset("frontend/src/assets/infrastructure/outdoor/GP4A8183.jpg"),
        asset("frontend/src/assets/infrastructure/outdoor/GP4A8190.jpg"),
      ],
    },
    {
      title: "Infirmary",
      iconClass: "fas fa-stethoscope text-danger",
      description:
        "Our Infirmary is staffed with a dedicated full-time nurse who provides immediate care for minor health issues and emergencies, supporting student health and well-being throughout the school day.",
      images: [
        asset("frontend/src/assets/infrastructure/infirmary/GP4A8031.jpg"),
        asset("frontend/src/assets/infrastructure/infirmary/GP4A8053.jpg"),
        asset("frontend/src/assets/infrastructure/infirmary/GP4A8130.jpg"),
      ],
    },
  ].map((item, index) => ({ ...item, order: index + 1, images: item.images.filter(Boolean) }));

  for (const item of items) {
    await Infrastructure.findOneAndUpdate({ title: item.title }, item, { upsert: true, new: true });
  }
  log(`infrastructure: seeded ${items.length}`);
};

const seedProjects = async () => {
  const project = {
    title: "Kitchen Gardening Project",
    description:
      "Namaskar! I am Bidhisa from Grade 5 Uranite. This year, I had the opportunity to be part of an amazing project called Kitchen Gardening at Aksharaa School, which is also our Long Term Project. It was an interesting experience that taught us care for plants, respect for food, curiosity, teamwork and environmental responsibility. Every Friday we watered vegetables, removed weeds, harvested crops and connected classroom learning with real-life science and mathematics.",
    images: [
      asset("frontend/src/assets/longTermProject/GP4A8117.jpg"),
      asset("frontend/src/assets/longTermProject/GP4A8131.jpg"),
      asset("frontend/src/assets/longTermProject/GP4A8133.jpg"),
      asset("frontend/src/assets/longTermProject/GP4A8138.jpg"),
    ].filter(Boolean),
    video: "https://www.youtube.com/embed/PDoYP4LqDdY?si=Qhvvs7TkHFkOTDJn",
  };

  await Project.findOneAndUpdate({ title: project.title }, project, { upsert: true, new: true });
  log("projects: seeded 1");
};

const seedPartners = async () => {
  const partners = [
    { title: "Leader in Me", logo: publicAsset("frontend/public/brand/LeaderinMe.png"), order: 1 },
    { title: "FranklinCovey Education", logo: publicAsset("frontend/public/brand/FC_EdLogoLockup_rgb-300dpi.png"), order: 2 },
    { title: "Educational Partner", logo: publicAsset("frontend/public/brand/logo.png"), order: 3 },
    { title: "Partner Logo", logo: publicAsset("frontend/public/brand/logo partners.png"), order: 4 },
  ].filter((item) => item.logo);

  for (const item of partners) {
    await Partner.findOneAndUpdate({ title: item.title }, item, { upsert: true, new: true });
  }
  log(`partners: seeded ${partners.length}`);
};

const academicSeed = [
  {
    category: "kindergarten",
    title: "Kindergarten Daycare - ECD II",
    gradeRange: "(PG-UKG)",
    description:
      "At Aksharaa Kindergarten, our center is dedicated to providing a nurturing and educational environment for children aged 2 to 6 years old. Our Kindergarten program supports holistic development using child-friendly teaching-learning methodologies.",
    sideImage: publicAsset("frontend/public/kgpng.png", "academics/kindergarten/kgpng.png"),
    learningCentersTitle: "Learning Centers",
    learningCenters: ["Art center", "Phonic Center", "Exploration and investigation center", "Pre-writing center", "Dramatic Center", "Literacy center", "Science and Nature Center", "Math Center", "Sensory Center"],
    extraActivitiesTitle: "Extra/ Co-curricular Activities",
    extraActivities: ["Yoga & Mindfulness", "Music & Movement", "Dance", "Water Splash", "Sports & PE", "Excursion / Field Trips"],
    approachTitle: "Aksharaa Approach to Quality Education",
    approachItems: ["Theme-based curriculum", "Caring, qualified staff", "Activity-based learning", "Child-friendly environment"],
    sliderImages: [
      asset("frontend/src/assets/kinder/GP4A7423.jpg"),
      asset("frontend/src/assets/kinder/GP4A7438.jpg"),
      asset("frontend/src/assets/kinder/GP4A7402.jpg"),
      asset("frontend/src/assets/kinder/GP4A7429.jpg"),
      asset("frontend/src/assets/kinder/GP4A7544.jpg"),
    ].filter(Boolean),
    gridImages: [
      asset("frontend/src/assets/kinder/GP4A7490.jpg"),
      asset("frontend/src/assets/kinder/GP4A7507.jpg"),
      asset("frontend/src/assets/kinder/GP4A7607.jpg"),
      asset("frontend/src/assets/kinder/GP4A7402.jpg"),
    ].filter(Boolean),
  },
  {
    category: "elementary",
    title: "Elementary School",
    gradeRange: "(Grade 1-5)",
    description:
      "Quality education is more than only academics; it encompasses life skills, manners, and cultural understanding. Elementary school is a special time where children develop foundational academic and social skills.",
    learningCentersTitle: "Key Academic Pillars",
    learningCenters: ["Personalized Attention (2 Teachers per Class)", "Integrated Reading & Cultural Learning", "Value-Based Sanskar Education"],
    extraActivitiesTitle: "Co-Curricular & Sports",
    extraActivities: ["Art & Crafts", "Music & Drama", "Physical Education", "Library & Creative Writing", "Educational Field Trips"],
    approachTitle: "Elementary Educational Philosophy",
    approachItems: ["Integrated thematic learning", "Critical thinking", "Student-centered environment"],
    sliderImages: [
      asset("frontend/src/assets/elementarty/GP4A7700.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7704.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7685.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7702.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7708.jpg"),
    ].filter(Boolean),
    gridImages: [
      asset("frontend/src/assets/elementarty/GP4A7700.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7704.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7685.jpg"),
      asset("frontend/src/assets/elementarty/GP4A7702.jpg"),
    ].filter(Boolean),
  },
  {
    category: "middle",
    title: "Middle School",
    gradeRange: "(Grade 6-7)",
    description:
      "The Middle School is where discovery and growth continue for students in grades 6-7 as they experience academic and social development. Education shapes character, values and confidence.",
    learningCentersTitle: "Academic Focus Areas",
    learningCenters: ["Interactive Discussion & Projects", "STEM & Robotics Exploration", "Moral & Ethics Education"],
    extraActivitiesTitle: "Student Enrichment Activities",
    extraActivities: ["Debates & Model UN Prep", "Sports & Athletic Competitions", "Cultural Arts & Drama"],
    approachTitle: "Middle School Growth Mindset",
    approachItems: ["Project-based learning", "Interactive facilitation", "Character building", "Self-directed learning"],
    sliderImages: [
      asset("frontend/src/assets/middle/GP4A7788.jpg"),
      asset("frontend/src/assets/middle/GP4A7812.jpg"),
      asset("frontend/src/assets/middle/GP4A7655.jpg"),
      asset("frontend/src/assets/middle/GP4A7810.jpg"),
      asset("frontend/src/assets/middle/GP4A7926.jpg"),
    ].filter(Boolean),
    gridImages: [
      asset("frontend/src/assets/middle/GP4A7788.jpg"),
      asset("frontend/src/assets/middle/GP4A7812.jpg"),
      asset("frontend/src/assets/middle/GP4A7655.jpg"),
      asset("frontend/src/assets/middle/GP4A7810.jpg"),
    ].filter(Boolean),
  },
  {
    category: "high",
    title: "Senior School",
    gradeRange: "(Grade 8-10)",
    description:
      "At Aksharaa, our Senior School program is designed to prepare students for academic rigor and personal growth, encompassing grit and growth mindset while preparing for the SEE journey.",
    learningCentersTitle: "Senior Academic Tracks",
    learningCenters: ["National CDC Curriculum Rigor", "SEE Exam Preparation & Mock Tests", "Advanced Science & Physics Labs"],
    extraActivitiesTitle: "Leadership & Future Readiness",
    extraActivities: ["Career Guidance & Workshops", "Skill Development & Seminars", "Student Council Leadership"],
    approachTitle: "Senior School Excellence Standard",
    approachItems: ["Exam preparation", "Holistic skill development", "Independent research", "Leadership mindset"],
    sliderImages: [
      asset("frontend/src/assets/senior/GP4A8177.jpg"),
      asset("frontend/src/assets/senior/GP4A8244.jpg"),
      asset("frontend/src/assets/senior/GP4A8126.jpg"),
      asset("frontend/src/assets/senior/GP4A8190.jpg"),
      asset("frontend/src/assets/senior/GP4A8279.jpg"),
    ].filter(Boolean),
    gridImages: [
      asset("frontend/src/assets/senior/GP4A8177.jpg"),
      asset("frontend/src/assets/senior/GP4A8244.jpg"),
      asset("frontend/src/assets/senior/GP4A8126.jpg"),
      asset("frontend/src/assets/senior/GP4A8190.jpg"),
    ].filter(Boolean),
  },
];

const seedAcademics = async () => {
  for (const item of academicSeed) {
    await Academic.findOneAndUpdate({ category: item.category }, item, { upsert: true, new: true });
  }
  log(`academics: seeded ${academicSeed.length}`);
};

const seedMun = async () => {
  const mun = {
    title: "AKSHARAA MODEL UNITED NATIONS",
    subtitle: "AMUN",
    aboutTitle: "About MUN",
    aboutText:
      "Model United Nations (MUN) is an educational activity that stimulates the proceedings of the United Nations, allowing participants to step into the roles of diplomats and representatives of various countries.",
    whyTitle: "WHY AMUN?",
    whyText:
      "The Aksharaa Model United Nations is an esteemed annual event organized by Aksharaa School, providing a dynamic platform for young minds to engage in meaningful discussions on global issues, diplomacy, and conflict resolution.",
    goalsTitle: "OUR GOALS",
    goalsList: [
      "MUN helps to ensure a clear concept on diverse topics, diplomacy, and engaging committee sessions.",
      "Delegates improve public speaking skills and increase confidence while speaking and making conversations.",
      "The goal is to enhance research, presentation and facilitation skills while exploring creative solutions to complex challenges.",
    ],
    sliderImages: [
      asset("frontend/src/assets/mun/IMG_0511.jpg"),
      asset("frontend/src/assets/mun/IMG_0545.jpg"),
      asset("frontend/src/assets/mun/IMG_0481.jpg"),
      asset("frontend/src/assets/mun/IMG_0611.jpg"),
      asset("frontend/src/assets/mun/IMG_0537.jpg"),
      asset("frontend/src/assets/mun/IMG_0510.jpg"),
      asset("frontend/src/assets/mun/IMG_0436.jpg"),
    ].filter(Boolean),
    gridImages: [
      asset("frontend/src/assets/mun/IMG_0518.jpg"),
      asset("frontend/src/assets/mun/IMG_0537.jpg"),
      asset("frontend/src/assets/mun/IMG_0545.jpg"),
      asset("frontend/src/assets/mun/IMG_0611.jpg"),
    ].filter(Boolean),
  };

  await Mun.findOneAndUpdate({}, mun, { upsert: true, new: true });
  log("mun: seeded 1");
};

const seedEventsAndCalendar = async () => {
  await Event.findOneAndUpdate(
    { title: "PTM", date: "2081-Poush-13" },
    { title: "PTM", date: "2081-Poush-13", description: "2nd Diagnostic Test" },
    { upsert: true, new: true }
  );

  const calendar = [
    {
      monthYear: "Baisakh 2081 (April-May 2024)",
      events: [
        "1st: Happy New Year",
        "4th: Chait Dashain",
        "10th: School Reopens",
        "11th: Loktantra Diwas",
        "26th: Mothers Day",
        "4-7th, 9th, 23rd, 30th: Continuous Professional Development (CPD)",
      ],
    },
    {
      monthYear: "Jestha 2081 (May-Jun 2024)",
      events: ["10th: Buddha Jyanti", "14th: School Election", "15th: Gantantra Diwas", "23rd: World Environment Day", "13th & 27th: CPD"],
    },
  ];

  for (const item of calendar) {
    await Calendar.findOneAndUpdate({ monthYear: item.monthYear }, item, { upsert: true, new: true });
  }
  log("events/calendar: seeded 3");
};

const seedMongoExports = async () => {
  await upsertDocuments(BlogCategory, readExportFile("aksharaa.blogcategories.json"), "blog categories");
  await upsertDocuments(ActivityCategory, readExportFile("aksharaa.activitiescategories.json"), "activity categories");
  await upsertDocuments(Blog, readExportFile("aksharaa.blogs.json"), "blogs");
  await upsertDocuments(Activity, readExportFile("aksharaa.activities.json"), "activities");
  await upsertDocuments(Gallery, readExportFile("aksharaa.galleries.json"), "galleries");
  await upsertDocuments(ThreeD, readExportFile("aksharaa.gallerythrees.json"), "3d gallery");
  await upsertDocuments(Hero, readExportFile("aksharaa.heros.json"), "hero");
  await upsertDocuments(Testimonial, readExportFile("aksharaa.testimonials.json"), "testimonials");
  await upsertDocuments(Enquiry, readExportFile("aksharaa.enquiries.json"), "enquiries");
  await upsertDocuments(Creative, readExportFile("aksharaa.creativeweeks.json"), "creative week");
};

const main = async () => {
  if (!process.env.DataBase) {
    throw new Error("DataBase env value is required.");
  }

  fs.mkdirSync(seedUploadDir, { recursive: true });

  await mongoose.connect(process.env.DataBase, {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 45000,
  });
  log("connected to MongoDB");

  await seedMongoExports();
  await seedInfrastructure();
  await seedProjects();
  await seedPartners();
  await seedAcademics();
  await seedMun();
  await seedEventsAndCalendar();

  await mongoose.disconnect();
  log("complete");
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
