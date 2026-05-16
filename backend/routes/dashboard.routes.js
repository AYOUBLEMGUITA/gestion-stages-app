const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/stats", authMiddleware, dashboardController.getStats);

module.exports = router;