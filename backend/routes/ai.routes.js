const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const aiController = require("../controllers/ai.controller");

router.post("/chatbot", authMiddleware, aiController.chatbot);

router.get(
  "/recommendations",
  authMiddleware,
  roleMiddleware("stagiaire"),
  aiController.recommendations
);

module.exports = router;