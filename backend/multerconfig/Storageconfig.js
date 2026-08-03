const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dlzjltqep",
  api_key: process.env.CLOUDINARY_API_KEY || "152216473787662",
  api_secret: process.env.CLOUDINARY_API_SECRET || "7U9tBU0hDRwG44xrrFOX9avaulk",
});

const FIVE_MB = 5 * 1024 * 1024;
const TEN_MB = 10 * 1024 * 1024;

// Ensure upload directories exist locally as fallback
const uploadDirs = [
  "./uploads/blog",
  "./uploads/notices",
  "./uploads/ThreeDGallery",
  "./uploads/hero",
  "./uploads/activity",
  "./uploads/testimonial",
  "./uploads/profile",
  "./uploads/creativeweek",
  "./uploads/galleries",
  "./uploads/pdf",
  "./uploads/enquiries",
  "./uploads/academics",
  "./uploads/infrastructure",
  "./uploads/partners",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create Cloudinary Storage Helper
const createCloudinaryStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isPdf = file.mimetype === "application/pdf";
      const cleanName = path
        .basename(file.originalname, path.extname(file.originalname))
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      return {
        folder: `aksharaa_school/${folderName}`,
        resource_type: isPdf ? "raw" : "auto",
        public_id: `${folderName}-${Date.now()}-${cleanName}`,
      };
    },
  });
};

// File filters
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    const error = new Error("Only PDF files are allowed");
    error.statusCode = 400;
    cb(error);
  }
};

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only images (JPEG, PNG, JPG, WEBP, GIF, SVG) and videos (MP4, WEBM) are allowed");
    error.statusCode = 400;
    cb(error);
  }
};

const documentAndImageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only JPEG, PNG, JPG, WEBP, GIF, or PDF files are allowed");
    error.statusCode = 400;
    cb(error);
  }
};

// Multer Cloudinary Upload Instances
const blogUpload = multer({
  storage: createCloudinaryStorage("blog"),
  fileFilter: imageFileFilter,
  limits: { fileSize: TEN_MB },
});

const activityUpload = multer({
  storage: createCloudinaryStorage("activity"),
  fileFilter: imageFileFilter,
  limits: { fileSize: TEN_MB },
});

const noticesUpload = multer({
  storage: createCloudinaryStorage("notices"),
  fileFilter: documentAndImageFileFilter,
  limits: { fileSize: TEN_MB },
});

const ThreeDGalleryUpload = multer({
  storage: createCloudinaryStorage("3dgallery"),
  fileFilter: imageFileFilter,
  limits: { fileSize: TEN_MB },
});

const HeroUpload = multer({
  storage: createCloudinaryStorage("hero"),
  fileFilter: imageFileFilter,
  limits: { fileSize: TEN_MB },
});

const testimonialUpload = multer({
  storage: createCloudinaryStorage("testimonial"),
  fileFilter: imageFileFilter,
  limits: { fileSize: FIVE_MB },
});

const CreativeweekUpload = multer({
  storage: createCloudinaryStorage("creativeweek"),
  fileFilter: imageFileFilter,
  limits: { fileSize: FIVE_MB },
});

const ProfileUpload = multer({
  storage: createCloudinaryStorage("profile"),
  fileFilter: imageFileFilter,
  limits: { fileSize: FIVE_MB },
});

const galleriesUpload = multer({
  storage: createCloudinaryStorage("galleries"),
  fileFilter: imageFileFilter,
  limits: { fileSize: TEN_MB },
});

const projectsUpload = multer({
  storage: createCloudinaryStorage("projects"),
  fileFilter: imageFileFilter,
  limits: { fileSize: FIVE_MB },
});

const academicsUpload = multer({
  storage: createCloudinaryStorage("academics"),
  fileFilter: documentAndImageFileFilter,
  limits: { fileSize: TEN_MB },
});

const infrastructureUpload = multer({
  storage: createCloudinaryStorage("infrastructure"),
  fileFilter: imageFileFilter,
  limits: { fileSize: TEN_MB },
});

const partnerUpload = multer({
  storage: createCloudinaryStorage("partners"),
  fileFilter: imageFileFilter,
  limits: { fileSize: FIVE_MB },
});

const enquiryUpload = multer({
  storage: createCloudinaryStorage("enquiries"),
  fileFilter: documentAndImageFileFilter,
  limits: { fileSize: TEN_MB },
});

const pdfUpload = multer({
  storage: createCloudinaryStorage("pdf"),
  fileFilter: pdfFileFilter,
  limits: { fileSize: TEN_MB },
});

module.exports = {
  blogUpload,
  noticesUpload,
  ThreeDGalleryUpload,
  HeroUpload,
  activityUpload,
  testimonialUpload,
  CreativeweekUpload,
  galleriesUpload,
  pdfUpload,
  ProfileUpload,
  projectsUpload,
  enquiryUpload,
  academicsUpload,
  infrastructureUpload,
  partnerUpload,
  cloudinary,
};
