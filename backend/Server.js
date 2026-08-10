const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
process.chdir(__dirname);
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./utils/errorHandler");
const ApiError = require("./utils/apiError");
const createRateLimiter = require("./middleware/rateLimiter");
const securityHeaders = require("./middleware/securityHeaders");
const PORT = process.env.PORT || 5000;

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// Database connection
const ConnectDB = require("./DataBase/ConnectDb");
ConnectDB();

// Global Middlewares
app.use(morgan("dev"));
app.use(securityHeaders);
app.use(createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 600,
}));
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5172", "http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Sitemap XML route for Google search indexing

const sitemapRoute = require("./Routes/sitemapRoute");
app.use("/", sitemapRoute);

// Health check routes
app.get(["/health", "/api/v1/health"], (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// User routes
const userrouter = require("./Routes/UserRoutes");
app.use("/api/v1", userrouter);

// Blogs routes
const blogrouter = require("./Routes/BlogRoute");
app.use("/api/v1/blog", blogrouter);

// Notice routes
const noticerouter = require("./Routes/NoticeRoute");
app.use("/api/v1/notice", noticerouter);

// FAQ routes
const faqRouter = require("./Routes/faqRoute");
app.use("/api/v1/faqs", faqRouter);

// HeroPhotos routes
const herorouter = require("./Routes/heroRoute");
app.use("/api/v1/hero", herorouter);

// 3DPhotos-rotation routes
const ThreeDrouter = require("./Routes/GalleryThreeDRoute");
app.use("/api/v1/three", ThreeDrouter);

// Enquiry routes
const enquiryRouter = require("./Routes/enquiryRoute");
app.use("/api/v1/enquiry", enquiryRouter);

// Blog category routes
const blogCategoryRoute = require("./Routes/blogCategoryRoute");
app.use("/api/v1/category", blogCategoryRoute);

// Activity category routes
const activityCategoryRoute = require("./Routes/activityCategoryRoute");
app.use("/api/v1/activityCategory", activityCategoryRoute);

// Activities routes
const activityRoute = require("./Routes/activitiesRoute");
app.use("/api/v1/activity", activityRoute);

// Testimonial routes
const testimonialRoute = require("./Routes/testimonialRoute");
app.use("/api/v1/testimonial", testimonialRoute);

// Creative week routes
const CreativeRoute = require("./Routes/CreativeWeekRoute");
app.use("/api/v1/creative", CreativeRoute);

// Contact routes
const ContactRoute = require("./Routes/ContactRoute");
app.use("/api/v1", ContactRoute);

// Subscribe / Newsletter routes
const SubscribeRoute = require("./Routes/SubscribeRoute");
app.use("/api/v1", SubscribeRoute);

// Galleries routes
const GalleryRoute = require("./Routes/galleriesRoute");
app.use("/api/v1", GalleryRoute);

// PDF routes
const pdfRoute = require("./Routes/pdfRoute");
app.use("/api/v1", pdfRoute);

// Event routes
const EventRoute = require("./Routes/EventRoute");
app.use("/api/v1/events", EventRoute);

// Calendar routes
const CalendarRoute = require("./Routes/CalendarRoute");
app.use("/api/v1/calendar", CalendarRoute);

// Long Term Projects routes
const ProjectRoute = require("./Routes/ProjectRoute");
app.use("/api/v1/projects", ProjectRoute);

// Infrastructure routes
const InfrastructureRoute = require("./Routes/InfrastructureRoute");
app.use("/api/v1/infrastructure", InfrastructureRoute);

// Educational Partners routes
const PartnerRoute = require("./Routes/PartnerRoute");
app.use("/api/v1/partners", PartnerRoute);

// Academics routes (Kindergarten, Elementary, Middle, Senior)
const AcademicRoute = require("./Routes/AcademicRoute");
app.use("/api/v1/academic", AcademicRoute);

// Aksharaa MUN route
const MunRoute = require("./Routes/MunRoute");
app.use("/api/v1/mun", MunRoute);

// Profile & Team Banner routes
const TeamBannerRoute = require("./Routes/teamBannerRoute");
app.use("/api/v1/teambanners", TeamBannerRoute);

const profileRoute = require("./Routes/profileRoute");
app.use("/api/v1", profileRoute);

// Chairman / leadership messages routes
const chairmanMessageRoute = require("./Routes/chairmanMessageRoute");
app.use("/api/v1/chairman-messages", chairmanMessageRoute);

// Vision & Mission routes
const visionMissionRoute = require("./Routes/visionMissionRoute");
app.use("/api/v1/vision-mission", visionMissionRoute);

// Core Values Framework route
const coreValuesFrameworkRoute = require("./Routes/coreValuesFrameworkRoute");
app.use("/api/v1/core-values-framework", coreValuesFrameworkRoute);

// Catch-all 404 handler for undefined API routes
app.use("*", (req, res, next) => {
  next(new ApiError(404, `API route '${req.originalUrl}' not found`));
});

// Centralized error handling middleware MUST be mounted last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
