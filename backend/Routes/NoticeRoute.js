const express = require("express");
const router = express.Router();
const noticeController = require("../Controllers/NoticeController");
const upload = require("../multerconfig/Storageconfig");
const { canManageContent } = require("../middleware/AuthMiddleware");
const { validateContact } = require("../validators/contactValidator");
const { validateSubscribeNewsletter } = require("../validators/noticeValidator");
const { validateMongoId } = require("../validators/commonValidator");

router
  .route("/createnotice")
  .post(
    canManageContent,
    upload.noticesUpload.single("Noticeimage"),
    noticeController.createNotice
  );

router.route("/getallnotice").get(noticeController.getNotices);

router
  .route("/getnotice/:id")
  .get(validateMongoId("id"), noticeController.getNoticeById);

router
  .route("/updatenotice/:id")
  .put(
    canManageContent,
    validateMongoId("id"),
    upload.noticesUpload.single("Noticeimage"),
    noticeController.updateNotice
  );

router
  .route("/toggle-status/:id")
  .patch(
    canManageContent,
    validateMongoId("id"),
    noticeController.toggleNoticeStatus
  );


router
  .route("/deletenotice/:id")
  .delete(
    canManageContent,
    validateMongoId("id"),
    noticeController.deleteNotice
  );

router
  .route("/contact")
  .post(validateContact, noticeController.contactHandler);

router
  .route("/subscribe")
  .post(validateSubscribeNewsletter, noticeController.NewsLetter);

module.exports = router;
