const express = require("express");
const router = express.Router();
const enquiryController = require("../Controllers/enquiryController");
const { enquiryUpload } = require("../multerconfig/Storageconfig");
const { canManageAdmissions, canDelete } = require("../middleware/AuthMiddleware");

const uploadFields = enquiryUpload.fields([
  { name: "studentPhoto", maxCount: 1 },
  { name: "birthCertificate", maxCount: 1 },
  { name: "fatherPhoto", maxCount: 1 },
  { name: "motherPhoto", maxCount: 1 },
  { name: "guardianPhoto", maxCount: 1 },
  { name: "previousMarksheet", maxCount: 1 },
  { name: "transferCertificate", maxCount: 1 },
  { name: "citizenshipDoc", maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadFields(req, res, function (err) {
    if (err) {
      return next(err);
    }
    next();
  });
};

router
  .route("/")
  .post(handleUpload, enquiryController.postEnquiry)
  .get(canManageAdmissions, enquiryController.getEnquiry);

router.put("/status/:id", canManageAdmissions, enquiryController.toggleEnquiryReadStatus);
router.delete("/:id", canDelete, enquiryController.deleteEnquiry);

module.exports = router;
