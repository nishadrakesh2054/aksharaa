class ApiResponse {
  static success(res, statusCode = 200, message = "Success", data = null) {
    const response = {
      success: true,
      message,
    };
    if (data !== null && data !== undefined) {
      response.data = data;
      if (typeof data === "object" && !Array.isArray(data)) {
        Object.assign(response, data);
      }
    }
    return res.status(statusCode).json(response);
  }

  static error(res, statusCode = 500, message = "Internal Server Error", errors = []) {
    const response = {
      success: false,
      message,
    };
    if (errors && errors.length > 0) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
