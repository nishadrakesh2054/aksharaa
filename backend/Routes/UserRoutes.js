const express = require("express");
const router = express.Router();
const { checkIsUserAuthenticated, optionalAuthentication } = require("../middleware/AuthMiddleware");
const usercontroller = require("../Controllers/user-controller");
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgetPassword,
  validateResetPassword,
} = require("../validators/userValidator");

router.route("/stat").get(usercontroller.checkServerStatus);

router.route("/register").post(optionalAuthentication, validateRegister, usercontroller.register);
router.route("/login").post(validateLogin, usercontroller.login);
router.route("/logout").get(usercontroller.logout);

router.route("/profile").get(checkIsUserAuthenticated, usercontroller.profile);

router
  .route("/changepassword")
  .post(checkIsUserAuthenticated, validateChangePassword, usercontroller.changePassword);

router
  .route("/forgetpassword")
  .post(validateForgetPassword, usercontroller.forgetpassword);

router
  .route("/resetpassword/:id/:resetToken")
  .post(validateResetPassword, usercontroller.resetPassword);

router
  .route("/userTokenValidation")
  .get(checkIsUserAuthenticated, usercontroller.getUserByToken);

module.exports = router;
