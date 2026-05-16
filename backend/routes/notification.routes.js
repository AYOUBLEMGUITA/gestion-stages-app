const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const notificationController = require("../controllers/notification.controller");

router.get("/", authMiddleware, notificationController.getMyNotifications);
router.put("/:id/read", authMiddleware, notificationController.markAsRead);
router.put("/read-all/all", authMiddleware, notificationController.markAllAsRead);
router.delete("/:id", authMiddleware, notificationController.deleteNotification);

module.exports = router;