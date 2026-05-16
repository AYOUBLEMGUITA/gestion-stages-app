const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const analyticsController = require("../controllers/analytics.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  analyticsController.getAnalytics
);

router.get(
  "/export-users",
  authMiddleware,
  roleMiddleware("admin"),
  analyticsController.exportData
);

module.exports = router;