const asyncHandler = require("express-async-handler");
const Project = require("../Models/ProjectSchema");
const ApiResponse = require("../utils/apiResponse");
const { paginatedFind } = require("../utils/queryFeatures");

// GET /api/v1/projects
const getAllProjects = asyncHandler(async (req, res) => {
  const result = await paginatedFind({
    model: Project,
    req,
    searchFields: ["title", "description", "video"],
    useTextSearch: true,
    defaultSort: { createdAt: -1 },
  });
  return ApiResponse.success(res, 200, "Fetched all long term projects", {
    total: result.total,
    pagination: result.pagination,
    projects: result.items,
    data: result.items,
  });
});

// GET /api/v1/projects/:id
const getSingleProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return ApiResponse.error(res, 404, "Long term project not found");
  }
  return ApiResponse.success(res, 200, "Fetched project details", { project });
});

// POST /api/v1/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description, video } = req.body;
  if (!title || !description) {
    return ApiResponse.error(res, 400, "Project title and description are required");
  }

  let images = [];
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    images = req.files.map((file) => file.path);
  } else if (req.file) {
    images = [req.file.path];
  }

  const project = new Project({
    title,
    description,
    images,
    video: video || "",
  });
  await project.save();
  return ApiResponse.success(res, 201, "Long term project created successfully", project);
});

// PUT /api/v1/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, video } = req.body;
  const project = await Project.findById(id);

  if (!project) {
    return ApiResponse.error(res, 404, "Long term project not found");
  }

  if (title) project.title = title;
  if (description) project.description = description;
  if (video !== undefined) project.video = video;

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    project.images = req.files.map((file) => file.path);
  } else if (req.file) {
    project.images = [req.file.path];
  }

  await project.save();
  return ApiResponse.success(res, 200, "Long term project updated successfully", project);
});

// DELETE /api/v1/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    return ApiResponse.error(res, 404, "Long term project not found");
  }
  return ApiResponse.success(res, 200, "Long term project deleted successfully");
});

module.exports = {
  getAllProjects,
  getSingleProject,
  createProject,
  updateProject,
  deleteProject,
};
