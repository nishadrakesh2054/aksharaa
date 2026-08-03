const ApiError = require("./apiError");

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || (error.status ? error.status : 500);
    let message = error.message || "Internal server error";
    let errors = [];

    if (error.name === "ValidationError" && error.errors) {
      statusCode = 400;
      message = "Validation Error";
      errors = Object.values(error.errors).map((val) => val.message);
    } else if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue || {})[0];
      message = field ? `Duplicate field value entered for '${field}'` : "Duplicate key error";
    } else if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid format for field '${error.path}'`;
    } else if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid authentication token";
    } else if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Authentication token expired";
    } else if (error.name === "MulterError") {
      statusCode = 400;
      if (error.code === "LIMIT_FILE_SIZE") {
        message = error.field === "pdfFile"
          ? "PDF file size must be 10MB or less."
          : "Image size must be 2MB or less.";
      } else if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") {
        message = "Too many files uploaded. Please select only the allowed number of files.";
      } else {
        message = `File upload error: ${error.message}`;
      }
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
