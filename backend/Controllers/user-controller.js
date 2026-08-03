const User = require("../Models/UserSchema");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");

const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY || "rolexbhai123";
const ALLOWED_ROLES = ["admin", "editor", "frontdesk"];

const envAdminEmail = () => String(process.env.Admin_Email || process.env.ADMIN_EMAIL || "").toLowerCase().trim();
const envAdminPassword = () => String(process.env.Admin_password || process.env.ADMIN_PASSWORD || "");
const envAdminName = () => String(process.env.Admin_Name || process.env.ADMIN_NAME || "System Admin").trim();

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "admin",
  verified: user.verified,
});

const signLoginToken = (user, remember = false) => jwt.sign(
  { userId: user._id.toString(), role: user.role || "admin" },
  process.env.JWT_SECRETE_KEY || JWT_SECRETE_KEY,
  { expiresIn: remember ? "30d" : "8h" }
);

const sendLoginResponse = (res, user, remember = false) => {
  const token = signLoginToken(user, remember);
  const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });

  return ApiResponse.success(res, 200, "Login successful", {
    token: `Bearer ${token}`,
    expiresIn: remember ? "30d" : "8h",
    name: user.name,
    email: user.email,
    role: user.role || "admin",
    user: sanitizeUser(user),
  });
};

// ------------------- registration process -------------------
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({});
  if (userExists) {
    const currentUser = req.user || req.userAuthenticated;
    if (!currentUser || currentUser.role !== "admin") {
      return ApiResponse.error(res, 403, "Only admin can create staff accounts.");
    }
  }

  const duplicateEmail = await User.findOne({ email });
  if (duplicateEmail) {
    return ApiResponse.error(res, 400, "User account with this email already exists.");
  }

  const selectedRole = userExists && ALLOWED_ROLES.includes(role) ? role : "admin";

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: selectedRole,
  });
  await newUser.save();

  return ApiResponse.success(res, 201, userExists ? "Staff account created successfully" : "Admin account created successfully", sanitizeUser(newUser));
});

// ------------------- login process -------------------
const login = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  const shouldRemember = remember === true || remember === "true";

  if (envAdminEmail() && envAdminPassword() && normalizedEmail === envAdminEmail() && password === envAdminPassword()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: envAdminName(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin",
        verified: true,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return sendLoginResponse(res, admin, shouldRemember);
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return ApiResponse.error(res, 404, "User account not found with this email.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return ApiResponse.error(res, 401, "Invalid email or password.");
  }

  return sendLoginResponse(res, user, shouldRemember);
});

// ------------------- logout user -------------------
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
    httpOnly: true,
  });
  return ApiResponse.success(res, 200, "Logged out successfully");
});

// ------------------- profile user -------------------
const profile = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.userAuthenticated;
  const userProfile = currentUser.toObject ? currentUser.toObject() : currentUser;
  delete userProfile.password;

  return ApiResponse.success(res, 200, "Admin profile fetched successfully", { profile: userProfile });
});

// ------------------- change password -------------------
const changePassword = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.userAuthenticated;
  const { oldPassword, newPassword } = req.body;

  const passwordMatch = await bcrypt.compare(oldPassword, currentUser.password);
  if (!passwordMatch) {
    return ApiResponse.error(res, 401, "Current password is incorrect.");
  }

  const saltRounds = 10;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  currentUser.password = hashedNewPassword;
  await currentUser.save();

  return ApiResponse.success(res, 200, "Password changed successfully");
});

// ------------------- forget password -------------------
const forgetpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });

  if (!existingUser) {
    return ApiResponse.error(res, 404, "No account found with this email address.");
  }

  const resetToken = jwt.sign(
    { id: existingUser._id.toString() },
    process.env.JWT_SECRETE_KEY || JWT_SECRETE_KEY,
    { expiresIn: "4h" }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
      pass: process.env.EMAIL_PASS || "pnvh gmbs hzrd wdzc",
    },
  });

  const resetUrl = `http://localhost:5173/resetpassword/${existingUser._id}/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER || "sahanirakesh877@gmail.com",
    to: email,
    subject: "Password Reset Request",
    text: resetUrl,
    html: `
      <h1>Password Reset Request</h1>
      <p>Hello ${existingUser.name},</p>
      <p>You have requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return ApiResponse.success(res, 200, "Password reset link sent successfully to email");
});

// ------------------- reset password -------------------
const resetPassword = asyncHandler(async (req, res) => {
  const { id, resetToken } = req.params;
  const { newPassword } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRETE_KEY || JWT_SECRETE_KEY);
  } catch (err) {
    return ApiResponse.error(res, 401, "Invalid or expired reset token.");
  }

  const user = await User.findById(id || decoded.id);
  if (!user) {
    return ApiResponse.error(res, 404, "User account not found.");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  user.password = hashedPassword;
  await user.save();

  return ApiResponse.success(res, 200, "Password reset successfully");
});

// ------------------- check server status -------------------
const checkServerStatus = asyncHandler(async (req, res) => {
  const userExists = await User.findOne({});
  return ApiResponse.success(res, 200, "Server status retrieved successfully", {
    stat: userExists || (envAdminEmail() && envAdminPassword()) ? 1 : 0,
  });
});

// ------------------- get user by token -------------------
const getUserByToken = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.userAuthenticated;
  if (!currentUser) {
    return ApiResponse.error(res, 404, "User account not found.");
  }
  return ApiResponse.success(res, 200, "User details fetched successfully", {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role || "admin",
    user: sanitizeUser(currentUser),
  });
});

module.exports = {
  register,
  login,
  logout,
  changePassword,
  resetPassword,
  forgetpassword,
  profile,
  checkServerStatus,
  getUserByToken,
};
