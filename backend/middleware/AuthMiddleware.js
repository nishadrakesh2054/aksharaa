const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const ApiResponse = require("../utils/apiResponse");

const attachUserFromToken = async (req) => {
  let token = null;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return null;

  const secretKey = process.env.JWT_SECRETE_KEY || "rolexbhai123";
  const authData = jwt.verify(token, secretKey);
  const userId = authData.userId || authData.id;
  const userFound = await User.findById(userId);

  if (!userFound) return null;

  req.authData = authData;
  req.user = userFound;
  req.userAuthenticated = userFound;
  return userFound;
};

const checkIsUserAuthenticated = async (req, res, next) => {
  try {
    const userFound = await attachUserFromToken(req);

    if (!userFound) {
      return ApiResponse.error(res, 401, "Access denied. Authentication token required.");
    }

    return next();
  } catch (error) {
    return ApiResponse.error(res, 401, "Invalid or expired authentication token.");
  }
};

const optionalAuthentication = async (req, res, next) => {
  try {
    await attachUserFromToken(req);
  } catch (error) {
    req.authData = null;
    req.user = null;
    req.userAuthenticated = null;
  }
  next();
};

const authorizeRoles = (...roles) => [
  checkIsUserAuthenticated,
  (req, res, next) => {
    const role = req.user?.role || "admin";
    if (!roles.includes(role)) {
      return ApiResponse.error(res, 403, "You do not have permission to perform this action.");
    }
    next();
  },
];

const canManageContent = authorizeRoles("admin", "editor");
const canManageAdmissions = authorizeRoles("admin", "editor", "frontdesk");
const canDelete = authorizeRoles("admin", "editor");

module.exports = {
  checkIsUserAuthenticated,
  optionalAuthentication,
  authorizeRoles,
  canManageContent,
  canManageAdmissions,
  canDelete,
};
