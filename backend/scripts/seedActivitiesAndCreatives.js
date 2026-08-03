const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Activity = require("../Models/actvitiesSchema");
const ActivityCategory = require("../Models/activitiesCategorySchema");
const CreativeWeek = require("../Models/creativeSchema");

const rootDir = path.join(__dirname, "..", "..");
const backendDir = path.join(__dirname, "..");
const uploadsDir = path.join(backendDir, "uploads");
const seedUploadDir = path.join(uploadsDir, "seed");

const MONGODB_URI = process.env.DataBase || process.env.MONGODB_URI || "mongodb://localhost:27017/aksharaa";

const normalizeUploadPath = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/\\/g, "/").replace(/^backend\//, "");
};

const copySeedAsset = (sourceRelativePath, targetRelativePath) => {
  const sourcePath = path.join(rootDir, sourceRelativePath);
  const targetPath = path.join(seedUploadDir, targetRelativePath);

  if (!fs.existsSync(sourcePath)) {
    console.log(`missing asset skipped: ${sourceRelativePath}`);
    return "";
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  return normalizeUploadPath(path.relative(backendDir, targetPath));
};

async function seedActivitiesAndCreatives() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    // Fetch existing categories to link by ObjectId
    const categories = await ActivityCategory.find({});
    const getCatId = (index) => (categories[index] ? categories[index]._id : null);

    const sampleActivities = [
      {
        title: "Annual Inter-House Sports & Field Athletics Meet 2083",
        description: "<h3>Sports Meet Highlights</h3><p>Students from all four houses competed fiercely in sprint races, long jump, relay, and tug-of-war. Champions were awarded trophies and medals for outstanding sportsmanship.</p>",
        image: copySeedAsset("frontend/src/assets/mun/IMG_0436.jpg", "activities/IMG_0436.jpg"),
        category: getCatId(0),
      },
      {
        title: "STEAM & Robotics Exhibition - Future Innovators Showcase",
        description: "<h3>STEM Innovation</h3><p>Young engineers presented working models of solar cars, home automation sensors, and AI voice assistants. Parents and visitors appreciated the students' hands-on projects.</p>",
        image: copySeedAsset("frontend/src/assets/mun/IMG_0481.jpg", "activities/IMG_0481.jpg"),
        category: getCatId(1),
      },
      {
        title: "Inter-School Model United Nations (Aksharaa MUN 2083)",
        description: "<h3>Diplomacy & Public Speaking</h3><p>Over 150 student delegates debated pressing global issues, drafted resolutions on climate change and international security, and honed leadership skills.</p>",
        image: copySeedAsset("frontend/src/assets/mun/IMG_0510.jpg", "activities/IMG_0510.jpg"),
        category: getCatId(5),
      },
      {
        title: "Grand Annual Performing Arts & Musical Symphony",
        description: "<h3>Cultural Extravaganza</h3><p>A mesmerizing evening featuring orchestral folk music, classical Nepalese dance, and theatrical plays performed by student ensembles.</p>",
        image: copySeedAsset("frontend/src/assets/mun/IMG_0511.jpg", "activities/IMG_0511.jpg"),
        category: getCatId(2),
      },
      {
        title: "Community Hygiene & Environmental Tree Plantation Drive",
        description: "<h3>Eco-Club Outreach</h3><p>Student volunteers planted 150 indigenous saplings and led a neighborhood cleanliness awareness walk in Kandaghari.</p>",
        image: copySeedAsset("frontend/src/assets/mun/IMG_0518.jpg", "activities/IMG_0518.jpg"),
        category: getCatId(4),
      },
      {
        title: "Fine Arts & Creative Craft Showcase 2083",
        description: "<h3>Art & Sculpture Gallery</h3><p>An exhibition displaying oil paintings, clay pottery, wood carvings, and origami artwork created by elementary and middle school artists.</p>",
        image: copySeedAsset("frontend/src/assets/mun/IMG_0537.jpg", "activities/IMG_0537.jpg"),
        category: getCatId(3),
      },
    ];

    console.log("Appending 6 school activities...");
    for (const act of sampleActivities) {
      await Activity.updateOne(
        { title: act.title },
        { $set: act },
        { upsert: true }
      );
    }
    console.log("✅ Seeded 6 additional school activities.");

    const sampleCreatives = [
      {
        title: "Student Canvas Painting - Reflections of Nature",
        description: "A breathtaking acrylic landscape painting created by Grade 8 student Samriddhi Shrestha showcasing the serene beauty of the Himalayas.",
        images: [copySeedAsset("frontend/src/assets/mun/IMG_0545.jpg", "creatives/IMG_0545.jpg")],
        order: 1,
      },
      {
        title: "3D Architecture Model - Eco-Friendly Smart City",
        description: "A sustainable urban planning prototype built using recycled timber and solar panels by Grade 9 STEM enthusiasts.",
        images: [copySeedAsset("frontend/src/assets/mun/IMG_0611.jpg", "creatives/IMG_0611.jpg")],
        order: 2,
      },
      {
        title: "Original Poetry & Calligraphy - 'Voice of Youth'",
        description: "An inspiring poem on global harmony, hand-written in elegant traditional calligraphy by Grade 7 student Aarav Karki.",
        images: [copySeedAsset("frontend/src/assets/School.jpg", "creatives/School.jpg")],
        order: 3,
      },
      {
        title: "Robotics Autonomous Rover Prototype",
        description: "An Arduino-based obstacle-avoiding rover engineered by Aksharaa Robotics Club for disaster response simulation.",
        images: [copySeedAsset("frontend/src/assets/School1.jpg", "creatives/School1.jpg")],
        order: 4,
      },
      {
        title: "Traditional Wood Carving & Craft Gallery",
        description: "Intricate hand-carved Newari window frames crafted during the Heritage Craft Workshop.",
        images: [copySeedAsset("frontend/src/assets/School2.jpg", "creatives/School2.jpg")],
        order: 5,
      },
      {
        title: "Origami & Recycled Paper Sculpture Exhibition",
        description: "Creative animal origami sculptures made entirely from upcycled school newspaper.",
        images: [copySeedAsset("frontend/src/assets/mun/IMG_0436.jpg", "creatives/IMG_0436.jpg")],
        order: 6,
      },
    ];

    console.log("Appending 6 Creative Week entries...");
    for (const cr of sampleCreatives) {
      await CreativeWeek.updateOne(
        { title: cr.title },
        { $set: cr },
        { upsert: true }
      );
    }
    console.log("✅ Seeded 6 Creative Week entries.");

    console.log("🎉 All sample data for Activities & Creative Week seeded successfully into MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding activities and creatives:", error);
    process.exit(1);
  }
}

seedActivitiesAndCreatives();
