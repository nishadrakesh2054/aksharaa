const express = require("express");
const router = express.Router();
const subscribeController = require("../Controllers/SubscribeController");
const { canManageAdmissions, canDelete } = require("../middleware/AuthMiddleware");

router.post("/subscribe", subscribeController.createSubscription);
router.get("/getallsubscribers", canManageAdmissions, subscribeController.getAllSubscribers);
router.put("/subscribe/status/:id", canManageAdmissions, subscribeController.toggleSubscriberReadStatus);
router.delete("/subscribe/:id", canDelete, subscribeController.deleteSubscriber);

module.exports = router;
