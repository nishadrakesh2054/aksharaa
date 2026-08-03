const asyncHandler = require("express-async-handler");
const Blog = require("../Models/BlogSchema");
const path = require("path");
const fs = require("fs");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

// Helper to safely delete file
const safeUnlink = (relativePath) => {
  if (!relativePath) return;
  const filePath = path.normalize(path.join(__dirname, "..", relativePath));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file at ${filePath}:`, err.message);
    }
  }
};

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 400, "Blog image file is required.");
  }

  const { title, description, category } = req.body;
  const image = req.file.path;

  const newBlog = new Blog({
    title,
    description,
    image,
    ...(category && { category }),
  });

  const savedBlog = await newBlog.save();
  return ApiResponse.success(res, 201, "Blog created successfully", savedBlog);
});

// Get all Blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  const filter = categoryId ? { category: categoryId } : {};
  const result = await paginatedFind({
    model: Blog,
    req,
    filter,
    searchFields: ["title", "description"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
    populate: { path: "category", select: "title" },
  });

  return ApiResponse.success(res, 200, "Blogs retrieved successfully", {
    total: result.total,
    pagination: result.pagination,
    blogs: result.items,
    data: result.items,
  });
});

// Get single Blog
const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId).populate({ path: "category", select: "title" }).lean();

  if (!blog) {
    return ApiResponse.error(res, 404, "Blog post not found.");
  }

  return ApiResponse.success(res, 200, "Blog retrieved successfully", { blog, data: blog });
});

// Update Blog by ID
const updateBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const { title, description, selectedCategory, category } = req.body;

  const categoryToUpdate = selectedCategory || category;
  const updateData = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (categoryToUpdate) updateData.category = categoryToUpdate;

  if (req.file) {
    const existingBlog = await Blog.findById(blogId);
    if (existingBlog && existingBlog.image) {
      safeUnlink(existingBlog.image);
    }
    updateData.image = req.file.path;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
    new: true,
    runValidators: true,
  }).populate({ path: "category", select: "title" });

  if (!updatedBlog) {
    return ApiResponse.error(res, 404, "Blog post not found.");
  }

  return ApiResponse.success(res, 200, "Blog updated successfully", updatedBlog);
});


// Delete single Blog
const deleteBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const deleteBlog = await Blog.findByIdAndDelete(blogId);

  if (!deleteBlog) {
    return ApiResponse.error(res, 404, "Blog post not found.");
  }

  safeUnlink(deleteBlog.image);

  const totalCount = await Blog.countDocuments();

  return ApiResponse.success(res, 200, "Blog deleted successfully", {
    total: totalCount,
    deletedId: blogId,
  });
});

// Delete all Blogs
const deleteAllBlogs = asyncHandler(async (req, res) => {
  const allBlogs = await Blog.find({});
  allBlogs.forEach((blog) => safeUnlink(blog.image));

  const result = await Blog.deleteMany({});
  return ApiResponse.success(res, 200, "All blogs deleted successfully", {
    deletedCount: result.deletedCount,
  });
});

// Reupload image
const reuploadImage = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  if (!req.file) {
    return ApiResponse.error(res, 400, "Image file is required for reupload.");
  }

  const blogFound = await Blog.findById(blogId);
  if (!blogFound) {
    return ApiResponse.error(res, 404, "Blog post not found.");
  }

  safeUnlink(blogFound.image);

  blogFound.image = req.file.path;
  await blogFound.save();

  return ApiResponse.success(res, 200, "Blog image updated successfully", blogFound);
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogById,
  deleteAllBlogs,
  deleteBlogById,
  reuploadImage,
};
