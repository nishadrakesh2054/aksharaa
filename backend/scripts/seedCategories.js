const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const BlogCategory = require("../Models/BlogCategorySchema");
const ActivityCategory = require("../Models/activitiesCategorySchema");

const MONGODB_URI = process.env.DataBase || process.env.MONGODB_URI || "mongodb://localhost:27017/aksharaa";

const sampleBlogCategories = [
  "Academic Excellence & Curriculum",
  "Pedagogy & Experiential Learning",
  "Child Psychology & Parenting Tips",
  "STEAM & Digital Innovation",
  "Character Building & Life Values",
  "Student Leadership & Career Guidance",
  "Environmental Sustainability & Eco-Club",
  "Literary & Creative Writing Highlights",
  "Global Citizenship & Cultural Exchange",
  "Health, Sports & Mental Well-being",
];

const sampleActivityCategories = [
  "Annual Sports & Athletics Meet",
  "Robotics, Coding & Science Fairs",
  "Performing Arts, Music & Drama",
  "Fine Arts, Craft & Design Exhibitions",
  "Community Service & Social Outreach",
  "Model United Nations (MUN) & Debates",
  "Cultural Festivals & Traditional Days",
  "Educational Field Trips & Excursions",
  "Inter-House Competitions & Tournaments",
  "Teacher Training & Faculty Development (CPD)",
];

async function seedCategories() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    // Seed 10 Blog Categories
    console.log("Seeding 10 Blog Categories...");
    for (const title of sampleBlogCategories) {
      await BlogCategory.updateOne(
        { title },
        { $set: { title } },
        { upsert: true }
      );
    }
    console.log("✅ Seeded 10 Blog Categories successfully.");

    // Seed 10 Activity Categories
    console.log("Seeding 10 Activity Categories...");
    for (const title of sampleActivityCategories) {
      await ActivityCategory.updateOne(
        { title },
        { $set: { title } },
        { upsert: true }
      );
    }
    console.log("✅ Seeded 10 Activity Categories successfully.");

    console.log("🎉 All 20 Categories (10 Blog + 10 Activity) seeded successfully into MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
