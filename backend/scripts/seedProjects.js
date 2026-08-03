const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Project = require("../Models/ProjectSchema");

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

const sampleProjects = [
  {
    title: "Eco-Sustainability & Campus Biodiversity Project",
    description: `<h3>Overview</h3><p>The Eco-Sustainability Project engages students in environmental conservation, rooftop hydroponics, organic composting, and solar energy awareness across the school campus. Students collaborate on research projects, waste management audits, and indigenous plant preservation.</p><h4>Key Achievements</h4><ul><li>Established 100% organic composting for school cafeteria waste.</li><li>Planted over 200 indigenous tree saplings around the neighborhood.</li><li>Built a rainwater harvesting filtration model.</li></ul>`,
    images: [copySeedAsset("frontend/src/assets/longTermProject/GP4A8117.jpg", "longTermProject/GP4A8117.jpg")],
    video: "",
  },
  {
    title: "Community Literacy & Rural Library Outreach",
    description: `<h3>Overview</h3><p>Our student-led literacy campaign aims to bridge educational gaps by setting up community mini-libraries and donating textbooks to under-resourced schools in Kathmandu Valley. Students conduct weekly reading sessions and digital literacy workshops.</p><h4>Impact Highlights</h4><ul><li>Donated 1,500+ books to local community centers.</li><li>Trained 300+ students in basic digital literacy skills.</li><li>Established 3 active open-access reading corners.</li></ul>`,
    images: [copySeedAsset("frontend/src/assets/longTermProject/GP4A8131.jpg", "longTermProject/GP4A8131.jpg")],
    video: "",
  },
  {
    title: "Robotics, Automation & AI Innovation Lab",
    description: `<h3>Overview</h3><p>An advanced STEM initiative where middle and high school students design autonomous robots, IoT weather monitoring stations, and AI-driven smart agriculture prototypes under mentor guidance.</p><h4>Core Innovations</h4><ul><li>Developed automated soil moisture and climate monitoring sensors.</li><li>Participated in national robotics league championships.</li><li>Created 3D-printed prototypes for real-world application.</li></ul>`,
    images: [copySeedAsset("frontend/src/assets/longTermProject/GP4A8133.jpg", "longTermProject/GP4A8133.jpg")],
    video: "",
  },
  {
    title: "Heritage Preservation & Indigenous Arts Initiative",
    description: `<h3>Overview</h3><p>A multi-disciplinary project preserving Nepalese cultural heritage through digital archives, traditional Newari wood carving documentation, folk music recording, and architectural heritage mapping.</p><h4>Major Milestones</h4><ul><li>Documented 25+ historical monuments in Kathmandu Valley.</li><li>Created interactive digital exhibits and audio guides.</li><li>Hosted annual cultural heritage exhibition for parents and visitors.</li></ul>`,
    images: [copySeedAsset("frontend/src/assets/longTermProject/GP4A8138.jpg", "longTermProject/GP4A8138.jpg")],
    video: "",
  },
];

async function seedProjects() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    for (const projData of sampleProjects) {
      await Project.updateOne(
        { title: projData.title },
        { $set: projData },
        { upsert: true }
      );
    }

    console.log(`✅ Seeded ${sampleProjects.length} Long-Term Projects into MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
    process.exit(1);
  }
}

seedProjects();
