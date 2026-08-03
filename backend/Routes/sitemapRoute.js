const express = require("express");
const router = express.Router();
const Blog = require("../Models/BlogSchema");
const Activity = require("../Models/actvitiesSchema");
const asyncHandler = require("express-async-handler");

const SITE_URL = "https://www.aksharaaschool.edu.np";

// GET /sitemap.xml - Dynamic XML Sitemap for Google Search Console
router.get("/sitemap.xml", asyncHandler(async (req, res) => {
  const staticPages = [
    "",
    "/about",
    "/about/chairman",
    "/about/team",
    "/about/lrpa",
    "/academics/kindergarten",
    "/academics/elementary",
    "/academics/middle",
    "/academics/high",
    "/infrastructure",
    "/admission/policy",
    "/admission/procedure",
    "/apply-online",
    "/getinquiry",
    "/contact",
    "/akshara-mun",
    "/newsactivity",
  ];

  const blogs = await Blog.find({}, "_id updatedAt").lean();
  const activities = await Activity.find({}, "_id updatedAt").lean();

  const currentDate = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static URLs
  staticPages.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>\n`;
    xml += `    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Blog URLs
  blogs.forEach((item) => {
    const lastMod = item.updatedAt ? new Date(item.updatedAt).toISOString().split("T")[0] : currentDate;
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/blog/${item._id}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Activity URLs
  activities.forEach((item) => {
    const lastMod = item.updatedAt ? new Date(item.updatedAt).toISOString().split("T")[0] : currentDate;
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/newsactivity/${item._id}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
}));

module.exports = router;
