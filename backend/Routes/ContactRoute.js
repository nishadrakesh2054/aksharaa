const express = require("express");
const router = express.Router();
const contactform = require("../Controllers/ContactController");
const { validateContact } = require("../validators/contactValidator");
const { canManageAdmissions, canDelete } = require("../middleware/AuthMiddleware");

router.post("/contact", validateContact, contactform.contactData);
router.get("/getallcontacts", canManageAdmissions, contactform.getAllContacts);
router.put("/contact/status/:id", canManageAdmissions, contactform.toggleContactReadStatus);
router.delete("/contact/:id", canDelete, contactform.deleteContact);

module.exports = router;
