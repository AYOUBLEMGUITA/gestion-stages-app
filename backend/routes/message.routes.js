const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const messageController = require("../controllers/message.controller");

router.get("/users", authMiddleware, messageController.getUsersForMessaging);
router.get("/inbox", authMiddleware, messageController.getInbox);
router.get("/conversation/:otherUserId", authMiddleware, messageController.getConversation);
router.post("/", authMiddleware, messageController.sendMessage);

module.exports = router;